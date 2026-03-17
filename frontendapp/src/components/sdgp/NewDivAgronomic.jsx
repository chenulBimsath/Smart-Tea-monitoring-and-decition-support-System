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

  // Placeholders for future commits
  const currentRows = []; 
  const totalPages = 0;

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
              <option>No data</option>
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
              <tr>
                <td colSpan="14" style={{textAlign: "center", padding: "30px", color: "#666"}}>
                  No agronomic records found for {selectedYear}. Please add data.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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