import React, { useState, useEffect } from "react";
import "./CropYields.css"; 

export default function CropYields({ setPage }) {
  // 1. State for real backend data
  const [allData, setAllData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  
  // Pagination & UI State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;
  const [openMenuId, setOpenMenuId] = useState(null);

  // 2. Fetch Data from Spring Boot on component mount
  useEffect(() => {
    fetchCropData();
  }, []);

  const fetchCropData = async () => {
    try {
      // Assuming your Spring Boot backend is running on port 8080
      const response = await fetch("http://localhost:8080/api/crop-details");
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      setAllData(data);

      // 3. Extract unique years from the real data and sort newest to oldest
      const years = [...new Set(data.map(item => item.year))].sort((a, b) => b - a);
      setAvailableYears(years);
      
      // Set the default dropdown value to the most recent year
      if (years.length > 0) {
        setSelectedYear(years[0].toString());
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load data from backend.");
    }
  };

  // Reset pagination when year changes
  useEffect(() => {
    setCurrentPage(1);
    setOpenMenuId(null); 
  }, [selectedYear]);

  // 4. Filter data dynamically based on the selected year dropdown
  const yearData = allData.filter(item => item.year.toString() === selectedYear.toString());
  
  // Pagination Logic
  const totalPages = Math.ceil(yearData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = yearData.slice(startIndex, startIndex + rowsPerPage);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // 5. Connect Delete button to the Backend API
  const handleDelete = async (cropId) => {
    if (window.confirm(`Are you sure you want to delete record ${cropId}?`)) {
      try {
        const response = await fetch(`http://localhost:8080/api/crop-details/${cropId}`, {
          method: "DELETE"
        });

        if (response.ok) {
          // Remove it from the local React state immediately so the UI updates
          setAllData(prevData => prevData.filter(item => item.cropId !== cropId));
          setOpenMenuId(null); 
        } else {
          alert("Failed to delete record.");
        }
      } catch (error) {
        console.error("Error deleting data:", error);
      }
    }
  };

  const handleUpdate = (item) => {
    alert(`Update functionality for Crop ID ${item.cropId} will go here!`);
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
              {availableYears.map((year) => (
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
              <th>Division ID</th>
              <th>Harvest Month</th>
              <th>Green Leaf Yield</th>
              <th>Plucker Count</th>
              <th>Rate (LKR/kg)</th>
              <th className="action-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan="7" style={{textAlign: "center", padding: "30px"}}>No data available for {selectedYear}</td>
              </tr>
            ) : (
              currentRows.map((item, index) => (
                <tr key={index}>
                  {/* Notice how item.crop_id is now item.cropId to match your Java DTO */}
                  <td className="id-cell">{item.cropId}</td>
                  <td style={{fontWeight: '600', color: '#555'}}>{item.divisionId}</td>
                  <td className="month-cell">{item.month}</td>
                  <td><span className="yield-badge">{item.greenLeafKg} kg</span></td>
                  <td>{item.pluckers} Workers</td>
                  <td className="currency-cell">රු. {item.cashKilo}</td>
                  
                  <td 
                    className="action-cell" 
                    onMouseLeave={() => setOpenMenuId(null)}
                  >
                    <button 
                      className="action-dots-btn" 
                      onClick={() => toggleMenu(item.cropId)}
                    >
                      ⋮
                    </button>

                    {openMenuId === item.cropId && (
                      <div className="action-dropdown">
                        <button onClick={() => handleUpdate(item)}>
                          ✎ Update
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(item.cropId)}>
                          🗑 Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
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