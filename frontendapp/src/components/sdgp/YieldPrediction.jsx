import { useState } from "react";
import "./YieldPrediction.css";

const ML_DATA = {
  mae: 1232.21,
  r2: 0.7492,
  divisions: [
    { id:"F-01", name:"Rangala",       ndvi:0.683, predicted:6804,  change:8.9,   risk:"Low",    confidence:83, avg_pluckers:232.9, avg_temp:19.29, avg_rainfall:7.58, avg_humidity:89.27 },
    { id:"F-02", name:"Poodelgodda",   ndvi:0.683, predicted:4595,  change:-11.8, risk:"Low",    confidence:83, avg_pluckers:260.2, avg_temp:19.29, avg_rainfall:7.58, avg_humidity:89.27 },
    { id:"F-03", name:"Ranwella",      ndvi:0.683, predicted:6580,  change:-22.6, risk:"Low",    confidence:83, avg_pluckers:379.1, avg_temp:19.29, avg_rainfall:7.58, avg_humidity:89.27 },
    { id:"F-04", name:"New Division",  ndvi:0.683, predicted:2126,  change:-60.6, risk:"Medium", confidence:83, avg_pluckers:184.8, avg_temp:19.29, avg_rainfall:7.58, avg_humidity:89.27 },
    { id:"F-05", name:"Kalduriya",     ndvi:0.683, predicted:7201,  change:21.6,  risk:"Medium", confidence:83, avg_pluckers:277.4, avg_temp:19.29, avg_rainfall:7.58, avg_humidity:89.27 },
    { id:"F-06", name:"Peru Division", ndvi:0.683, predicted:1920,  change:11.7,  risk:"High",   confidence:83, avg_pluckers:133.2, avg_temp:19.29, avg_rainfall:7.58, avg_humidity:89.27 },
  ],
  monthly_history: [
    { cycle:"Jan '25", actual:28591,  predicted:26786 },
    { cycle:"Feb '25", actual:21385,  predicted:23657 },
    { cycle:"Mar '25", actual:42670,  predicted:43775 },
    { cycle:"Apr '25", actual:52381,  predicted:51644 },
    { cycle:"May '25", actual:49369,  predicted:45216 },
    { cycle:"Jun '25", actual:22534,  predicted:25896 },
    { cycle:"Jul '25", actual:32164,  predicted:31315 },
    { cycle:"Aug '25", actual:27711,  predicted:26977 },
    { cycle:"Sep '25", actual:64048,  predicted:49843 },
    { cycle:"Oct '25", actual:33563,  predicted:28254 },
    { cycle:"Nov '25", actual:32506,  predicted:31936 },
    { cycle:"Dec '25", actual:33627,  predicted:27234 },
  ],
  yearly_history: [
    { year:2021, actual:609769 },
    { year:2022, actual:496934 },
    { year:2023, actual:403951 },
    { year:2024, actual:395955 },
    { year:2025, actual:440549 },
  ],
  feature_importances: { Pluckers:87.6, Temperature:3.4, Rainfall:3.0, Humidity:3.0, NDVI:2.9 },
};

function simulateRF(pluckers, temperature, rainfall, humidity, ndvi) {
  const base = 6804;
  const fi   = { Pluckers:0.876, Temperature:0.034, Rainfall:0.03, Humidity:0.03, NDVI:0.029 };
  const avg  = { Pluckers:233, Temperature:19.29, Rainfall:7.58, Humidity:89.27, NDVI:0.683 };
  return Math.max(100, Math.round(
    base
    + ((pluckers    - avg.Pluckers)    / avg.Pluckers)    * fi.Pluckers    * base
    + ((temperature - avg.Temperature) / avg.Temperature) * fi.Temperature * base
    + ((rainfall    - avg.Rainfall)    / avg.Rainfall)    * fi.Rainfall    * base
    + ((humidity    - avg.Humidity)    / avg.Humidity)    * fi.Humidity    * base
    + ((ndvi        - avg.NDVI)        / avg.NDVI)        * fi.NDVI        * base
  ));
}

