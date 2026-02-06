import requests
import pandas as pd


LATITUDE = 7.32235810916039,     #Location of Rangala
LONGITUDE = 80.77659211055081   

START_DATE = "2021-01-01"
END_DATE = "2025-12-31"

OUTPUT_FILE = "monthly_weather_2021_2025.csv"


url = "https://archive-api.open-meteo.com/v1/archive"

params = {
    "latitude": LATITUDE,
    "longitude": LONGITUDE,
    "start_date": START_DATE,
    "end_date": END_DATE,
    "daily": [
        "temperature_2m_mean",
        "precipitation_sum",
        "relative_humidity_2m_mean"
    ],
    "timezone": "Asia/Colombo"
}

response = requests.get(url, params=params)
data = response.json()


daily_df = pd.DataFrame({
    "date": pd.to_datetime(data["daily"]["time"]),
    "temperature_avg": data["daily"]["temperature_2m_mean"],
    "rainfall": data["daily"]["precipitation_sum"],
    "humidity_avg": data["daily"]["relative_humidity_2m_mean"]
})


daily_df["year"] = daily_df["date"].dt.year
daily_df["month"] = daily_df["date"].dt.month

monthly_df = daily_df.groupby(["year", "month"]).agg({
    "temperature_avg": "mean",
    "rainfall": "mean",     
    "humidity_avg": "mean"
}).reset_index()

# Round values for neatness
monthly_df["temperature_avg"] = monthly_df["temperature_avg"].round(2)
monthly_df["rainfall"] = monthly_df["rainfall"].round(2)
monthly_df["humidity_avg"] = monthly_df["humidity_avg"].round(2)

# SAVE TO CSV
monthly_df.to_csv(OUTPUT_FILE, index=False)

print("✅ Monthly weather data saved successfully!")
print(monthly_df.head())
