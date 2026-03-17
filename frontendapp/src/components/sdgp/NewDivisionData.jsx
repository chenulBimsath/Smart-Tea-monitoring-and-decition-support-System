import React from "react";
import "./NewDivisionData.css";

export default function NewDivisionData({ setPage }) {
  // Updated targets to be specific to the New Division
  const cards = [
    { 
      id: 1, 
      title: "Yield Data", 
      target: "new_div_crop_yields", // <-- Changed this
      imageSrc: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 2, 
      title: "Fertilizer Data", 
      target: "new_div_fertilizer", // <-- Changed this
      imageSrc: "https://www.tmkhb.com/wp-content/uploads/2024/05/TMK-Composter.jpg" 
    },
    { 
      id: 3, 
      title: "Financial Data", 
      target: "new_div_financials", // <-- Changed this
      imageSrc: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 4, 
      title: "Agronomic Data", 
      target: "new_div_agronomic", // <-- Changed this
      imageSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80" 
    }
  ];

  return (
    <div className="new-division-page">
      
      <div className="new-division-header">
        <h2>New Division Field Data Overview</h2>
        
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