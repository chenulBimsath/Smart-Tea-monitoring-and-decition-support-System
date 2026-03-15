import { useEffect, useState, useRef } from "react";
import "./ClimateRisk.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const DISTRICTS = {
  Rangala:       { lat: 7.327,  lon: 80.820 },
  Galle:         { lat: 6.0535, lon: 80.221 },
  "Nuwara Eliya":{ lat: 6.9497, lon: 80.7891 },
  Badulla:       { lat: 6.9934, lon: 81.0550 },
};

function AnimCount({ to, dec = 0, suffix = "" }) {
  const [val, setVal] = useState(0);
  const raf = useRef();
  useEffect(() => {
    const end = parseFloat(to) || 0, t0 = Date.now(), dur = 800;
    const tick = () => {
      const p = Math.min((Date.now() - t0) / dur, 1);
      setVal(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [to]);
  return <>{val.toFixed(dec)}{suffix}</>;
}

export default function ClimateRisk() {
  const [district, setDistrict] = useState("Rangala");
  const [weather,  setWeather]  = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const API_KEY    = import.meta.env.VITE_WEATHER_API_KEY;
  const { lat, lon } = DISTRICTS[district];

  useEffect(() => {
    setLoading(true);
    setWeather(null);

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
      .then(r => r.json())
      .then(data => setWeather(data));

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
      .then(r => r.json())
      .then(data => {
        setForecast(data.list?.filter((_, i) => i % 8 === 0).slice(0, 7) || []);
        setLoading(false);
      });
  }, [district, lat, lon, API_KEY]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const temp     = weather ? Math.round(weather.main?.temp)      : null;
  const humidity = weather ? weather.main?.humidity               : null;
  const wind     = weather ? (weather.wind?.speed ?? 0)          : null;
  const rain     = weather ? (weather.rain?.["1h"] ?? 0)         : null;
  const wxIcon   = weather ? weather.weather?.[0]?.icon          : null;
  const wxDesc   = weather ? weather.weather?.[0]?.description   : null;
  const feelsLike= weather ? Math.round(weather.main?.feels_like): null;

  const chartData = {
    labels: forecast.map(d =>
      new Date(d.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })
    ),
    datasets: [{
      label: "Temperature °C",
      data: forecast.map(d => d.main?.temp),
      borderColor: "#27ae60",
      backgroundColor: "rgba(39,174,96,0.08)",
      tension: 0.4,
      fill: true,
      pointBackgroundColor: "#27ae60",
      pointRadius: 4,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        ticks: { callback: v => v + "°C", font: { size: 11 } },
        grid:  { color: "#e8f5ed" },
      },
      x: {
        ticks: { font: { size: 11 } },
        grid:  { display: false },
      },
    },
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="cr-page">
      <div className="cr-loading">
        <div className="cr-spinner" />
        <p>Loading climate data...</p>
      </div>
    </div>
  );

  if (!weather?.main) return (
    <div className="cr-page">
      <div className="cr-loading">
        <p>Weather data unavailable — check API key</p>
      </div>
    </div>
  );

  return (
    <div className="cr-page">
      <div className="cr-body">

        {/* ── DISTRICT SELECTOR ── */}
        <div className="cr-selector-row">
          <div>
            <div className="cr-title">{district} Tea Plantation</div>
            <div className="cr-sub">Live Climate Conditions · OpenWeatherMap</div>
          </div>
          <select
            className="cr-select"
            value={district}
            onChange={e => setDistrict(e.target.value)}
          >
            {Object.keys(DISTRICTS).map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        {/* ── KPI STRIP ── */}
        <section className="db-kpi-strip">
          <div className="db-kpi-card">
            <div className="db-kpi-label">Temperature</div>
            <div className="db-kpi-num amber">
              <AnimCount to={temp} suffix="°C" />
            </div>
            <div className="db-kpi-hint">
              Feels like {feelsLike}°C
              {wxDesc && ` · ${wxDesc.charAt(0).toUpperCase() + wxDesc.slice(1)}`}
            </div>
          </div>

          <div className="db-kpi-sep" />

          <div className="db-kpi-card">
            <div className="db-kpi-label">Humidity</div>
            <div className="db-kpi-num sky">
              <AnimCount to={humidity} suffix="%" />
            </div>
            <div className="db-kpi-hint">
              <span className={humidity > 80 ? "cr-warn" : "cr-ok"}>
                {humidity > 80 ? "High Risk" : "Normal"}
              </span>
            </div>
          </div>

          <div className="db-kpi-sep" />

          <div className="db-kpi-card">
            <div className="db-kpi-label">Wind Speed</div>
            <div className="db-kpi-num green">
              <AnimCount to={wind} dec={1} suffix=" km/h" />
            </div>
            <div className="db-kpi-hint">
              <span className={wind > 10 ? "cr-warn" : "cr-ok"}>
                {wind > 10 ? "High Risk" : "Normal"}
              </span>
            </div>
          </div>

          <div className="db-kpi-sep" />

          <div className="db-kpi-card">
            <div className="db-kpi-label">Rainfall (1h)</div>
            <div className="db-kpi-num blue">
              <AnimCount to={rain} dec={1} suffix=" mm" />
            </div>
            <div className="db-kpi-hint">Current hour · {district}</div>
          </div>
        </section>

        {/* ── MAIN GRID ── */}
        <div className="cr-grid">

          {/* Current weather card */}
          <div className="db-card">
            <div className="db-card-hd">
              <span className="db-card-ttl">Current Conditions</span>
              <span className="db-card-tag live">● Live</span>
            </div>
            <div className="cr-current-body">
              {wxIcon && (
                <img
                  src={`https://openweathermap.org/img/wn/${wxIcon}@2x.png`}
                  alt={wxDesc}
                  className="cr-wx-icon"
                />
              )}
              <div className="cr-current-temp">{temp}°C</div>
              <div className="cr-current-desc">
                {wxDesc ? wxDesc.charAt(0).toUpperCase() + wxDesc.slice(1) : ""}
              </div>
              <div className="cr-current-sub">Feels like {feelsLike}°C</div>
              <div className="cr-current-stats">
                <div className="cr-stat">
                  <div className="cr-stat-val">{weather.main?.pressure} hPa</div>
                  <div className="cr-stat-lbl">Pressure</div>
                </div>
                <div className="cr-stat">
                  <div className="cr-stat-val">{weather.visibility ? (weather.visibility/1000).toFixed(1) : "—"} km</div>
                  <div className="cr-stat-lbl">Visibility</div>
                </div>
                <div className="cr-stat">
                  <div className="cr-stat-val">{weather.clouds?.all ?? 0}%</div>
                  <div className="cr-stat-lbl">Cloud Cover</div>
                </div>
              </div>
            </div>
          </div>

          {/* 7-day forecast card */}
          <div className="db-card cr-forecast-card">
            <div className="db-card-hd">
              <span className="db-card-ttl">7-Day Forecast</span>
              <span className="db-card-tag">{district}</span>
            </div>
            <div className="cr-forecast-list">
              {forecast.map((day, i) => (
                <div className="cr-forecast-row" key={i}>
                  <div className="cr-forecast-day">
                    {new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather?.[0]?.icon}.png`}
                    alt={day.weather?.[0]?.description}
                    className="cr-forecast-icon"
                  />
                  <div className="cr-forecast-desc">
                    {day.weather?.[0]?.main || ""}
                  </div>
                  <div className="cr-forecast-temp">
                    {Math.round(day.main?.temp ?? 0)}°C
                  </div>
                  <div className="cr-forecast-bar-wrap">
                    <div className="cr-forecast-bar"
                      style={{ width: `${Math.min((day.main?.temp / 35) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Temperature trend chart */}
          <div className="db-card cr-chart-card">
            <div className="db-card-hd">
              <span className="db-card-ttl">Temperature Trend</span>
              <span className="db-card-tag">7-day forecast · °C</span>
            </div>
            <div className="cr-chart-wrap">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Risk assessment card */}
          <div className="db-card">
            <div className="db-card-hd">
              <span className="db-card-ttl">Risk Assessment</span>
              <span className="db-card-tag">{district}</span>
            </div>
            <div className="cr-risk-list">
              {[
                {
                  label:  "Humidity Risk",
                  val:    `${humidity}%`,
                  risk:   humidity > 80 ? "High" : humidity > 60 ? "Medium" : "Low",
                  detail: humidity > 80 ? "Disease risk elevated" : "Normal range",
                },
                {
                  label:  "Wind Risk",
                  val:    `${wind} km/h`,
                  risk:   wind > 15 ? "High" : wind > 10 ? "Medium" : "Low",
                  detail: wind > 15 ? "Damage to plants possible" : "Safe conditions",
                },
                {
                  label:  "Rainfall Risk",
                  val:    `${rain} mm`,
                  risk:   rain > 10 ? "High" : rain > 5 ? "Medium" : "Low",
                  detail: rain > 10 ? "Flooding risk" : "Normal levels",
                },
                {
                  label:  "Temperature Risk",
                  val:    `${temp}°C`,
                  risk:   temp > 28 ? "High" : temp > 24 ? "Medium" : "Low",
                  detail: temp > 28 ? "Heat stress on crops" : "Optimal range",
                },
              ].map(item => (
                <div className="cr-risk-row" key={item.label}>
                  <div className="cr-risk-left">
                    <div className="cr-risk-label">{item.label}</div>
                    <div className="cr-risk-detail">{item.detail}</div>
                  </div>
                  <div className="cr-risk-right">
                    <div className="cr-risk-val">{item.val}</div>
                    <span className={`db-risk risk-${item.risk.toLowerCase()}`}>{item.risk}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
