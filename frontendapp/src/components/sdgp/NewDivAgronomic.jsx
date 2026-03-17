import React, { useState, useEffect } from "react";
import "./NewDivAgronomic.css"; 

export default function NewDivAgronomic({ setPage }) {
  const API_BASE_URL = "http://localhost:8080/api/agronomic-data";

  // --- STATE ---
  const [allData, setAllData] = useState([]); 
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;
  const [openMenuId, setOpenMenuId] = useState(null);

  // --- POPUP & EDIT STATE ---
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null); 
  
  const [formData, setFormData] = useState({
    date: "", fieldNo: "", cloneType: "", pruningYear: "", pluckingInterval: "",
    leafQuality: "", rainfall: "", soilPh: "", pestDisease: "",
    weedDensity: "", shadeTree: "", inspectedBy: ""
  });

  // --- FETCH DATA ON LOAD ---
  useEffect(() => {
    fetchAgronomicData();
  }, []);

  const fetchAgronomicData = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      
      const mappedData = data.map(item => ({
        ...item,
        date: item.inspectionDate 
      }));
      
      setAllData(mappedData);

      // --- EXTRACT UNIQUE YEARS FROM DATES ---
      const years = [...new Set(mappedData.map(item => {
        if (!item.date) return null;
        return item.date.substring(0, 4); 
      }))].filter(Boolean).sort((a, b) => b - a);

      setAvailableYears(years);
      
      if (years.length > 0) {
        setSelectedYear(years[0]);
      } else {
        const currentYear = new Date().getFullYear().toString();
        setAvailableYears([currentYear]);
        setSelectedYear(currentYear);
      }

    } catch (error) {
      console.error("Error fetching agronomic data:", error);
    }
  };

  // --- RESET PAGE WHEN YEAR CHANGES ---
  useEffect(() => {
    setCurrentPage(1);
    setOpenMenuId(null); 
  }, [selectedYear]);

  // --- FILTER BY YEAR & PAGINATE ---
  const yearData = allData.filter(item => {
    if (!item.date) return false;
    return item.date.substring(0, 4) === selectedYear;
  });

  const totalPages = Math.ceil(yearData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = yearData.slice(startIndex, startIndex + rowsPerPage);

  // Placeholders for the final commit
  const toggleMenu = (id) => setOpenMenuId(openMenuId === id ? null : id);
  const openAddPopup = () => setIsPopupOpen(true);
  const handleUpdate = (item) => {};
  const handleDelete = async (id) => {};
  const handleFormChange = (e) => {};
  const handleSubmit = async (e) => { e.preventDefault(); };

  return (
    <div className="new-agro-page">
      <div className="new-agro-header">
        
        <div className="new-agro-title-section">
          <h1>New Division Agronomic Data</h1>
          <p>Tracking field conditions and crop health metrics for {selectedYear}</p>
        </div>

        <button className="new-agro-add-btn" onClick={openAddPopup}>
          + Add New Data Record
        </button>

        <div className="new-agro-controls">
          <div className="new-agro-dropdown-container">
            <label htmlFor="year-select" style={{ marginRight: '10px', fontWeight: 'bold' }}>Select Year: </label>
            <select 
              id="year-select" 
              className="new-agro-year-dropdown"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {availableYears.length === 0 && <option>No data</option>}
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <button className="new-agro-back-btn" onClick={() => setPage("newdivisiondata")}>
            ← Back to Overview
          </button>
        </div>
      </div>

      <div className="new-agro-table-card shadow-lg">
        <div className="new-agro-table-responsive">
          <table className="new-agro-table">
            <thead>
              <tr>
                <th>ID</th><th>Date</th><th>Field No</th><th>Clone/Type</th>
                <th>Pruning Yr</th><th>Plucking (Days)</th><th>Quality (%)</th>
                <th>Rainfall (mm)</th><th>Soil pH</th><th>Pest/Disease</th>
                <th>Weeds</th><th>Shade Status</th><th>Inspector</th>
                <th className="new-agro-action-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan="14" style={{textAlign: "center", padding: "30px", color: "#666"}}>
                    No agronomic records found for {selectedYear}. Please add data.
                  </td>
                </tr>
              ) : (
                currentRows.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="new-agro-id-cell">{item.id}</td> 
                    <td className="new-agro-date-cell">{item.date}</td> 
                    <td>{item.fieldNo}</td>
                    <td style={{fontWeight: '600', color: '#555'}}>{item.cloneType}</td>
                    <td>{item.pruningYear}</td>
                    <td><span className="new-agro-badge">{item.pluckingInterval}</span></td>
                    <td>{item.leafQuality}%</td>
                    <td>{item.rainfall}</td>
                    <td>{item.soilPh}</td>
                    <td>{item.pestDisease}</td>
                    <td>{item.weedDensity}</td>
                    <td>{item.shadeTree}</td>
                    <td style={{fontSize: '0.85rem'}}>{item.inspectedBy}</td>
                    <td className="new-agro-action-cell" onMouseLeave={() => setOpenMenuId(null)}>
                      <button className="new-agro-action-dots-btn" onClick={() => toggleMenu(item.id)}>⋮</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <div className="new-agro-footer">
            <button className="new-agro-nav-btn" onClick={() => { setCurrentPage(p => p - 1); setOpenMenuId(null); }} disabled={currentPage === 1}>
              ← Previous 25
            </button>
            <div className="new-agro-year-label">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              <span style={{marginLeft: "10px", fontSize: "0.85rem", color: "#888"}}>
                (Total records for {selectedYear}: {yearData.length})
              </span>
            </div>
            <button className="new-agro-nav-btn" onClick={() => { setCurrentPage(p => p + 1); setOpenMenuId(null); }} disabled={currentPage === totalPages}>
              Next 25 →
            </button>
          </div>
        )}
      </div>

      {isPopupOpen && (
        <div className="new-agro-modal-overlay">
          <div className="new-agro-modal-content new-agro-modal">
            <div className="new-agro-modal-header">
              <h2>Add Agronomic Data</h2>
              <button className="new-agro-close-btn" onClick={() => setIsPopupOpen(false)}>✕</button>
            </div>
            <form className="new-agro-grid-form" onSubmit={handleSubmit}>
              <button type="submit" className="new-agro-submit-btn new-agro-full-width">
                Save Field Data
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}