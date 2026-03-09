import requests
import pandas as pd


rangala_plantation_polygon = [
(7.350666491361699,80.79816978494215),
(7.350394432499272,80.79794057548042),
(7.350200448983159,80.79745350963381),
(7.349755324076443,80.7972850386551),
(7.349534287420904,80.79733061482216),
(7.349320069813151,80.7974608725294),
(7.349301337071236,80.79785191941865),
(7.348696631201445,80.79834481282188),
(7.348122749129699,80.79872873372183),
(7.347903881298127,80.79882593166347),
(7.347484298340005,80.7985863935918),
(7.34740413017259,80.79888200802225),
(7.347346741056072,80.7992176375716),
(7.347787286143935,80.79942825130613),
(7.348070829129957,80.79947677439512),
(7.348250794766974,80.79993089170826),
(7.348134653103195,80.80022882063614),
(7.347977748067785,80.80063737539379),
(7.347945973718199,80.80106517916755),
(7.348112488880608,80.80128968790082),
(7.348459078123514,80.8015065873118),
(7.348640405578784,80.80177331629753),
(7.348327881553223,80.80195933229518),
(7.348136273441507,80.80233978408663),
(7.347953271795977,80.80244136596977),
(7.34761257990041,80.80231557365266)
]


latitudes = [p[0] for p in rangala_plantation_polygon]
longitudes = [p[1] for p in rangala_plantation_polygon]

LATITUDE = sum(latitudes) / len(latitudes)
LONGITUDE = sum(longitudes) / len(longitudes)

print("Using centroid location:")
print("Latitude:", LATITUDE)
print("Longitude:", LONGITUDE)


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

print("\nFetching weather data...")

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


monthly_df["temperature_avg"] = monthly_df["temperature_avg"].round(2)
monthly_df["rainfall"] = monthly_df["rainfall"].round(2)
monthly_df["humidity_avg"] = monthly_df["humidity_avg"].round(2)


monthly_df.to_csv(OUTPUT_FILE, index=False)

print("\n✅ Monthly weather data saved successfully!")
print("File:", OUTPUT_FILE)

print("\nSample Data:")
print(monthly_df.head())