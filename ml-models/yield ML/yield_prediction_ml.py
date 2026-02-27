import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error


data = pd.read_csv("yield_prediction_dataset.csv")

print(data.describe())

X = data[["Pluckers", "Temperature", "Rainfall", "Humidity", "NDVI"]]
y = data["Yield"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)
print("Model trained successfully")

predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)

print("Mean Absolute Error:", mae)

def predict_yield():
    rainfall = float(input("Enter Rainfall (mm): "))
    temperature = float(input("Enter Temperature (°C): "))
    humidity = float(input("Enter Humidity (%): "))
    ndvi = float(input("Enter NDVI (0–1): "))
    pluckers = int(input("Enter Number of Pluckers: "))

    input_data = [[rainfall, temperature, humidity, ndvi, pluckers]]
    predicted = model.predict(input_data)

    print(f"\nPredicted Tea Yield: {predicted[0]:.2f} kg")

predict_yield()
