import "./Dashboard.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {

  /* FIELD STATUS PIE */
  const fieldStatusData = [
    { name: "Healthy", value: 65, color: "#2ecc71" },
    { name: "Moderate", value: 25, color: "#f1c40f" },
    { name: "Stressed", value: 10, color: "#e74c3c" },
  ];

  /* FERTILIZER SCHEDULE */
  const fertilizerSchedule = [
    { type: "Nitrogen (N)", amount: "120 kg/ha", timing: "Week 4" },
    { type: "Phosphorus (P)", amount: "60 kg/ha", timing: "Week 6" },
    { type: "Potassium (K)", amount: "80 kg/ha", timing: "Week 8" },
  ];

  /* ALERTS */
  const alerts = [
    {
      severity: "critical",
      title: "Low Soil Moisture — Field A3",
      message: "Immediate irrigation required",
    },
    {
      severity: "warning",
      title: "Pest Detection — Field B2",
      message: "Moderate pest activity detected",
    },
  ];

  return (
    <div className="dashboard-simple">

      {/* KPI CARDS */}
      <div className="kpi-grid">
        <div className="dashboard-card">
          <h3>Overall Plantation Health</h3>
          <h1>87%</h1>
          <span className="status healthy">Healthy</span>
        </div>

        <div className="dashboard-card">
          <h3>NDVI Score</h3>
          <h1>0.78</h1>
          <p>Vegetation density index</p>
        </div>

        <div className="dashboard-card">
          <h3>Weather</h3>
          <p>🌤 28°C</p>
          <p>Humidity 65%</p>
          <p>Rainfall 0mm</p>
        </div>

        <div className="dashboard-card">
          <h3>Yield Prediction</h3>
          <h1>4.8 tons/ha</h1>
          <p>AI-based estimation</p>
        </div>
      </div>

      {/* SECOND ROW */}
      <div className="dashboard-row">

        {/* FIELD STATUS PIE */}
        <div className="dashboard-card">
          <h2>Field Status Distribution</h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={fieldStatusData} dataKey="value" outerRadius={90}>
                {fieldStatusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* FERTILIZER RECOMMENDATION */}
        <div className="dashboard-card">
          <h2>Fertilizer Recommendation</h2>

          {fertilizerSchedule.map((item, i) => (
            <div key={i} className="fertilizer-item">
              <strong>{item.type}</strong>
              <p>{item.timing}</p>
              <small>Rate: {item.amount}</small>
            </div>
          ))}
        </div>

      </div>

      {/* ALERTS */}
      <div className="dashboard-card wide">
        <h2>Active Alerts</h2>

        {alerts.map((alert, i) => (
          <div key={i} className={`alert ${alert.severity}`}>
            <strong>{alert.title}</strong>
            <p>{alert.message}</p>
          </div>
        ))}
      </div>

    </div>
  );
}