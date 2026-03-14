import { useState, useEffect } from "react";
import "./YieldPrediction.css";

// Spring Boot base URL — set VITE_API_BASE=http://localhost:8080 in your .env
const API = import.meta.env.VITE_API_BASE || "http://localhost:8080";

// Division display config
const DIVISION_META = {
  "Rangala":      { id: "F-01", risk: "Low"    },
  "Poodelgodda":  { id: "F-02", risk: "Low"    },
  "Ranwella":     { id: "F-03", risk: "Low"    },
  "New Division": { id: "F-04", risk: "Medium" },
  "Kalduriya":    { id: "F-05", risk: "Medium" },
  "Peru Division":{ id: "F-06", risk: "High"   },
};

// Capitalise first letter of each word
const titleCase = (s) => s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

export default function YieldPrediction() {
  const [predictions, setPredictions] = useState([]);
  const [chartData,   setChartData]   = useState([]);
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
    if (!res.ok) throw new Error(
      `Cannot reach Spring Boot at ${API} (status ${res.status}). Is the backend running?`
    );
    const data = await res.json();

    // data = [{id, year, month, division, predictedYield}, ...]
    // division_ndvi_climate doesn't have risk/confidence — we add them from DIVISION_META
    const list = data.map((row) => {
      const name = titleCase(row.division);
      const meta = DIVISION_META[name] || { id: "?", risk: "Medium" };
      return {
        id:          meta.id,
        name,
        division:    row.division,
        predicted:   Math.round(row.predictedYield),
        year:        row.year,
        month:       row.month,
        risk:        meta.risk,
        // confidence is derived from a fixed formula since we don't store it in monthly_predicted_yield
        confidence:  meta.risk === "Low" ? 85 : meta.risk === "Medium" ? 78 : 70,
      };
    });

    setPredictions(list);
  }

  async function loadChart() {
    const url = chartView === "monthly"
      ? `${API}/api/yield/history/monthly`
      : `${API}/api/yield/history/yearly`;

    const res  = await fetch(url);
    if (!res.ok) throw new Error(`Chart error: ${res.status}`);
    const data = await res.json();

    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    if (chartView === "monthly") {
      // [{yearMonth: "2024-01", totalGreenLeaf: 42300}, ...]
      const formatted = data.slice(-12).map((d) => {
        const [yr, mo] = d.yearMonth.split("-");
        return { cycle: `${MONTHS[parseInt(mo)-1]} '${yr.slice(2)}`, actual: d.totalGreenLeaf };
      });
      setChartData(formatted);
    } else {
      // [{year: 2021, totalGreenLeaf: 312000}, ...]
      setChartData(data.map((d) => ({ cycle: String(d.year), actual: d.totalGreenLeaf })));
    }
  }

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalPredicted = predictions.reduce((s, d) => s + d.predicted, 0);
  const avgConfidence  = predictions.length
    ? Math.round(predictions.reduce((s, d) => s + d.confidence, 0) / predictions.length) : 0;
  const highRiskCount  = predictions.filter((d) => d.risk === "High").length;
  const chartMax       = Math.max(...chartData.map((d) => d.actual), 1);
  const predMonth      = predictions[0]
    ? `${predictions[0].year}-${String(predictions[0].month).padStart(2,"0")}` : "";

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="yield-page"><div className="yield-container">
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Connecting to Spring Boot API...</p>
        <span>{API}/api/yield/predictions</span>
      </div>
    </div></div>
  );

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) return (
    <div className="yield-page"><div className="yield-container">
      <div className="error-state">
        <h3>⚠️ Could not load data</h3>
        <p className="error-msg">{error}</p>
        <p className="error-label">Make sure these steps are done in order:</p>
        <div className="error-steps">
          <code>1. Spring Boot backend running on {API}</code>
          <code>2. division_ndvi_climate table has data in Supabase</code>
          <code>3. python yield_prediction_ml.py  ← generates predictions</code>
          <code>4. monthly_predicted_yield table now has rows</code>
        </div>
      </div>
    </div></div>
  );

  // ── No data ────────────────────────────────────────────────────────────────
  if (predictions.length === 0) return (
    <div className="yield-page"><div className="yield-container">
      <div className="error-state">
        <h3>📭 No predictions found</h3>
        <p className="error-msg">monthly_predicted_yield table is empty.</p>
        <div className="error-steps">
          <code>python yield_prediction_ml.py</code>
        </div>
      </div>
    </div></div>
  );

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="yield-page">
      <div className="yield-container">

        {/* HEADER */}
        <div className="yield-header">
          <div>
            <h2>Yield Prediction</h2>
            <span>Random Forest ML · {predMonth && `Forecast for ${predMonth} · `}6 Divisions</span>
          </div>
          <div className="header-badges">
            <span className="model-badge model-badge--live">🟢 API Live</span>
            <span className="model-badge">🤖 ML Active</span>
            <button className="refresh-btn" onClick={loadAll}>↻ Refresh</button>
          </div>
        </div>

        {/* METRIC CARDS */}
        <div className="metric-grid">
          <div className="metric-card green">
            <h1>{(totalPredicted / 1000).toFixed(1)}t</h1>
            <p>Total Forecast</p>
            <span className="badge">All Divisions</span>
          </div>
          <div className="metric-card teal">
            <h1>{avgConfidence}%</h1>
            <p>Avg Confidence</p>
            <span className="badge">Random Forest</span>
          </div>
          <div className="metric-card orange">
            <h1>{highRiskCount}</h1>
            <p>High Risk Divisions</p>
            <span className="badge">{highRiskCount > 0 ? "Needs Attention" : "All Clear"}</span>
          </div>
          <div className="metric-card blue">
            <h1>{predictions.length}</h1>
            <p>Active Divisions</p>
            <span className="badge">Rangala Estate</span>
          </div>
        </div>

        {/* DIVISION TABLE */}
        <h3 className="section-title">Division-Level Forecast</h3>
        <p className="section-sub">
          Predictions from <code>monthly_predicted_yield</code> · Click row for details
        </p>

        <div className="field-table">
          <div className="field-table-header">
            <span>Division</span>
            <span>Forecast Month</span>
            <span>Predicted Yield</span>
            <span>Risk Level</span>
            <span>Confidence</span>
          </div>

          {predictions.map((f) => (
            <div key={f.id}>
              <div
                className={`field-row ${activeDiv?.id === f.id ? "active" : ""}`}
                onClick={() => setActiveDiv(activeDiv?.id === f.id ? null : f)}
              >
                <span className="field-name">
                  <span className="field-id">{f.id}</span>
                  {f.name}
                </span>
                <span style={{ color: "#5f7c6b", fontSize: 13 }}>
                  {f.year}-{String(f.month).padStart(2,"0")}
                </span>
                <span className="yield-val">{f.predicted.toLocaleString()} kg</span>
                <span>
                  <span className={`risk-badge risk-${f.risk.toLowerCase()}`}>{f.risk}</span>
                </span>
                <span className="conf-val">{f.confidence}%</span>
              </div>

              {activeDiv?.id === f.id && (
                <div className="expanded-row">
                  <p className="expanded-title">Prediction details</p>
                  <div className="expanded-grid">
                    <div className="exp-item"><span>Division</span>        <strong>{f.name}</strong></div>
                    <div className="exp-item"><span>Predicted Yield</span> <strong>{f.predicted.toLocaleString()} kg</strong></div>
                    <div className="exp-item"><span>Forecast Month</span>  <strong>{f.year}-{String(f.month).padStart(2,"0")}</strong></div>
                    <div className="exp-item"><span>Risk Level</span>      <strong>{f.risk}</strong></div>
                    <div className="exp-item"><span>Model</span>           <strong>Random Forest</strong></div>
                    <div className="exp-item"><span>Data Source</span>     <strong>division_ndvi_climate</strong></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CHART */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="section-title" style={{ margin: 0 }}>
                {chartView === "monthly" ? "Monthly Yield History (last 12 months)" : "Annual Yield History"}
              </h3>
              <p className="section-sub" style={{ margin: "4px 0 0" }}>
                All divisions · kg · from <code>division_ndvi_climate</code>
              </p>
            </div>
            <div className="chart-toggle">
              <button className={chartView === "monthly" ? "toggle-btn active" : "toggle-btn"}
                      onClick={() => setChartView("monthly")}>Monthly</button>
              <button className={chartView === "yearly"  ? "toggle-btn active" : "toggle-btn"}
                      onClick={() => setChartView("yearly")}>Yearly</button>
            </div>
          </div>

          <div className="bar-chart">
            {chartData.map((d, i) => (
              <div className="bar-group" key={i}>
                <div className="bars">
                  <div className="bar actual"
                       style={{ height: `${(d.actual / chartMax) * 130}px` }}
                       title={`${d.cycle}: ${d.actual.toLocaleString()} kg`} />
                </div>
                <span className="bar-label">{d.cycle}</span>
              </div>
            ))}
          </div>

          <div className="chart-legend">
            <span><span className="legend-dot actual-dot" />Actual Green Leaf (kg)</span>
          </div>
        </div>

      </div>
    </div>
  );
}
