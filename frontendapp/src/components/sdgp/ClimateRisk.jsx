import { useEffect, useState } from "react";
import "./ClimateRisk.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const DISTRICTS = {
  Rangala: { lat: 7.327, lon: 80.820 },
  Galle: { lat: 6.0535, lon: 80.221 },
  "Nuwara Eliya": { lat: 6.9497, lon: 80.7891 },
  Badulla: { lat: 6.9934, lon: 81.0550 }
};

export default function ClimateRisk() {

  const [district, setDistrict] = useState("Rangala");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const { lat, lon } = DISTRICTS[district];

  useEffect(() => {

    setLoading(true);

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => setWeather(data));

    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {

        const daily =
          data.list?.filter((_, i) => i % 8 === 0).slice(0, 7) || [];

        setForecast(daily);
        setLoading(false);

      });

  }, [district, lat, lon, API_KEY]);

  if (loading) {
    return <div className="loading">Loading climate data...</div>;
  }

  if (!weather || !weather.main) {
    return <div className="loading">Weather data unavailable</div>;
  }

  /* Chart Data */

  const chartData = {
    labels: forecast.map((day) =>
      new Date(day.dt * 1000).toLocaleDateString("en-US", {
        weekday: "short",
      })
    ),

    datasets: [
      {
        label: "Temperature °C",
        data: forecast.map((day) => day.main.temp),
        borderColor: "#ff7a18",
        backgroundColor: "rgba(255,122,24,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => value + "°C",
        },
      },
    },
  };

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
            <option key={d}>{d}</option>
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


<div className="climate-bottom">

  <div className="chart-card">
    <h3>Temperature Trend</h3>
    <Line data={chartData} options={chartOptions} />
  </div>

  <div className="forecast-container">
    <h3>7-Day Forecast</h3>

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
          />

          <span className="temp">
            {Math.round(day.main?.temp ?? 0)}°C
          </span>
        </div>
      ))}
    </div>

  </div>

</div>

    </div>
  );
}