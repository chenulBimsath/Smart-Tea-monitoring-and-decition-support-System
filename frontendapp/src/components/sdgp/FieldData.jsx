import "./FieldData.css";

export default function FieldData() {
  const stats = [
    { title: "Total States", value: 4 },
    { title: "Total Fields", value: 24 },
    { title: "Healthy Fields", value: 20 },
    { title: "Stressed Fields", value: 4 },
  ];

  const regions = [
    { name: "Rangala" },
    { name: "Galle" },
    { name: "Badulla" },
    { name: "Nuwaraeliya" },
  ];

  return (
    <div className="fielddata-page">
      {/* HEADER */}
      <div className="fielddata-header">
        <h2>Field Data</h2>
        <button className="add-field-btn">+ Add New Field Data</button>
      </div>

      {/* TOP STATS */}
      <div className="stats-grid">
        {stats.map((item, index) => (
          <div key={index} className="stat-card">
            <h4>{item.title}</h4>
            <p>{item.value}</p>
          </div>
        ))}
      </div>

      {/* REGIONS */}

      <div className="region-grid">
        {regions.map((region, index) => (
          <div key={index} className="region-box">
            <span>{region.name}</span>
            <span className="arrow">→</span>
          </div>
        ))}
      </div>
    </div>
  );
}