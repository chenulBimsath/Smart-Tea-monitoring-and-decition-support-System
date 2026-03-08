import "./RangalaData.css";

export default function RangalaData({ setPage }) {
  // Define the 4 cards. You can change the titles and target pages as needed.
  const cards = [
    { id: 1, title: "Crop Yields", target: "crop_yields", icon: "🌱" },
    { id: 2, title: "Plucker Stats", target: "plucker_stats", icon: "🧑‍🌾" },
    { id: 3, title: "Financials", target: "financials", icon: "💰" },
    { id: 4, title: "Monthly Reports", target: "monthly_reports", icon: "📊" }
  ];

  return (
    <div className="rangala-page">
      
      <div className="rangala-header">
        <h2>Rangala Field Data Overview</h2>
        
        <div className="header-buttons">
          <button
            className="back-btn"
            onClick={() => setPage("rangaladivisions")}
          >
            ← Back to Divisions
          </button>
        </div>
      </div>

      <div className="cards-container">
        {cards.map((card) => (
          <div 
            key={card.id} 
            className="data-card"
            onClick={() => setPage(card.target)}
          >
            <div className="card-icon">{card.icon}</div>
            <h3>{card.title}</h3>
          </div>
        ))}
      </div>

    </div>
  );
}