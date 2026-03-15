import { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import logo from "../../../public/logo.png"; // ← place your logo image at src/assets/logo.png

const API = import.meta.env.VITE_API_BASE || "http://localhost:8080";
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const DIVISION_META = {
  "Rangala":       { id:"F-01", risk:"Low",    accent:"#27ae60" },
  "Poodelgodda":   { id:"F-02", risk:"Low",    accent:"#2ecc71" },
  "Ranwella":      { id:"F-03", risk:"Low",    accent:"#17a589" },
  "New Division":  { id:"F-04", risk:"Medium", accent:"#e67e22" },
  "Kalduriya":     { id:"F-05", risk:"Medium", accent:"#f39c12" },
  "Peru Division": { id:"F-06", risk:"High",   accent:"#e74c3c" },
};

const tc = s => s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

function useClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

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

export default function Dashboard() {
  const [preds,   setPreds]   = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [yearly,  setYearly]  = useState([]);
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const now = useClock();

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    await Promise.allSettled([fetchPreds(), fetchHistory(), fetchWeather()]);
    setLoading(false);
  }

  async function fetchPreds() {
    try {
      const r = await fetch(`${API}/api/yield/predictions`);
      if (!r.ok) throw new Error();
      const d = await r.json();
      setPreds(d.map(row => {
        const name = tc(row.division);
        const m = DIVISION_META[name] || { id: "?", risk: "Medium", accent: "#8aab98" };
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

  async function fetchWeather() {
    try {
      const r = await fetch(`${API}/api/weather/latest`);
      if (r.ok) setWeather(await r.json());
    } catch {}
  }

  // ── Derived ────────────────────────────────────────────────────────────────
  const totalPred    = preds.reduce((s, d) => s + d.predicted, 0);
  const lastMonthRow = monthly.length >= 2 ? monthly[monthly.length - 2] : null;
  const lastMonthVal = lastMonthRow?.totalGreenLeaf || 0;
  const yoyPct       = lastMonthVal > 0
    ? ((totalPred - lastMonthVal) / lastMonthVal * 100).toFixed(1)
    : null;
  const highRisk  = preds.filter(d => d.risk === "High").length;
  const chartMax  = Math.max(...monthly.map(d => d.totalGreenLeaf || 0), 1);
  const yearlyMax = Math.max(...yearly.map(d => d.totalGreenLeaf || 0), 1);
  const latestW   = weather[0] || null;
  const predLabel = preds[0]
    ? `${MONTH_NAMES[(preds[0].month || 1) - 1]} ${preds[0].year}` : "—";

  // ── Boot / loading screen ─────────────────────────────────────────────────
  if (loading) return (
    <div className="db-page">
      <div className="db-boot">
        <img src={logo} alt="Logo" className="db-boot-logo" />
        <div className="db-boot-name">Smart Tea Monitor</div>
        <div className="db-boot-hint">Initialising systems...</div>
        <div className="db-boot-track"><div className="db-boot-fill" /></div>
      </div>
    </div>
  );

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="db-page">

      {/* ── TOPBAR ── */}
      <header className="db-top">
        <div className="db-brand">
          <img src={logo} alt="Logo" className="db-top-logo" />
          <div>
            <div className="db-estate-name">Smart Tea Monitor</div>
            <div className="db-estate-sub">Rangala Estate · Dashboard</div>
          </div>
        </div>

        <div className="db-top-right">
          <div className="db-clock-wrap">
            <div className="db-clock">
              {now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
            <div className="db-date-str">
              {now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </div>
          </div>
          <button className="db-refresh-btn" onClick={loadAll} title="Refresh">Refresh</button>
        </div>
      </header>

      <div className="db-body">

        {/* ── KPI STRIP ── */}
        <section className="db-kpi-strip">
          <div className="db-kpi-card">
            <div className="db-kpi-body">
              <div className="db-kpi-label">CURRENT MONTH FORECAST</div>
              <div className="db-kpi-num green">
                <AnimCount to={totalPred / 1000} dec={1} suffix="t" />
              </div>
              <div className="db-kpi-hint">{predLabel} · 6 divisions</div>
            </div>
          </div>

          <div className="db-kpi-sep" />

          <div className="db-kpi-card">
            <div className="db-kpi-body">
              <div className="db-kpi-label">LAST MONTH ACTUAL</div>
              <div className="db-kpi-num amber">
                {lastMonthVal > 0
                  ? <AnimCount to={lastMonthVal / 1000} dec={1} suffix="t" />
                  : <span className="db-na">No data</span>}
              </div>
              <div className="db-kpi-hint">
                {yoyPct !== null
                  ? <span className={parseFloat(yoyPct) >= 0 ? "pos-txt" : "neg-txt"}>
                      {parseFloat(yoyPct) >= 0 ? "+" : ""}{yoyPct}% vs this month
                    </span>
                  : "Awaiting data"}
              </div>
            </div>
          </div>

          <div className="db-kpi-sep" />

          <div className="db-kpi-card">
            <div className="db-kpi-body">
              <div className="db-kpi-label">LIVE NDVI</div>
              <div className="db-kpi-num sky">
                {latestW?.ndvi_value ?? <span className="db-na">—</span>}
              </div>
              <div className="db-kpi-hint">
                {latestW
                  ? `Temp ${latestW.temperature}°C · Rain ${latestW.rainfall}mm`
                  : "Awaiting live data"}
              </div>
            </div>
          </div>

          <div className="db-kpi-sep" />

          <div className="db-kpi-card">
            <div className="db-kpi-body">
              <div className="db-kpi-label">ACTIVE DIVISIONS</div>
              <div className="db-kpi-num green">
                <AnimCount to={preds.length} />
              </div>
              <div className="db-kpi-hint">Rangala Estate · RF Model</div>
            </div>
          </div>

          <div className="db-kpi-sep" />

          <div className="db-kpi-card">
            <div className="db-kpi-body">
              <div className="db-kpi-label">HIGH RISK DIVISIONS</div>
              <div className={`db-kpi-num ${highRisk > 0 ? "red" : "green"}`}>
                <AnimCount to={highRisk} />
              </div>
              <div className="db-kpi-hint">
                {preds.filter(d => d.risk === "Medium").length} medium ·{" "}
                {preds.filter(d => d.risk === "Low").length} low
              </div>
            </div>
          </div>
        </section>

        {/* ── MAIN GRID ── */}
        <div className="db-grid">

          {/* Division forecast table */}
          <div className="db-card span-2">
            <div className="db-card-hd">
              <span className="db-card-ttl">DIVISION FORECAST</span>
              <span className="db-card-tag">{predLabel}</span>
            </div>
            {preds.length === 0 ? (
              <div className="db-empty">
                <p>Run <code>python yield_prediction_ml.py</code> to generate predictions</p>
              </div>
            ) : (
              <table className="db-tbl">
                <thead>
                  <tr>
                    <th>Division</th>
                    <th>Predicted Yield</th>
                    <th>Share</th>
                    <th>Risk</th>
                    <th>Confidence</th>
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
                    <td><strong>TOTAL</strong></td>
                    <td><strong className="db-mono">{totalPred.toLocaleString()} kg</strong></td>
                    <td><strong>100%</strong></td>
                    <td /><td />
                  </tr>
                </tfoot>
              </table>
            )}
          </div>

          {/* Last month actual yield */}
          <div className="db-card">
            <div className="db-card-hd">
              <span className="db-card-ttl">LAST MONTH ACTUAL YIELD</span>
              <span className="db-card-tag">Historical</span>
            </div>
            <div className="db-single-stat">
              <div className="db-single-num amber">
                {lastMonthVal > 0
                  ? `${(lastMonthVal / 1000).toFixed(1)}t`
                  : <span className="db-na">No data yet</span>}
              </div>
              {lastMonthVal > 0 && (
                <div className="db-single-kg">{lastMonthVal.toLocaleString()} kg</div>
              )}
              <div className="db-single-sub">All divisions combined · Actual green leaf</div>
              {yoyPct !== null && (
                <div className={`db-change-badge ${parseFloat(yoyPct) >= 0 ? "up" : "dn"}`}>
                  {parseFloat(yoyPct) >= 0 ? "▲" : "▼"} {Math.abs(yoyPct)}% vs current prediction
                </div>
              )}
            </div>
          </div>

          {/* Current month prediction */}
          <div className="db-card">
            <div className="db-card-hd">
              <span className="db-card-ttl">CURRENT MONTH PREDICTION</span>
              <span className="db-card-tag">{predLabel}</span>
            </div>
            <div className="db-single-stat">
              <div className="db-single-num green">
                {totalPred > 0
                  ? `${(totalPred / 1000).toFixed(1)}t`
                  : <span className="db-na">No predictions</span>}
              </div>
              {totalPred > 0 && (
                <div className="db-single-kg">{totalPred.toLocaleString()} kg</div>
              )}
              <div className="db-single-sub">ML model · Random Forest · {predLabel}</div>
              {yoyPct !== null && (
                <div className={`db-change-badge ${parseFloat(yoyPct) >= 0 ? "up" : "dn"}`}>
                  {parseFloat(yoyPct) >= 0 ? "▲" : "▼"} {Math.abs(yoyPct)}% vs last month
                </div>
              )}
            </div>
          </div>

          {/* Live conditions */}
          <div className="db-card">
            <div className="db-card-hd">
              <span className="db-card-ttl">LIVE CONDITIONS</span>
              <span className={`db-card-tag ${latestW ? "live" : ""}`}>
                {latestW ? "● LIVE" : "● NO SIGNAL"}
              </span>
            </div>
            <div className="db-wx-grid">
              {[
                { lbl: "Temperature", val: latestW?.temperature, unit: "°C"  },
                { lbl: "Rainfall",    val: latestW?.rainfall,    unit: " mm" },
                { lbl: "Humidity",    val: latestW?.humidity,    unit: "%"   },
                { lbl: "NDVI",        val: latestW?.ndvi_value,  unit: ""    },
              ].map(w => (
                <div className="db-wx-tile" key={w.lbl}>
                  <div className="db-wx-val">
                    {w.val != null
                      ? <><b>{w.val}</b>{w.unit}</>
                      : <span className="db-na">—</span>}
                  </div>
                  <div className="db-wx-lbl">{w.lbl}</div>
                </div>
              ))}
            </div>
            {!latestW && (
              <p className="db-wx-note">
                Live data appears once your scripts write to <code>daily_weather_ndvi</code>
              </p>
            )}
          </div>

          {/* Monthly chart */}
          <div className="db-card span-2">
            <div className="db-card-hd">
              <span className="db-card-ttl">MONTHLY YIELD HISTORY</span>
              <span className="db-card-tag">Last 12 months · All divisions</span>
            </div>
            {monthly.length === 0 ? (
              <div className="db-empty"><p>No history data yet</p></div>
            ) : (
              <div className="db-chart">
                {monthly.map((d, i) => {
                  const [yr, mo] = (d.yearMonth || "").split("-");
                  const lbl = mo
                    ? `${MONTH_NAMES[parseInt(mo) - 1]}'${yr?.slice(2)}`
                    : d.yearMonth;
                  const pct    = Math.max((d.totalGreenLeaf / chartMax) * 100, 1);
                  const isLast = i === monthly.length - 1;
                  return (
                    <div className="db-chart-col" key={i}>
                      <div className="db-chart-tip">{(d.totalGreenLeaf / 1000).toFixed(1)}t</div>
                      <div className={`db-chart-bar ${isLast ? "highlight" : ""}`}
                           style={{ height: `${pct}%` }} />
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
              <span className="db-card-ttl">ANNUAL YIELD</span>
              <span className="db-card-tag">2021 – present</span>
            </div>
            {yearly.length === 0 ? (
              <div className="db-empty"><p>No yearly data yet</p></div>
            ) : (
              <div className="db-chart db-chart-yearly">
                {yearly.map((d, i) => {
                  const pct = Math.max((d.totalGreenLeaf / yearlyMax) * 100, 1);
                  return (
                    <div className="db-chart-col" key={i}>
                      <div className="db-chart-tip">{(d.totalGreenLeaf / 1000).toFixed(0)}t</div>
                      <div className="db-chart-bar amber-bar" style={{ height: `${pct}%` }} />
                      <div className="db-chart-lbl">{d.year}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

      <footer className="db-foot">
        <span>Smart Tea Monitor · Rangala Estate</span>
        <span>API: {API}</span>
        <span>Updated {now.toLocaleTimeString()}</span>
      </footer>
    </div>
  );
}
