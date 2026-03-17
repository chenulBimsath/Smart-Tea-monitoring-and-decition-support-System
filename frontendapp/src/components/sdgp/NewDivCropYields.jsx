import React, { useState, useEffect } from "react";
import "./NewDivCropYields.css"; 

export default function NewDivCropYields({ setPage }) {
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
    division_number: "",
    year: "2026", 
    month: "", 
    green_leaf: "",
    pluckers: "",
    rate: "" 
  });

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // --- FETCH DATA FROM SPRING BOOT ---
  useEffect(() => {
    fetchCropData();
  }, []);

  const fetchCropData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/crop-details");
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      setAllData(data);

      const years = [...new Set(data.map(item => item.year))].sort((a, b) => b - a);
      setAvailableYears(years);
      
      if (years.length > 0) {
        setSelectedYear(years[0].toString());
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setOpenMenuId(null); 
  }, [selectedYear]);

  // --- FILTER & PAGINATE ---
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

  // --- POPUP OPENERS ---
  const openAddPopup = () => {
    setEditingItemId(null); 
    setFormData({
      division_number: "",
      year: "2026", 
      month: "",
      green_leaf: "",
      pluckers: "",
      rate: "" 
    });
    setIsPopupOpen(true);
  };

  const handleUpdate = (item) => {
    setEditingItemId(item.cropId); 
    setFormData({
      division_number: item.divisionId, 
      year: item.year || "2026",
      month: item.month,
      green_leaf: item.greenLeafKg,
      pluckers: item.pluckers,
      rate: item.cashKilo
    });
    setIsPopupOpen(true);
    setOpenMenuId(null);
  };

  // --- FORM HANDLERS ---
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const numericDivisionId = parseInt(formData.division_number.toString().replace(/\D/g, ''), 10);

    const payload = {
      divisionId: numericDivisionId,
      year: parseInt(formData.year, 10),
      month: formData.month,
      greenLeafKg: parseFloat(formData.green_leaf),
      pluckers: parseInt(formData.pluckers, 10),
      cashKilo: parseFloat(formData.rate),
      withoutCashAvg: 0 
    };

    try {
      const url = editingItemId 
        ? `http://localhost:8080/api/crop-details/${editingItemId}`
        : "http://localhost:8080/api/crop-details";
        
      const method = editingItemId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save data. Please check if the Division ID exists.");
      }

      alert(editingItemId ? "Data Updated Successfully!" : "Field Data Added Successfully!");
      
      setIsPopupOpen(false);
      setEditingItemId(null);
      fetchCropData(); 

    } catch (error) {
      console.error("Error saving data:", error);
      alert(error.message);
    }
  };

  return (
    <div className="new-yield-page">
      <div className="new-yield-header">
        
        {/* LEFT: Title */}
        <div className="new-title-section">
          <h1>New Division Yield Analytics</h1>
          <p>Analyzing harvest performance for the year {selectedYear}</p>
        </div>

        {/* CENTER: Add Button */}
        <button 
          className="new-add-record-btn" 
          onClick={openAddPopup}
        >
          + Add New Data Record
        </button>

        {/* RIGHT: Controls */}
        <div className="new-header-controls">
          <div className="new-dropdown-container">
            <label htmlFor="year-select">Select Harvest Year: </label>
            <select 
              id="year-select" 
              className="new-year-dropdown"
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

          {/* Changed this to go back to "newdivisiondata" instead of "rangaladata" */}
          <button className="new-back-to-grid-btn" onClick={() => setPage("newdivisiondata")}>
            ← Back to Overview
          </button>
        </div>
      </div>

      <div className="new-table-card shadow-lg">
        <table className="new-yield-table">
          <thead>
            <tr>
              <th>Batch ID</th>
              <th>Division ID</th>
              <th>Harvest Month</th>
              <th>Green Leaf Yield</th>
              <th>Plucker Count</th>
              <th>Rate (LKR/kg)</th>
              <th className="new-action-header">Actions</th>
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
                  <td className="new-id-cell">{item.cropId}</td>
                  <td style={{fontWeight: '600', color: '#555'}}>{item.divisionId}</td>
                  <td className="new-month-cell">{item.month}</td>
                  <td><span className="new-yield-badge">{item.greenLeafKg} kg</span></td>
                  <td>{item.pluckers} Workers</td>
                  <td className="new-currency-cell">රු. {item.cashKilo}</td>
                  
                  <td className="new-action-cell" onMouseLeave={() => setOpenMenuId(null)}>
                    <button className="new-action-dots-btn" onClick={() => toggleMenu(item.cropId)}>
                      ⋮
                    </button>

                    {openMenuId === item.cropId && (
                      <div className="new-action-dropdown">
                        <button onClick={() => handleUpdate(item)}>✎ Update</button>
                        <button className="new-delete-btn" onClick={() => handleDelete(item.cropId)}>🗑 Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 0 && (
          <div className="new-table-footer">
            <button className="new-nav-btn" onClick={() => { setCurrentPage(p => p - 1); setOpenMenuId(null); }} disabled={currentPage === 1}>
              ← Previous 25
            </button>
            <div className="new-year-label">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              <span style={{marginLeft: "10px", fontSize: "0.85rem", color: "#888"}}>
                (Total records: {yearData.length})
              </span>
            </div>
            <button className="new-nav-btn" onClick={() => { setCurrentPage(p => p + 1); setOpenMenuId(null); }} disabled={currentPage === totalPages}>
              Next 25 →
            </button>
          </div>
        )}
      </div>

      {/* --- POPUP MODAL --- */}
      {isPopupOpen && (
        <div className="new-modal-overlay">
          <div className="new-modal-content">
            <div className="new-modal-header">
              <h2>{editingItemId ? "Edit Field Data" : "Add Field Data"}</h2>
              <button className="new-close-btn" onClick={() => setIsPopupOpen(false)}>
                ✕
              </button>
            </div>

            <form className="new-add-form" onSubmit={handleSubmit}>
              <div className="new-form-group">
                <label>Division Number</label>
                <input 
                  type="text" 
                  name="division_number" 
                  value={formData.division_number} 
                  onChange={handleFormChange} 
                  placeholder="Enter Division Number (e.g., DIV-02)" 
                  required 
                />
              </div>

              <div className="new-form-group">
                <label>Year</label>
                <input 
                  type="number" 
                  name="year" 
                  value={formData.year} 
                  readOnly 
                  className="new-readonly-input"
                />
              </div>

              <div className="new-form-group">
                <label>Month</label>
                <select 
                  name="month" 
                  value={formData.month} 
                  onChange={handleFormChange} 
                  required
                  className="new-month-select"
                >
                  <option value="" disabled>Select a Month</option>
                  {months.map((m, index) => (
                    <option key={index} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="new-form-group">
                <label>Green Leaf (kg)</label>
                <input 
                  type="number" 
                  name="green_leaf" 
                  value={formData.green_leaf} 
                  onChange={handleFormChange} 
                  placeholder="Enter Green Leaf Amount" 
                  required 
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="new-form-group">
                <label>Number of Pluckers</label>
                <input 
                  type="number" 
                  name="pluckers" 
                  value={formData.pluckers} 
                  onChange={handleFormChange} 
                  placeholder="Enter Pluckers Count" 
                  required 
                  min="0"
                />
              </div>

              <div className="new-form-group">
                <label>Rate (LKR/kg)</label>
                <input 
                  type="number" 
                  name="rate" 
                  value={formData.rate} 
                  onChange={handleFormChange} 
                  placeholder="Enter Rate per kg" 
                  required 
                  min="0"
                  step="0.01"
                />
              </div>

              <button type="submit" className="new-submit-btn">
                {editingItemId ? "Save Changes" : "Save Field Data"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}