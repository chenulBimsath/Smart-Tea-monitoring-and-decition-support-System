import React, { useState, useEffect } from "react";
import "./CropYields.css"; 

// Helper function to generate dummy data
const generateMockData = (year, count) => {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const divisions = ["DIV-01", "DIV-02", "DIV-03", "DIV-04"]; // Added division list
  
  return Array.from({ length: count }, (_, i) => ({
    crop_id: `RY-${year.toString().slice(-2)}${(i + 1).toString().padStart(3, '0')}`,
    division_id: divisions[Math.floor(Math.random() * divisions.length)], // Randomly assign a division
    month: months[i % 12],
    green_leaf: Math.floor(Math.random() * 150) + 200, 
    pluckers: Math.floor(Math.random() * 10) + 8,      
    cash_kilo: Math.floor(Math.random() * 30) + 100,   
    without_cash_avg: Math.floor(Math.random() * 20) + 80 
  }));
};

const initialData = {
  2021: generateMockData(2021, 65),
  2022: generateMockData(2022, 58),
  2023: generateMockData(2023, 72),
  2024: generateMockData(2024, 60),
  2025: generateMockData(2025, 85)
};

export default function CropYields({ setPage }) {
  const [data, setData] = useState(initialData);
  
  const years = Object.keys(data).sort((a, b) => b - a);
  const [selectedYear, setSelectedYear] = useState(years[0]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;

  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    setCurrentPage(1);
    setOpenMenuId(null); 
  }, [selectedYear]);

  const yearData = data[selectedYear] || [];
  const totalPages = Math.ceil(yearData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = yearData.slice(startIndex, startIndex + rowsPerPage);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDelete = (crop_id) => {
    if (window.confirm(`Are you sure you want to delete record ${crop_id}?`)) {
      const updatedYearData = yearData.filter(item => item.crop_id !== crop_id);
      setData({
        ...data,
        [selectedYear]: updatedYearData
      });
      setOpenMenuId(null); 
    }
  };

  const handleUpdate = (item) => {
    alert(`Opening update form for ${item.crop_id}...`);
    setOpenMenuId(null);
  };

  return (
    <div className="yield-page">
      <div className="yield-header">
        <div className="title-section">
          <h1>Rangala Yield Analytics</h1>
          <p>Analyzing harvest performance for the year {selectedYear}</p>
        </div>

        <div className="header-controls">
          <div className="dropdown-container">
            <label htmlFor="year-select">Select Harvest Year: </label>
            <select 
              id="year-select" 
              className="year-dropdown"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <button className="back-to-grid-btn" onClick={() => setPage("rangaladata")}>
            ← Back to Overview
          </button>
        </div>
      </div>

      <div className="table-card shadow-lg">
        <table className="yield-table">
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Division ID</th> {/* Added Division Header */}
              <th>Harvest Month</th>
              <th>Green Leaf Yield</th>
              <th>Plucker Count</th>
              <th>Rate (LKR/kg)</th>
              <th>Average Margin</th>
              <th className="action-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((item, index) => (
              <tr key={index}>
                <td className="id-cell">{item.crop_id}</td>
                <td style={{fontWeight: '600', color: '#555'}}>{item.division_id}</td> {/* Added Division Data */}
                <td className="month-cell">{item.month}</td>
                <td><span className="yield-badge">{item.green_leaf} kg</span></td>
                <td>{item.pluckers} Workers</td>
                <td className="currency-cell">රු. {item.cash_kilo}.00</td>
                <td>{item.without_cash_avg}%</td>
                
                <td 
                  className="action-cell" 
                  onMouseLeave={() => setOpenMenuId(null)}
                >
                  <button 
                    className="action-dots-btn" 
                    onClick={() => toggleMenu(item.crop_id)}
                  >
                    ⋮
                  </button>

                  {openMenuId === item.crop_id && (
                    <div className="action-dropdown">
                      <button onClick={() => handleUpdate(item)}>
                        ✎ Update
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(item.crop_id)}>
                        🗑 Delete
                      </button>
                    </div>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 0 && (
          <div className="table-footer">
            <button 
              className="nav-btn" 
              onClick={() => { setCurrentPage(p => p - 1); setOpenMenuId(null); }} 
              disabled={currentPage === 1}
            >
              ← Previous 25
            </button>
            <div className="year-label">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              <span style={{marginLeft: "10px", fontSize: "0.85rem", color: "#888"}}>
                (Total records: {yearData.length})
              </span>
            </div>
            <button 
              className="nav-btn" 
              onClick={() => { setCurrentPage(p => p + 1); setOpenMenuId(null); }} 
              disabled={currentPage === totalPages}
            >
              Next 25 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}