import React, { useState, useEffect } from "react";
import "./CropYields.css"; 

export default function CropYields({ setPage }) {
  // --- STATE ---
  const [allData, setAllData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;
  const [openMenuId, setOpenMenuId] = useState(null);

  // --- FETCH DATA FROM SPRING BOOT ---
  useEffect(() => {
    fetchCropData();
  }, []);

  const fetchCropData = async () => {
    try {
      // Make sure this URL matches your backend port (usually 8080)
      const response = await fetch("http://localhost:8080/api/crop-details");
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      setAllData(data);

      // Extract unique years from the real data, sort descending (newest first)
      const years = [...new Set(data.map(item => item.year))].sort((a, b) => b - a);
      setAvailableYears(years);
      
      // Set the default dropdown value
      if (years.length > 0) {
        setSelectedYear(years[0].toString());
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Reset pagination when year dropdown changes
  useEffect(() => {
    setCurrentPage(1);
    setOpenMenuId(null); 
  }, [selectedYear]);

  // --- FILTER & PAGINATE ---
  // Filter data for the selected year
  const yearData = allData.filter(item => item.year && item.year.toString() === selectedYear.toString());
  
  const totalPages = Math.ceil(yearData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = yearData.slice(startIndex, startIndex + rowsPerPage);

  // --- ACTIONS ---
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDelete = async (cropId) => {
    if (window.confirm(`Are you sure you want to delete Crop ID ${cropId}?`)) {
      try {
        const response = await fetch(`http://localhost:8080/api/crop-details/${cropId}`, {
          method: "DELETE"
        });

        if (response.ok) {
          // Remove deleted item from the React UI immediately
          setAllData(prevData => prevData.filter(item => item.cropId !== cropId));
          setOpenMenuId(null); 
        } else {
          alert("Failed to delete record from backend.");
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
              {availableYears.length === 0 && <option>No data</option>}
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
                <td colSpan="7" style={{textAlign: "center", padding: "30px", color: "#666"}}>
                  No records found for {selectedYear}. Please add data to your database.
                </td>
              </tr>
            ) : (
              currentRows.map((item, index) => (
                <tr key={item.cropId || index}>
                  
                  {/* EXACT MAPPINGS TO JAVA DTO */}
                  <td className="id-cell">{item.cropId}</td>
                  <td style={{fontWeight: '600', color: '#555'}}>{item.divisionId}</td>
                  <td className="month-cell">{item.month}</td>
                  <td><span className="yield-badge">{item.greenLeafKg} kg</span></td>
                  <td>{item.pluckers} Workers</td>
                  <td className="currency-cell">රු. {item.cashKilo}</td>
                  
                  {/* Action Menu */}
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

        {/* Pagination Footer */}
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