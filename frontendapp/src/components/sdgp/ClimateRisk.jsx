import { useEffect, useState } from "react";
import "./ClimateRisk.css";

const DISTRICTS = {
  Talawakelle: { lat: 6.94, lon: 80.79 },
  Hatton: { lat: 6.9, lon: 80.6 },
  "Nuwara Eliya": { lat: 6.97, lon: 80.77 },
  Kothmale: { lat: 7.02, lon: 80.65 },
};

export default function ClimateRisk() {
  const [district, setDistrict] = useState("Talawakelle");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const { lat, lon } = DISTRICTS[district];

  useEffect(() => {
    if (!API_KEY) {
      console.error("Weather API key missing");
      return;
    }

    setLoading(true);

    // Current Weather
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        setWeather(data);
      })
      .catch((err) => console.error(err));

    // Forecast
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        const daily =
          data.list?.filter((_, i) => i % 8 === 0).slice(0, 7) || [];
        setForecast(daily);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [district, lat, lon, API_KEY]);

  if (loading) {
    return <div className="loading">Loading climate data...</div>;
  }

  if (!weather || !weather.main) {
    return <div className="loading">Weather data unavailable</div>;
  }

  return (
    <div className="climate-container colorful">
      {/* HEADER */}
      <div className="climate-header">
        <div>
          <h2>{district} Tea Plantation</h2>
          <span>Live Climate Conditions</span>
        </div>

        <select
          className="district-select"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        >
          {Object.keys(DISTRICTS).map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* METRIC CARDS */}
      <div className="metric-grid">
        <div className="metric-card temp">
          <h1>{Math.round(weather.main.temp)}°C</h1>
          <p>Temperature</p>
        </div>

        <div className="metric-card humidity">
          <h1>{weather.main.humidity}%</h1>
          <p>Humidity</p>
          <span className="badge">
            {weather.main.humidity > 80 ? "High Risk" : "Normal"}
          </span>
        </div>

        <div className="metric-card wind">
          <h1>{weather.wind?.speed ?? 0} km/h</h1>
          <p>Wind Speed</p>
          <span className="badge">
            {weather.wind?.speed > 10 ? "High Risk" : "Normal"}
          </span>
        </div>

        <div className="metric-card rain">
          <h1>{weather.rain?.["1h"] ?? 0} mm</h1>
          <p>Rainfall (1h)</p>
        </div>
      </div>

      {/* FORECAST */}
      <h3 className="section-title">7-Day Forecast</h3>

      <div className="forecast-row">
        {forecast.map((day, i) => (
          <div className="forecast-card" key={i}>
            <span className="day">
              {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </span>

            <img
              src={`https://openweathermap.org/img/wn/${day.weather?.[0]?.icon}.png`}
              alt="weather icon"
            />

            <span className="temp">
              {Math.round(day.main?.temp ?? 0)}°C
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}