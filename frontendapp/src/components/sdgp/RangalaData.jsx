import React from "react";
import "./RangalaData.css";

export default function RangalaData({ setPage }) {
  // Using high-quality placeholder images so you can see the layout immediately.
  // Replace these URLs with your local image paths (e.g., "/images/crop.jpg") when ready.
  const cards = [
    { 
      id: 1, 
      title: "Crop Yields", 
      target: "crop_yields", 
      imageSrc: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 2, 
      title: "Plucker Stats", 
      target: "plucker_stats", 
      imageSrc: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 3, 
      title: "Financials", 
      target: "financials", 
      imageSrc: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 4, 
      title: "Monthly Reports", 
      target: "monthly_reports", 
      imageSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80" 
    }
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

      <div className="cards-grid">
        {cards.map((card) => (
          <div 
            key={card.id} 
            className="large-data-card"
            onClick={() => setPage(card.target)}
          >
            <div className="card-image-container">
              <img src={card.imageSrc} alt={card.title} className="card-image" />
            </div>
            
            <div className="card-content">
              <h3>{card.title}</h3>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}