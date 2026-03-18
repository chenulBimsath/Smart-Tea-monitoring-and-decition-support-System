import os
import pandas as pd
import joblib
from datetime import date, datetime
from supabase import create_client
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from dotenv import load_dotenv

load_dotenv()

supabase   = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_KEY"])
MODEL_PATH = "yield_model.pkl"

MONTH_MAP = {
    "jan":1,"feb":2,"mar":3,"apr":4,"may":5,"jun":6,
    "jul":7,"aug":8,"sep":9,"oct":10,"nov":11,"dec":12,
    "january":1,"february":2,"march":3,"april":4,"june":6,
    "july":7,"august":8,"september":9,"october":10,"november":11,"december":12,
}


def fetch_training_data():
    """Read all historical data from division_ndvi_climate."""
    print("Fetching division_ndvi_climate...")
    res = supabase.table("division_ndvi_climate").select(
        "division_id, year, month, green_leaf, pluckers, "
        "avg_temperature, avg_rainfall, avg_humidity, ndvi_avg"
    ).execute()
    df = pd.DataFrame(res.data)
    print(f"  {len(df)} rows")
    return df


def fetch_divisions():
    """Get division_id → division_name mapping."""
    print("Fetching divisions...")
    res = supabase.table("division").select("division_id, division_name").execute()
    div_map = {row["division_id"]: row["division_name"] for row in res.data}
    print(f"  {len(div_map)} divisions: {list(div_map.values())}")
    return div_map


def fetch_live_weather():
    """Get the latest weather+NDVI reading per division from daily_weather_ndvi."""
    print("Fetching latest daily_weather_ndvi...")
    res = supabase.table("daily_weather_ndvi").select(
        "division, temperature, rainfall, humidity, ndvi_value, record_date"
    ).order("record_date", desc=True).execute()

    df = pd.DataFrame(res.data or [])
    if df.empty:
        print("  No live data yet — will use historical averages as fallback")
        return {}

    df["division"] = df["division"].str.strip().str.upper()
    # one row per division (most recent)
    latest = df.drop_duplicates(subset="division", keep="first")
    live = {
        row["division"]: {
            "temperature": row["temperature"],
            "rainfall":    row["rainfall"],
            "humidity":    row["humidity"],
            "ndvi":        row["ndvi_value"],
        }
        for _, row in latest.iterrows()
    }
    print(f"  Live data for: {list(live.keys())}")
    return live


def build_training_df(raw_df, div_map):
    """Merge division names and clean the dataframe for training."""
    df = raw_df.copy()
    df["division"] = df["division_id"].map(div_map)
    df = df.dropna(subset=["division"])

    df = df.rename(columns={
        "green_leaf":      "Yield",
        "pluckers":        "Pluckers",
        "avg_temperature": "Temperature",
        "avg_rainfall":    "Rainfall",
        "avg_humidity":    "Humidity",
        "ndvi_avg":        "NDVI",
    })

    # Handle month stored as text ("Jan", "January", etc.)
    if df["month"].dtype == object:
        df["month_num"] = df["month"].str.lower().str.strip().map(MONTH_MAP)
    else:
        df["month_num"] = pd.to_numeric(df["month"], errors="coerce")

    for col in ["Yield", "Pluckers", "Temperature", "Rainfall", "Humidity", "NDVI"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    # Fill missing climate values with division average
    for col in ["Temperature", "Rainfall", "Humidity", "NDVI"]:
        df[col] = df.groupby("division")[col].transform(lambda x: x.fillna(x.mean()))
        df[col] = df[col].fillna(df[col].mean())  # global fallback

    df = df.dropna(subset=["Yield", "Pluckers"])
    df = df[(df["Pluckers"] > 0) & (df["Yield"] > 0)]

    print(f"  Training set: {len(df)} rows across {df['division'].nunique()} divisions")
    return df


def train_model(df):
    features = ["Pluckers", "Temperature", "Rainfall", "Humidity", "NDVI"]
    X, y = df[features], df["Yield"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    mae = mean_absolute_error(y_test, model.predict(X_test))
    r2  = r2_score(y_test, model.predict(X_test))
    joblib.dump(model, MODEL_PATH)

    imps = dict(zip(features, [round(v*100,1) for v in model.feature_importances_]))
    print(f"  MAE: {mae:.2f} kg | R²: {r2:.4f} | Importances: {imps}")
    return model, mae, r2


def generate_predictions(df, model, div_map, live_data):
    today      = date.today()
    next_month = today.month + 1 if today.month < 12 else 1
    next_year  = today.year     if today.month < 12 else today.year + 1
    predictions = []

    for division_id, division_name in div_map.items():
        div_upper = division_name.strip().upper()
        div_hist  = df[df["division"] == division_name]

        if div_hist.empty:
            print(f"  ⚠️  No history for {division_name} — skipping")
            continue

        # Prefer live data, fall back to historical division average
        if div_upper in live_data:
            ld = live_data[div_upper]
            temp = ld["temperature"] if ld["temperature"] is not None else float(div_hist["Temperature"].mean())
            rain = ld["rainfall"]    if ld["rainfall"]    is not None else float(div_hist["Rainfall"].mean())
            hum  = ld["humidity"]    if ld["humidity"]    is not None else float(div_hist["Humidity"].mean())
            ndvi = ld["ndvi"]        if ld["ndvi"]        is not None else float(div_hist["NDVI"].mean())
            src  = "LIVE"
        else:
            temp = float(div_hist["Temperature"].mean())
            rain = float(div_hist["Rainfall"].mean())
            hum  = float(div_hist["Humidity"].mean())
            ndvi = float(div_hist["NDVI"].mean())
            src  = "HISTORICAL AVG"

        # Use most recent plucker count
        pluckers = float(
            div_hist.sort_values(["year", "month_num"], ascending=False).iloc[0]["Pluckers"]
        )

        feat      = pd.DataFrame([[pluckers, temp, rain, hum, ndvi]],
                                  columns=["Pluckers","Temperature","Rainfall","Humidity","NDVI"])
        predicted = round(float(model.predict(feat)[0]), 2)

        predictions.append({
            "year":            next_year,
            "month":           next_month,
            "division":        division_name,
            "predicted_yield": predicted,
        })
        print(f"  [{src}] {division_name}: {predicted:>10,.0f} kg  ({next_year}-{next_month:02d})")

    return predictions


def save_predictions(predictions):
    print(f"\nSaving {len(predictions)} rows to monthly_predicted_yield...")
    for p in predictions:
        # Replace any existing prediction for this division/year/month
        supabase.table("monthly_predicted_yield") \
            .delete() \
            .eq("division", p["division"]) \
            .eq("year",     p["year"]) \
            .eq("month",    p["month"]) \
            .execute()
        supabase.table("monthly_predicted_yield").insert(p).execute()
    print("  ✅ All predictions saved")


if __name__ == "__main__":
    print(f"\n{'='*55}")
    print(f"  Yield Prediction ML — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*55}\n")

    raw_df  = fetch_training_data()
    div_map = fetch_divisions()
    live    = fetch_live_weather()
    df      = build_training_df(raw_df, div_map)
    model, mae, r2 = train_model(df)

    print(f"\nGenerating predictions...")
    preds = generate_predictions(df, model, div_map, live)
    save_predictions(preds)
    print(f"\n🎉 Done! React will now show updated predictions via Spring Boot.\n")
