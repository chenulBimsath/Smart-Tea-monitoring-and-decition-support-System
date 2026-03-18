import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./Dashboard.css";

const API         = import.meta.env.VITE_API_BASE || "http://localhost:8080";
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const WEATHER_LAT = 7.327;
const WEATHER_LON = 80.820;

const DIVISION_META = {
  "Rangala":       { id: "F-01", risk: "Low",    accent: "#27ae60" },
  "Poodelgodda":   { id: "F-02", risk: "Low",    accent: "#2ecc71" },
  "Ranwella":      { id: "F-03", risk: "Low",    accent: "#17a589" },
  "New Division":  { id: "F-04", risk: "Medium", accent: "#e67e22" },
  "Kalduriya":     { id: "F-05", risk: "Medium", accent: "#f39c12" },
  "Peru Division": { id: "F-06", risk: "High",   accent: "#e74c3c" },
};

const tc = s => s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

// ── Inline animated counter ───────────────────────────────────────────────────

function AnimCount({ to, dec = 0, suffix = "" }) {
  const [val, setVal] = useState(0);
  const raf = useRef();
  useEffect(() => {
    const end = parseFloat(to) || 0, t0 = Date.now(), dur = 900;
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

export default function Dashboard() {
  const { t } = useTranslation();
  
  const [preds,          setPreds]          = useState([]);
  const [monthly,        setMonthly]        = useState([]);
  const [yearly,         setYearly]         = useState([]);
  const [weather,        setWeather]        = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [dataLoading,    setDataLoading]    = useState(true);

  useEffect(() => {
    loadData();
    loadWeather();
  }, []);

  function refresh() {
    loadData();
    loadWeather();
  }

  // ── Spring Boot data ──────────────────────────────────────────────────────
  async function loadData() {
    setDataLoading(true);
    await Promise.allSettled([fetchPreds(), fetchHistory()]);
    setDataLoading(false);
  }

  async function fetchPreds() {
    try {
      const r = await fetch(`${API}/api/yield/predictions`);
      if (!r.ok) return;
      const d = await r.json();
      setPreds(d.map(row => {
        const name = tc(row.division);
        const m    = DIVISION_META[name] || { id: "?", risk: "Medium", accent: "#8aab98" };
        return { ...m, name, predicted: Math.round(row.predictedYield), year: row.year, month: row.month };
      }));
    } catch {}
  }

  async function fetchHistory() {
    try {
      const [mr, yr] = await Promise.all([
        fetch(`${API}/api/yield/history/monthly`),
        fetch(`${API}/api/yield/history/yearly`),
      ]);
      if (mr.ok) setMonthly(await mr.json());
      if (yr.ok) setYearly(await yr.json());
    } catch {}
  }

  // ── Open-Meteo Archive — no API key needed ────────────────────────────────
  function loadWeather() {
    setWeatherLoading(true);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0];

    const url =
      `https://archive-api.open-meteo.com/v1/archive` +
      `?latitude=${WEATHER_LAT}&longitude=${WEATHER_LON}` +
      `&start_date=${dateStr}&end_date=${dateStr}` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max` +
      `&hourly=relative_humidity_2m` +
      `&timezone=Asia%2FColombo`;

    fetch(url)
      .then(r => r.json())
      .then(data => {
        const daily  = data.daily;
        const hourly = data.hourly;
        if (!daily) return;

        const avgHumidity = hourly?.relative_humidity_2m?.length
          ? Math.round(hourly.relative_humidity_2m.reduce((a, b) => a + b, 0) / hourly.relative_humidity_2m.length)
          : null;

        const tempMax = daily.temperature_2m_max?.[0] ?? null;
        const tempMin = daily.temperature_2m_min?.[0] ?? null;

        setWeather({
          temp:     tempMax !== null && tempMin !== null ? Math.round((tempMax + tempMin) / 2) : null,
          tempMax:  tempMax !== null ? Math.round(tempMax) : null,
          tempMin:  tempMin !== null ? Math.round(tempMin) : null,
          humidity: avgHumidity,
          rainfall: daily.precipitation_sum?.[0] ?? 0,
          wind:     daily.wind_speed_10m_max?.[0] ?? 0,
          date:     dateStr,
        });
      })
      .catch(() => setWeather(null))
      .finally(() => setWeatherLoading(false));
  }

  // ── Derived ───────────────────────────────────────────────────────────────
  const totalPred    = preds.reduce((s, d) => s + d.predicted, 0);
  const lastMonthRow = monthly.length >= 2 ? monthly[monthly.length - 2] : null;
  const lastMonthVal = lastMonthRow?.totalGreenLeaf || 0;
  const yoyPct       = lastMonthVal > 0
    ? ((totalPred - lastMonthVal) / lastMonthVal * 100).toFixed(1) : null;
  const highRisk  = preds.filter(d => d.risk === "High").length;
  const chartMax  = Math.max(...monthly.slice(-12).map(d => d.totalGreenLeaf || 0), 1);
  const yearlyMax = Math.max(...yearly.map(d => d.totalGreenLeaf || 0), 1);
  const predLabel = preds[0]
    ? `${MONTH_NAMES[(preds[0].month || 1) - 1]} ${preds[0].year}` : "—";

  const temp     = weather?.temp     ?? null;
  const humidity = weather?.humidity ?? null;
  const wind     = weather?.wind     ?? null;
  const rain     = weather?.rainfall ?? null;
  const wxDate   = weather?.date     ?? null;

  if (dataLoading) return <div className="db-loading">{t("loading")}</div>;

  return (
    <div className="db-page">
      <div className="db-body">

        {/* ── KPI STRIP ── */}
        <section className="db-kpi-strip">
          <div className="db-kpi-card">
            <div className="db-kpi-label">{t("currentMonthForecast")}</div>
            <div className="db-kpi-num green">
              <AnimCount to={totalPred / 1000} dec={1} suffix="t" />
            </div>
            <div className="db-kpi-hint">{predLabel} · 6 divisions</div>
          </div>

          <div className="db-kpi-sep" />

          <div className="db-kpi-card">
            <div className="db-kpi-label">{t("lastMonthActual")}</div>
            <div className="db-kpi-num amber">
              {lastMonthVal > 0
                ? <AnimCount to={lastMonthVal / 1000} dec={1} suffix="t" />
                : <span className="db-na">{t("noData")}</span>}
            </div>
            <div className="db-kpi-hint">
              {yoyPct !== null
                ? <span className={parseFloat(yoyPct) >= 0 ? "pos-txt" : "neg-txt"}>
                    {parseFloat(yoyPct) >= 0 ? "+" : ""}{yoyPct}% vs this month
                  </span>
                : t("noData")}
            </div>
          </div>

          <div className="db-kpi-sep" />

          <div className="db-kpi-card">
            <div className="db-kpi-label">{t("temperature")}</div>
            <div className="db-kpi-num red">
              {temp !== null ? `${temp}°C` : <span className="db-na">—</span>}
            </div>
            <div className="db-kpi-hint">
              {weather
                ? `High ${weather.tempMax}° / Low ${weather.tempMin}°`
                : "Rangala Estate"}
            </div>
          </div>

          <div className="db-kpi-sep" />

          <div className="db-kpi-card">
            <div className="db-kpi-label">{t("humidity")}</div>
            <div className="db-kpi-num sky">
              {humidity !== null ? `${humidity}%` : <span className="db-na">—</span>}
            </div>
            <div className="db-kpi-hint">
              {humidity !== null
                ? humidity > 80 ? "High — monitor disease risk" : "Normal levels"
                : t("loading")}
            </div>
          </div>

          <div className="db-kpi-sep" />

          <div className="db-kpi-card">
            <div className="db-kpi-label">{t("highRiskDivisions")}</div>
            <div className={`db-kpi-num ${highRisk > 0 ? "red" : "green"}`}>
              <AnimCount to={highRisk} />
            </div>
            <div className="db-kpi-hint">
              {preds.filter(d => d.risk === "Medium").length} medium ·{" "}
              {preds.filter(d => d.risk === "Low").length} low risk
            </div>
          </div>
        </section>

        {/* ── MAIN GRID ── */}
        <div className="db-grid">

          {/* Division forecast table */}
          <div className="db-card span-2 row-2">
            <div className="db-card-hd">
              <span className="db-card-ttl">{t("divisionForecast")}</span>
              <span className="db-card-tag">{predLabel}</span>
            </div>
            {preds.length === 0 ? (
              <div className="db-empty">
                <p>{t("noData")}</p>
                <code>python yield_prediction_ml.py</code>
              </div>
            ) : (
              <table className="db-tbl">
                <thead>
                  <tr>
                    <th>{t("division")}</th>
                    <th>{t("predictedYield")}</th>
                    <th>{t("share")}</th>
                    <th>{t("risk")}</th>
                    <th>{t("confidence")}</th>
                  </tr>
                </thead>
                <tbody>
                  {[...preds].sort((a, b) => b.predicted - a.predicted).map(d => {
                    const share = totalPred > 0 ? (d.predicted / totalPred * 100) : 0;
                    const conf  = d.risk === "Low" ? 85 : d.risk === "Medium" ? 78 : 70;
                    return (
                      <tr key={d.id}>
                        <td>
                          <div className="db-div-cell">
                            <span className="db-dot" style={{ background: d.accent }} />
                            <span className="db-div-nm">{d.name}</span>
                            <span className="db-div-id">{d.id}</span>
                          </div>
                        </td>
                        <td>
                          <span className="db-mono">{d.predicted.toLocaleString()}</span>
                          <span className="db-unit"> kg</span>
                        </td>
                        <td>
                          <div className="db-share">
                            <div className="db-share-track">
                              <div className="db-share-fill"
                                style={{ width: `${share}%`, background: d.accent }} />
                            </div>
                            <span className="db-share-num">{share.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td>
                          <span className={`db-risk risk-${d.risk.toLowerCase()}`}>{d.risk}</span>
                        </td>
                        <td>
                          <div className="db-conf">
                            <div className="db-conf-track">
                              <div className="db-conf-fill" style={{ width: `${conf}%` }} />
                            </div>
                            <span>{conf}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td><strong>Total</strong></td>
                    <td><strong className="db-mono">{totalPred.toLocaleString()} kg</strong></td>
                    <td><strong>100%</strong></td>
                    <td /><td />
                  </tr>
                </tfoot>
              </table>
            )}
          </div>

          {/* Weather card */}
          <div className="db-card span-2">
            <div className="db-card-hd">
              <span className="db-card-ttl">{t("weatherRangala")}</span>
              <span className={`db-card-tag ${weather ? "live" : ""}`}>
                {weatherLoading ? t("loading") : weather ? `● ${wxDate}` : "● Unavailable"}
              </span>
            </div>
            {weatherLoading ? (
              <div className="db-wx-loading">Fetching weather data...</div>
            ) : weather ? (
              <div className="db-wx-body">
                <div className="db-wx-main">
                  <div>
                    <div className="db-wx-temp">{temp}°C</div>
                    <div className="db-wx-desc">{weather.tempMax}° / {weather.tempMin}° · {t("yesterday")}</div>
                    <div className="db-wx-feels">{wxDate} · Rangala Estate</div>
                  </div>
                </div>
                <div className="db-wx-stats">
                  <div className="db-wx-stat">
                    <div className="db-wx-stat-val">{humidity}%</div>
                    <div className="db-wx-stat-lbl">{t("humidity")}</div>
                    <div className={`db-wx-stat-badge ${humidity > 80 ? "warn" : "ok"}`}>
                      {humidity > 80 ? t("highRisk") : t("normal")}
                    </div>
                  </div>
                  <div className="db-wx-stat">
                    <div className="db-wx-stat-val">{wind} km/h</div>
                    <div className="db-wx-stat-lbl">{t("windSpeed")}</div>
                    <div className={`db-wx-stat-badge ${wind > 10 ? "warn" : "ok"}`}>
                      {wind > 10 ? t("highRisk") : t("normal")}
                    </div>
                  </div>
                  <div className="db-wx-stat">
                    <div className="db-wx-stat-val">{rain} mm</div>
                    <div className="db-wx-stat-lbl">{t("precipitation")}</div>
                    <div className="db-wx-stat-badge ok">{t("yesterday")}</div>
                  </div>
                  <div className="db-wx-stat">
                    <div className="db-wx-stat-val">{weather.tempMax}°C</div>
                    <div className="db-wx-stat-lbl">{t("maxTemp")}</div>
                    <div className="db-wx-stat-badge ok">{t("yesterday")}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="db-wx-loading">Weather unavailable — check network connection</div>
            )}
          </div>

          {/* Last month actual */}
          <div className="db-card">
            <div className="db-card-hd">
              <span className="db-card-ttl">{t("lastMonthActual")}</span>
              <span className="db-card-tag">Historical</span>
            </div>
            <div className="db-single-stat">
              <div className="db-single-num amber">
                {lastMonthVal > 0
                  ? `${(lastMonthVal / 1000).toFixed(1)}t`
                  : <span className="db-na">{t("noData")}</span>}
              </div>
              {lastMonthVal > 0 && (
                <div className="db-single-kg">{lastMonthVal.toLocaleString()} kg</div>
              )}
              <div className="db-single-sub">All divisions · Actual green leaf</div>
              {yoyPct !== null && (
                <div className={`db-change-badge ${parseFloat(yoyPct) >= 0 ? "up" : "dn"}`}>
                  {parseFloat(yoyPct) >= 0 ? "▲" : "▼"} {Math.abs(yoyPct)}% vs prediction
                </div>
              )}
            </div>
          </div>

          {/* Current month prediction */}
          <div className="db-card">
            <div className="db-card-hd">
              <span className="db-card-ttl">{t("thisMonthPrediction")}</span>
              <span className="db-card-tag">{predLabel}</span>
            </div>
            <div className="db-single-stat">
              <div className="db-single-num green">
                {totalPred > 0
                  ? `${(totalPred / 1000).toFixed(1)}t`
                  : <span className="db-na">{t("noData")}</span>}
              </div>
              {totalPred > 0 && (
                <div className="db-single-kg">{totalPred.toLocaleString()} kg</div>
              )}
              <div className="db-single-sub">ML model · Random Forest</div>
              {yoyPct !== null && (
                <div className={`db-change-badge ${parseFloat(yoyPct) >= 0 ? "up" : "dn"}`}>
                  {parseFloat(yoyPct) >= 0 ? "▲" : "▼"} {Math.abs(yoyPct)}% vs last month
                </div>
              )}
            </div>
          </div>

          {/* Monthly chart */}
          <div className="db-card span-2">
            <div className="db-card-hd">
              <span className="db-card-ttl">{t("monthlyYieldHistory")}</span>
              <span className="db-card-tag">Last 12 months</span>
            </div>
            {monthly.length === 0 ? (
              <div className="db-empty"><p>{t("noData")}</p></div>
            ) : (
              <div className="db-chart">
                {monthly.slice(-12).map((d, i) => {
                  const [yr, mo] = (d.yearMonth || "").split("-");
                  const lbl    = mo ? `${MONTH_NAMES[parseInt(mo) - 1]}'${yr?.slice(2)}` : d.yearMonth;
                  const px     = Math.max((d.totalGreenLeaf / chartMax) * 140, 3);
                  const isLast = i === monthly.slice(-12).length - 1;
                  return (
                    <div className="db-chart-col" key={i}>
                      <div className="db-chart-tip">{(d.totalGreenLeaf / 1000).toFixed(1)}t</div>
                      <div className={`db-chart-bar ${isLast ? "highlight" : ""}`}
                        style={{ height: `${px}px` }} />
                      <div className="db-chart-lbl">{lbl}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Yearly chart */}
          <div className="db-card span-2">
            <div className="db-card-hd">
              <span className="db-card-ttl">{t("annualYield")}</span>
              <span className="db-card-tag">2021 – present</span>
            </div>
            {yearly.length === 0 ? (
              <div className="db-empty"><p>{t("noData")}</p></div>
            ) : (
              <div className="db-chart db-chart-yearly">
                {yearly.map((d, i) => {
                  const px = Math.max((d.totalGreenLeaf / yearlyMax) * 140, 3);
                  return (
                    <div className="db-chart-col" key={i}>
                      <div className="db-chart-tip">{(d.totalGreenLeaf / 1000).toFixed(0)}t</div>
                      <div className="db-chart-bar amber-bar" style={{ height: `${px}px` }} />
                      <div className="db-chart-lbl">{d.year}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}