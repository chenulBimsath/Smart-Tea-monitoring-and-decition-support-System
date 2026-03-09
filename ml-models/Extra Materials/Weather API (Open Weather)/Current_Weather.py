import requests

# Rangala plantation polygon (lat, lon)
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

# Calculate centroid
latitudes = [p[0] for p in rangala_plantation_polygon]
longitudes = [p[1] for p in rangala_plantation_polygon]

LATITUDE = sum(latitudes) / len(latitudes)
LONGITUDE = sum(longitudes) / len(longitudes)

print("Plantation center:")
print("Latitude:", LATITUDE)
print("Longitude:", LONGITUDE)

# Open-Meteo API
url = "https://api.open-meteo.com/v1/forecast"

params = {
    "latitude": LATITUDE,
    "longitude": LONGITUDE,
    "current": [
        "temperature_2m",
        "relative_humidity_2m",
        "precipitation",
        "wind_speed_10m"
    ],
    "timezone": "Asia/Colombo"
}

response = requests.get(url, params=params)
data = response.json()

current = data["current"]

print("\n🌤 Current Weather for Rangala Plantation")
print("-----------------------------------")
print("Time:", current["time"])
print("Temperature:", current["temperature_2m"], "°C")
print("Humidity:", current["relative_humidity_2m"], "%")
print("Rainfall:", current["precipitation"], "mm")
print("Wind Speed:", current["wind_speed_10m"], "km/h")