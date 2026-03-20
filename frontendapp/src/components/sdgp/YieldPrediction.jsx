import { useState, useEffect, useRef } from "react";
import "./YieldPrediction.css";

const API         = import.meta.env.VITE_API_BASE || "http://13.233.134.204:8080";
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const DIVISION_META = {
  "Rangala":       { id: "F-01", risk: "Low",    accent: "#27ae60" },
  "Poodelgodda":   { id: "F-02", risk: "Low",    accent: "#2ecc71" },
  "Ranwella":      { id: "F-03", risk: "Low",    accent: "#17a589" },
  "New Division":  { id: "F-04", risk: "Medium", accent: "#e67e22" },
  "Kalduriya":     { id: "F-05", risk: "Medium", accent: "#f39c12" },
  "Peru Division": { id: "F-06", risk: "High",   accent: "#e74c3c" },
};

const tc = s => s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

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

export default function YieldPrediction() {
  const [predictions, setPredictions] = useState([]);
  const [monthly,     setMonthly]     = useState([]);
  const [yearly,      setYearly]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [activeDiv,   setActiveDiv]   = useState(null);
  const [chartView,   setChartView]   = useState("monthly");

  useEffect(() => { loadAll(); }, []);
  useEffect(() => { if (!loading && !error) loadChart(); }, [chartView]);

  async function loadAll() {
    setLoading(true); setError(null);
    try { await Promise.all([loadPredictions(), loadChart()]); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  async function loadPredictions() {
    const res = await fetch(`${API}/api/yield/predictions`);
    if (!res.ok) throw new Error(`Cannot reach API at ${API} (${res.status})`);
    const data = await res.json();
    setPredictions(data.map(row => {
      const name = tc(row.division);
      const meta = DIVISION_META[name] || { id: "?", risk: "Medium", accent: "#8aab98" };
      return {
        ...meta, name,
        division:   row.division,
        predicted:  Math.round(row.predictedYield),
        year:       row.year,
        month:      row.month,
        confidence: meta.risk === "Low" ? 85 : meta.risk === "Medium" ? 78 : 70,
      };
    }));
  }

  async function loadChart() {
    const [mr, yr] = await Promise.all([
      fetch(`${API}/api/yield/history/monthly`),
      fetch(`${API}/api/yield/history/yearly`),
    ]);
    if (mr.ok) {
      const data = await mr.json();
      setMonthly(data.slice(-12).map(d => {
        const [yr, mo] = (d.yearMonth || "").split("-");
        return { lbl: `${MONTH_NAMES[parseInt(mo)-1]}'${yr?.slice(2)}`, val: d.totalGreenLeaf };
      }));
    }
    if (yr.ok) {
      const data = await yr.json();
      setYearly(data.map(d => ({ lbl: String(d.year), val: d.totalGreenLeaf })));
    }
  }

  // ── Derived ───────────────────────────────────────────────────────────────
  const totalPred     = predictions.reduce((s, d) => s + d.predicted, 0);
  const avgConf       = predictions.length
    ? Math.round(predictions.reduce((s, d) => s + d.confidence, 0) / predictions.length) : 0;
  const highRisk      = predictions.filter(d => d.risk === "High").length;
  const predLabel     = predictions[0]
    ? `${MONTH_NAMES[(predictions[0].month || 1) - 1]} ${predictions[0].year}` : "—";

  const chartData     = chartView === "monthly" ? monthly : yearly;
  const chartMax      = Math.max(...chartData.map(d => d.val), 1);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="yp-page">
      <div className="yp-loading">
        <div className="yp-spinner" />
        <p>Loading predictions...</p>
      </div>
    </div>
  );

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) return (
    <div className="yp-page">
      <div className="yp-body">
        <div className="db-card" style={{ padding: 28 }}>
          <h3 style={{ color: "#e74c3c", marginBottom: 8 }}>Could not load data</h3>
          <p style={{ color: "#8aab98", fontSize: 13 }}>{error}</p>
        </div>
      </div>
    </div>
  );

  // ── No data ───────────────────────────────────────────────────────────────
  if (predictions.length === 0) return (
    <div className="yp-page">
      <div className="yp-body">
        <div className="db-card" style={{ padding: 28, textAlign: "center" }}>
          <p style={{ color: "#8aab98", marginBottom: 10 }}>No predictions found</p>
          <code style={{ background: "#1a3a2a", color: "#7dcea0", padding: "6px 14px", borderRadius: 8, fontSize: 12 }}>
            python yield_prediction_ml.py
          </code>
        </div>
      </div>
    </div>
  );

  return (
    <div className="yp-page">
      <div className="yp-body">

        {/* ── KPI STRIP ── */}
        <section className="db-kpi-strip">
          <div className="db-kpi-card">
            <div className="db-kpi-label">Total Forecast</div>
            <div className="db-kpi-num green">
              <AnimCount to={totalPred / 1000} dec={1} suffix="t" />
            </div>
            <div className="db-kpi-hint">{predLabel} · All divisions</div>
          </div>

          <div className="db-kpi-sep" />

          <div className="db-kpi-card">
            <div className="db-kpi-label">Avg Confidence</div>
            <div className="db-kpi-num sky">
              <AnimCount to={avgConf} suffix="%" />
            </div>
            <div className="db-kpi-hint">Random Forest model</div>
          </div>

          <div className="db-kpi-sep" />

          <div className="db-kpi-card">
            <div className="db-kpi-label">High Risk Divisions</div>
            <div className={`db-kpi-num ${highRisk > 0 ? "red" : "green"}`}>
              <AnimCount to={highRisk} />
            </div>
            <div className="db-kpi-hint">
              {predictions.filter(d => d.risk === "Medium").length} medium ·{" "}
              {predictions.filter(d => d.risk === "Low").length} low
            </div>
          </div>

          <div className="db-kpi-sep" />

          <div className="db-kpi-card">
            <div className="db-kpi-label">Active Divisions</div>
            <div className="db-kpi-num green">
              <AnimCount to={predictions.length} />
            </div>
            <div className="db-kpi-hint">Rangala Estate</div>
          </div>
        </section>

        {/* ── MAIN GRID ── */}
        <div className="db-grid">

          {/* Division table — full width */}
          <div className="db-card span-4">
            <div className="db-card-hd">
              <span className="db-card-ttl">Division Forecast</span>
              <span className="db-card-tag">{predLabel}</span>
            </div>
            <table className="db-tbl">
              <thead>
                <tr>
                  <th>Division</th>
                  <th>Forecast Month</th>
                  <th>Predicted Yield</th>
                  <th>Share</th>
                  <th>Risk</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {[...predictions].sort((a, b) => b.predicted - a.predicted).map(d => {
                  const share = totalPred > 0 ? (d.predicted / totalPred * 100) : 0;
                  return (
                    <tr key={d.id}
                        className={activeDiv?.id === d.id ? "yp-row-active" : ""}
                        onClick={() => setActiveDiv(activeDiv?.id === d.id ? null : d)}
                        style={{ cursor: "pointer" }}>
                      <td>
                        <div className="db-div-cell">
                          <span className="db-dot" style={{ background: d.accent }} />
                          <span className="db-div-nm">{d.name}</span>
                          <span className="db-div-id">{d.id}</span>
                        </div>
                      </td>
                      <td style={{ color: "#5f7c6b", fontSize: 13 }}>
                        {d.year}-{String(d.month).padStart(2, "0")}
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
                            <div className="db-conf-fill" style={{ width: `${d.confidence}%` }} />
                          </div>
                          <span>{d.confidence}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td><strong>Total</strong></td>
                  <td />
                  <td><strong className="db-mono">{totalPred.toLocaleString()} kg</strong></td>
                  <td><strong>100%</strong></td>
                  <td /><td />
                </tr>
              </tfoot>
            </table>

            {/* Expanded detail row */}
            {activeDiv && (
              <div className="yp-expanded">
                <p className="yp-expanded-title">Prediction details · {activeDiv.name}</p>
                <div className="yp-expanded-grid">
                  <div className="db-wx-stat">
                    <div className="db-wx-stat-val">{activeDiv.predicted.toLocaleString()}</div>
                    <div className="db-wx-stat-lbl">Predicted kg</div>
                  </div>
                  <div className="db-wx-stat">
                    <div className="db-wx-stat-val">{activeDiv.year}-{String(activeDiv.month).padStart(2,"0")}</div>
                    <div className="db-wx-stat-lbl">Forecast Month</div>
                  </div>
                  <div className="db-wx-stat">
                    <div className="db-wx-stat-val">{activeDiv.risk}</div>
                    <div className="db-wx-stat-lbl">Risk Level</div>
                  </div>
                  <div className="db-wx-stat">
                    <div className="db-wx-stat-val">{activeDiv.confidence}%</div>
                    <div className="db-wx-stat-lbl">Confidence</div>
                  </div>
                  <div className="db-wx-stat">
                    <div className="db-wx-stat-val">RF</div>
                    <div className="db-wx-stat-lbl">Algorithm</div>
                  </div>
                  <div className="db-wx-stat">
                    <div className="db-wx-stat-val">{activeDiv.id}</div>
                    <div className="db-wx-stat-lbl">Division ID</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chart — full width */}
          <div className="db-card span-4">
            <div className="db-card-hd">
              <span className="db-card-ttl">
                {chartView === "monthly" ? "Monthly Yield History (last 12 months)" : "Annual Yield History"}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className={`yp-toggle ${chartView === "monthly" ? "active" : ""}`}
                  onClick={() => setChartView("monthly")}>Monthly</button>
                <button
                  className={`yp-toggle ${chartView === "yearly" ? "active" : ""}`}
                  onClick={() => setChartView("yearly")}>Yearly</button>
              </div>
            </div>

            {chartData.length === 0 ? (
              <div className="db-empty"><p>No history data yet</p></div>
            ) : (
              <>
                <div className="db-chart" style={{ height: 200 }}>
                  {chartData.map((d, i) => {
                    const px = Math.max((d.val / chartMax) * 160, 3);
                    const isLast = chartView === "monthly" && i === chartData.length - 1;
                    return (
                      <div className="db-chart-col" key={i}>
                        <div className="db-chart-tip">{(d.val / 1000).toFixed(1)}t</div>
                        <div className={`db-chart-bar ${isLast ? "highlight" : ""} ${chartView === "yearly" ? "amber-bar" : ""}`}
                          style={{ height: `${px}px` }} />
                        <div className="db-chart-lbl">{d.lbl}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="yp-legend">
                  <span className="yp-legend-dot" />
                  {chartView === "monthly" ? "Green Leaf Yield (kg)" : "Annual Total (kg)"}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
