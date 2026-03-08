import React, { useState } from "react";
import "./CropYields.css"; // Updated filename import

export default function CropYields({ setPage }) {
  const data = {
    2023: [
      { crop_id: "RY-001", month: "January", green_leaf: 300, pluckers: 10, cash_kilo: 110, without_cash_avg: 90 },
      { crop_id: "RY-002", month: "February", green_leaf: 280, pluckers: 9, cash_kilo: 105, without_cash_avg: 85 },
      { crop_id: "RY-003", month: "March", green_leaf: 320, pluckers: 11, cash_kilo: 115, without_cash_avg: 95 }
    ],
    2024: [
      { crop_id: "RY-004", month: "January", green_leaf: 330, pluckers: 12, cash_kilo: 120, without_cash_avg: 98 },
      { crop_id: "RY-005", month: "February", green_leaf: 310, pluckers: 10, cash_kilo: 118, without_cash_avg: 92 },
      { crop_id: "RY-006", month: "March", green_leaf: 350, pluckers: 13, cash_kilo: 125, without_cash_avg: 100 }
    ],
    2025: [
      { crop_id: "RY-007", month: "January", green_leaf: 360, pluckers: 14, cash_kilo: 130, without_cash_avg: 105 },
      { crop_id: "RY-008", month: "February", green_leaf: 340, pluckers: 12, cash_kilo: 128, without_cash_avg: 102 },
      { crop_id: "RY-009", month: "March", green_leaf: 370, pluckers: 15, cash_kilo: 135, without_cash_avg: 110 }
    ]
  };

  const years = Object.keys(data);
  const [currentPage, setCurrentPage] = useState(0);
  const currentYear = years[currentPage];
  const yearData = data[currentYear];

  return (
    <div className="yield-page">
      <div className="yield-header">
        <div className="title-section">
          <h1>Rangala Yield Analytics</h1>
          <p>Detailed harvest records for the year {currentYear}</p>
        </div>
        <button className="back-to-grid-btn" onClick={() => setPage("rangaladata")}>
          ← Back to Overview
        </button>
      </div>

      <div className="table-card">
        <table className="yield-table">
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Harvest Month</th>
              <th>Green Leaf Yield</th>
              <th>Plucker Count</th>
              <th>Rate (LKR/kg)</th>
              <th>Average Margin</th>
            </tr>
          </thead>
          <tbody>
            {yearData.map((item, index) => (
              <tr key={index}>
                <td className="id-cell">{item.crop_id}</td>
                <td className="month-cell">{item.month}</td>
                <td><span className="yield-badge">{item.green_leaf} kg</span></td>
                <td>{item.pluckers} Workers</td>
                <td className="currency-cell">රු. {item.cash_kilo}.00</td>
                <td>{item.without_cash_avg}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="table-footer">
          <button 
            className="nav-btn" 
            onClick={() => setCurrentPage(p => p - 1)} 
            disabled={currentPage === 0}
          >
            ← Previous Year
          </button>
          <div className="year-label">Viewing Data: <strong>{currentYear}</strong></div>
          <button 
            className="nav-btn" 
            onClick={() => setCurrentPage(p => p + 1)} 
            disabled={currentPage === years.length - 1}
          >
            Next Year →
          </button>
        </div>
      </div>
    </div>
  );
}