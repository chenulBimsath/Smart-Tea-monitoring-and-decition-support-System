import "./FieldData.css";

export default function FieldData({ setPage }) {
  const stats = [
    { title: "Total States", value: 4 },
    { title: "Total Fields", value: 24 },
    { title: "Healthy Fields", value: 20 },
    { title: "Stressed Fields", value: 4 },
  ];

  const regions = [
    { 
      name: "Rangala", 
      image: "/1.png"  
    },
    { 
      name: "Hatton", 
      image: "/2.png" 
    },
    { 
      name: "Badulla", 
      image: "/3.png" 
    },
    { 
      name: "Nuwara Eliya", 
      image: "/4.png" 
    },
  ];

  return (
    <div className="fielddata-page">
      {/* HEADER */}
      <div className="fielddata-header">
        <h2>Field Data</h2>
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

      {/* REGION SQUARES */}
      <div className="region-grid">
        {regions.map((region, index) => (
          <div 
            key={index} 
            className="region-box" 
            onClick={() => { if (region.name === "Rangala") setPage("rangaladivisions"); }}
          >
            <div className="region-image-wrapper">
              <img src={region.image} alt={region.name} className="region-image" />
            </div>
            <div className="region-info">
              <span>{region.name}</span>
              <span className="arrow">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}