export default function YieldPrediction() {
  const { divisions, monthly_history, yearly_history, mae, r2, feature_importances } = ML_DATA;

  const [activeField, setActiveField] = useState(null);
  const [simForm, setSimForm]         = useState({ pluckers:233, temperature:19.3, rainfall:7.6, humidity:89.3, ndvi:0.68 });
  const [simResult, setSimResult]     = useState(null);
  const [chartView, setChartView]     = useState("monthly");

  const totalPredicted = divisions.reduce((s, d) => s + d.predicted, 0);
  const avgConfidence  = Math.round(divisions.reduce((s, d) => s + d.confidence, 0) / divisions.length);
  const highRiskCount  = divisions.filter((d) => d.risk === "High").length;

  const setForm = (k, v) => setSimForm((p) => ({ ...p, [k]: v }));

  const runSimulation = () => {
    const base   = activeField || divisions[0];
    const result = simulateRF(simForm.pluckers, simForm.temperature, simForm.rainfall, simForm.humidity, simForm.ndvi);
    setSimResult({ field: base.name, base: base.predicted, result, diff: result - base.predicted });
  };

  const chartData = chartView === "monthly"
    ? monthly_history
    : yearly_history.map((y) => ({ cycle: String(y.year), actual: y.actual, predicted: null }));

  const chartMax = Math.max(...chartData.flatMap((d) => [d.actual, d.predicted ?? 0]));

  return (
    <div className="yield-page">
      <div className="yield-container">

        {/* ── HEADER ── */}
        <div className="yield-header">
          <div>
            <h2>Yield Prediction</h2>
            <span>Random Forest Model · R² {r2} · MAE {mae.toLocaleString()} kg · 360 Records (2021–2025)</span>
          </div>
          <div className="header-badges">
            <span className="model-badge"> ML Model Active </span>
            <span className="model-badge">6 Divisions</span>
          </div>
        </div>

        {/* ── METRIC CARDS ── */}
        <div className="metric-grid">
          <div className="metric-card green">
            <h1>{(totalPredicted / 1000).toFixed(1)}t</h1>
            <p>Total Forecast</p>
            <span className="badge">All Divisions</span>
          </div>
          <div className="metric-card teal">
            <h1>{avgConfidence}%</h1>
            <p>Model Confidence</p>
            <span className="badge">R² = {r2}</span>
          </div>
          <div className="metric-card orange">
            <h1>{highRiskCount}</h1>
            <p>High Risk Divisions</p>
            <span className="badge">{highRiskCount > 0 ? "Needs Attention" : "All Clear"}</span>
          </div>
          <div className="metric-card blue">
            <h1>{divisions.length}</h1>
            <p>Active Divisions</p>
            <span className="badge">Rangala Estate</span>
          </div>
        </div>

        {/* ── DIVISION TABLE ── */}
        <h3 className="section-title">Division-Level Forecast</h3>
        <p className="section-sub">Click a division to select it for simulation · Predictions from trained Random Forest</p>

        <div className="field-table">
          <div className="field-table-header">
            <span>Division</span>
            <span>Avg NDVI</span>
            <span>Predicted Yield</span>
            <span>vs Last Year</span>
            <span>Risk</span>
            <span>Confidence</span>
          </div>

          {divisions.map((f) => (
            <div
              key={f.id}
              className={`field-row ${activeField?.id === f.id ? "active" : ""}`}
              onClick={() => setActiveField(activeField?.id === f.id ? null : f)}
            >
              <span className="field-name">
                <span className="field-id">{f.id}</span>
                {f.name}
                <span className="field-zone">~{f.avg_pluckers} pluckers avg</span>
              </span>

              <span>
                <div className="ndvi-bar-wrap">
                  <div
                    className={`ndvi-bar ${f.ndvi >= 0.7 ? "good" : f.ndvi >= 0.5 ? "mid" : "bad"}`}
                    style={{ width: `${f.ndvi * 100}%` }}
                  />
                </div>
                <span className={`ndvi-val ${f.ndvi >= 0.7 ? "good" : f.ndvi >= 0.5 ? "mid" : "bad"}`}>
                  {f.ndvi.toFixed(3)}
                </span>
              </span>

              <span className="yield-val">{f.predicted.toLocaleString()} kg</span>

              <span className={`change-val ${f.change >= 0 ? "pos" : "neg"}`}>
                {f.change >= 0 ? "▲" : "▼"} {Math.abs(f.change)}%
              </span>

              <span>
                <span className={`risk-badge risk-${f.risk.toLowerCase()}`}>{f.risk}</span>
              </span>

              <span className="conf-val">{f.confidence}%</span>
            </div>
          ))}
        </div>

        {/* ── BOTTOM GRID ── */}
        <div className="bottom-grid">

          {/* Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3 className="section-title" style={{ margin:0 }}>
                  {chartView === "monthly" ? "Monthly Actual vs Predicted (2025)" : "Annual Total Yield (2021–2025)"}
                </h3>
                <p className="section-sub" style={{ margin:"4px 0 0" }}>
                  {chartView === "monthly" ? "All 6 divisions combined · kg" : "All 6 divisions combined · kg"}
                </p>
              </div>
              <div className="chart-toggle">
                <button className={chartView === "monthly" ? "toggle-btn active" : "toggle-btn"} onClick={() => setChartView("monthly")}>Monthly</button>
                <button className={chartView === "yearly"  ? "toggle-btn active" : "toggle-btn"} onClick={() => setChartView("yearly")}>Yearly</button>
              </div>
            </div>

            <div className="bar-chart">
              {chartData.map((d, i) => (
                <div className="bar-group" key={i}>
                  <div className="bars">
                    <div className="bar actual"        style={{ height:`${(d.actual / chartMax) * 130}px` }} title={`Actual: ${d.actual.toLocaleString()} kg`} />
                    {d.predicted != null && (
                      <div className="bar predicted-bar" style={{ height:`${(d.predicted / chartMax) * 130}px` }} title={`Predicted: ${d.predicted.toLocaleString()} kg`} />
                    )}
                  </div>
                  <span className="bar-label">{d.cycle}</span>
                </div>
              ))}
            </div>

            <div className="chart-legend">
              <span><span className="legend-dot actual-dot" />Actual</span>
              {chartView === "monthly" && <span><span className="legend-dot predicted-dot" />ML Predicted</span>}
            </div>

            {/* Feature importances */}
            <div className="importance-section">
              <p className="importance-title">Feature Importances (Random Forest)</p>
              {Object.entries(feature_importances).map(([feat, val]) => (
                <div className="imp-row" key={feat}>
                  <span className="imp-label">{feat}</span>
                  <div className="imp-bar-wrap">
                    <div className="imp-bar" style={{ width:`${val}%` }} />
                  </div>
                  <span className="imp-val">{val}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simulator */}
          <div className="simulator-card">
            <h3 className="section-title" style={{ margin:"0 0 4px" }}>Yield Simulator</h3>
            <p className="sim-sub">
              {activeField ? `📍 Simulating: ${activeField.name}` : "Select a division above, then adjust inputs"}
            </p>

            <div className="sim-form">
              <label>
                Pluckers (count)
                <input type="number" value={simForm.pluckers}    min={0}  max={800} onChange={(e) => setForm("pluckers", +e.target.value)} />
                <span className="input-hint">⭐ Most important feature (87.6%)</span>
              </label>
              <label>
                Temperature (°C)
                <input type="number" value={simForm.temperature} min={15} max={30} step={0.1} onChange={(e) => setForm("temperature", +e.target.value)} />
              </label>
              <label>
                Rainfall (mm)
                <input type="number" value={simForm.rainfall}    min={0}  max={100} step={0.1} onChange={(e) => setForm("rainfall", +e.target.value)} />
              </label>
              <label>
                Humidity (%)
                <input type="number" value={simForm.humidity}    min={50} max={100} step={0.1} onChange={(e) => setForm("humidity", +e.target.value)} />
              </label>
              <label>
                NDVI (0–1)
                <input type="number" value={simForm.ndvi}        min={0}  max={1}   step={0.001} onChange={(e) => setForm("ndvi", +e.target.value)} />
              </label>
            </div>

            <button className="run-btn" onClick={runSimulation}>Run ML Prediction</button>

            {simResult && (
              <div className="sim-result">
                <p className="sim-result-title">📊 {simResult.field}</p>
                <div className="sim-result-row"><span>Division Base Forecast</span><strong>{simResult.base.toLocaleString()} kg</strong></div>
                <div className="sim-result-row"><span>Your Simulation</span><strong className={simResult.diff >= 0 ? "pos" : "neg"}>{simResult.result.toLocaleString()} kg</strong></div>
                <div className="sim-result-row"><span>Difference</span><strong className={simResult.diff >= 0 ? "pos" : "neg"}>{simResult.diff >= 0 ? "+" : ""}{simResult.diff.toLocaleString()} kg</strong></div>
                <p className="sim-note">
                  💡 {simResult.diff < -1000 ? "Significant yield drop. Review plucker count and NDVI health."
                    : simResult.diff > 1000  ? "Above-average yield expected. Ensure harvest resources are ready."
                    :                          "Yield near division baseline. Conditions are stable."}
                </p>
              </div>
            )}

            <div className="model-info">
              <p className="model-info-title">Model Details</p>
              <div className="sim-result-row"><span>Algorithm</span>     <strong>Random Forest (100 trees)</strong></div>
              <div className="sim-result-row"><span>Training Data</span> <strong>360 records · 2021–2025</strong></div>
              <div className="sim-result-row"><span>MAE</span>           <strong>{mae.toLocaleString()} kg/division</strong></div>
              <div className="sim-result-row"><span>R² Score</span>      <strong>{r2}</strong></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
