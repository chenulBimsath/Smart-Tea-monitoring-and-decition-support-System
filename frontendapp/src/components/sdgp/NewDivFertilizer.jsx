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

  // --- FETCH DATA FROM SPRING BOOT ---
  useEffect(() => {
    fetchFertilizerData();
  }, []);

  const fetchFertilizerData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/fertilizer-data");
      if (!response.ok) throw new Error("Network response was not ok");
      
      const rawData = await response.json();
      
      const mappedData = rawData.map(item => ({
        id: item.id,
        date: item.applicationDate, 
        year: item.applicationDate ? item.applicationDate.substring(0, 4) : "2026", 
        fieldNo: item.fieldNo,
        typeOfTea: item.teaType, 
        cropStatus: item.cropStatus,
        fertilizerName: item.fertilizerName,
        nutrientRatio: item.nutrientRatio,
        quantityPerHa: item.quantityPerHa,
        totalQuantity: item.totalQuantityUsed, 
        applicationMethod: item.applicationMethod,
        condition: item.weatherSoilCondition, 
        supervisor: item.supervisorName 
      }));

      setAllData(mappedData);

      const years = [...new Set(mappedData.map(item => item.year))].filter(Boolean).sort((a, b) => b - a);
      setAvailableYears(years);
      
      if (years.length > 0) {
        setSelectedYear(years[0].toString());
      } else {
        const currentYear = new Date().getFullYear().toString();
        setAvailableYears([currentYear]);
        setSelectedYear(currentYear);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      const sampleData = [
        { id: 1, date: "2026-03-01", year: "2026", fieldNo: "1", typeOfTea: "Clonal", cropStatus: "Mature", fertilizerName: "T-65", nutrientRatio: "25:5:15", quantityPerHa: 150, totalQuantity: 450, applicationMethod: "Broadcasting", condition: "Moist", supervisor: "Kumara Mallwathantri" }
      ];
      setAllData(sampleData);
      setAvailableYears(["2026"]);
      setSelectedYear("2026");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setOpenMenuId(null); 
  }, [selectedYear]);

  // --- FILTER BY YEAR & PAGINATE ---
  const yearData = allData.filter(item => item.year && item.year.toString() === selectedYear.toString());
  const totalPages = Math.ceil(yearData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = yearData.slice(startIndex, startIndex + rowsPerPage);

  // Placeholders for final commit
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
              {availableYears.length === 0 && <option>No data</option>}
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
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
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan="12" style={{textAlign: "center", padding: "30px", color: "#666"}}>
                    No records found for {selectedYear}. Please add data to your database.
                  </td>
                </tr>
              ) : (
                currentRows.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="new-fert-date-cell">{item.date}</td>
                    <td className="new-fert-id-cell">{item.fieldNo}</td>
                    <td>{item.typeOfTea}</td>
                    <td><span className={`new-fert-status-badge ${item.cropStatus.toLowerCase()}`}>{item.cropStatus}</span></td>
                    <td style={{fontWeight: '600', color: '#555'}}>{item.fertilizerName}</td>
                    <td>{item.nutrientRatio}</td>
                    <td>{item.quantityPerHa}</td>
                    <td><span className="new-fert-qty-badge">{item.totalQuantity} kg</span></td>
                    <td>{item.applicationMethod}</td>
                    <td>{item.condition}</td>
                    <td>{item.supervisor}</td>
                    
                    <td className="new-fert-action-cell" onMouseLeave={() => setOpenMenuId(null)}>
                      <button className="new-fert-action-dots-btn" onClick={() => toggleMenu(item.id)}>⋮</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <div className="new-fert-table-footer">
            <button className="new-fert-nav-btn" onClick={() => { setCurrentPage(p => p - 1); setOpenMenuId(null); }} disabled={currentPage === 1}>
              ← Previous 25
            </button>
            <div className="new-fert-page-label">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              <span style={{marginLeft: "10px", fontSize: "0.85rem", color: "#888"}}>
                (Total records: {yearData.length})
              </span>
            </div>
            <button className="new-fert-nav-btn" onClick={() => { setCurrentPage(p => p + 1); setOpenMenuId(null); }} disabled={currentPage === totalPages}>
              Next 25 →
            </button>
          </div>
        )}
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