import React, { useState, useEffect } from "react";
import "./NewDivFertilizer.css"; 

export default function NewDivFertilizer({ setPage }) {
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
    date: "", fieldNo: "", typeOfTea: "Clonal", cropStatus: "Mature",
    fertilizerName: "", nutrientRatio: "", quantityPerHa: "", totalQuantity: "",
    applicationMethod: "Broadcasting", condition: "Moist", supervisor: ""
  });

  const teaTypes = ["Clonal", "Seedling"];
  const cropStatuses = ["Mature", "Immature", "Pruned"];
  const applicationMethods = ["Broadcasting", "Ring Placement", "Foliar Spray"];
  const weatherConditions = ["Moist", "Sunny", "Rain", "Dry"];

  // Placeholders for future commits
  const currentRows = []; 
  const totalPages = 0;
  const yearData = [];

  const toggleMenu = (id) => setOpenMenuId(openMenuId === id ? null : id);
  const openAddPopup = () => setIsPopupOpen(true);
  const handleUpdate = (item) => {};
  const handleDelete = async (id) => {};
  const handleFormChange = (e) => {};
  const handleSubmit = async (e) => { e.preventDefault(); };

  return (
    <div className="new-fert-page">
      <div className="new-fert-header">
        <div className="new-fert-title-section">
          <h1>New Division Fertilizer Analytics</h1>
          <p>Tracking nutrient applications for the year {selectedYear}</p>
        </div>

        <button className="new-fert-add-record-btn" onClick={openAddPopup}>
          + Add Fertilizer Record
        </button>

        <div className="new-fert-header-controls">
          <div className="new-fert-dropdown-container">
            <label htmlFor="year-select">Select Year: </label>
            <select 
              id="year-select" 
              className="new-fert-year-dropdown"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option>No data</option>
            </select>
          </div>
          <button className="new-fert-back-to-grid-btn" onClick={() => setPage("newdivisiondata")}>
            ← Back to Overview
          </button>
        </div>
      </div>

      <div className="new-fert-table-card shadow-lg">
        <div className="new-fert-table-responsive">
          <table className="new-fert-table">
            <thead>
              <tr>
                <th>Date</th><th>Field No</th><th>Tea Type</th><th>Status</th>
                <th>Fertilizer</th><th>N:P:K Ratio</th><th>Qty/Ha (kg)</th>
                <th>Total Qty (kg)</th><th>Method</th><th>Condition</th>
                <th>Supervisor</th><th className="new-fert-action-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="12" style={{textAlign: "center", padding: "30px", color: "#666"}}>
                  No records found for {selectedYear}. Please add data to your database.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {isPopupOpen && (
        <div className="new-fert-modal-overlay">
          <div className="new-fert-modal-content new-fert-large-modal">
            <div className="new-fert-modal-header">
              <h2>Add Fertilizer Data</h2>
              <button className="new-fert-close-btn" onClick={() => setIsPopupOpen(false)}>✕</button>
            </div>
            <form className="new-fert-add-form new-fert-grid-form" onSubmit={handleSubmit}>
              <button type="submit" className="new-fert-submit-btn new-fert-full-width">
                Save Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}