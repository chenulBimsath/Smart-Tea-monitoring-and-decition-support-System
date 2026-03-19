import React, { useState, useEffect } from "react";
import "./AgronomicData.css"; 

export default function AgronomicData({ setPage }) {
  const API_BASE_URL = "http://13.233.134.204:8080/api/agronomic-data";

  // --- test 2STATE ---
  const [allData, setAllData] = useState([]); 
  
  // --- NEW: YEAR FILTERING STATE ---
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;
  const [openMenuId, setOpenMenuId] = useState(null);

  // --- POPUP & EDIT STATE ---
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null); 
  
  const [formData, setFormData] = useState({
    date: "", 
    fieldNo: "",
    cloneType: "",
    pruningYear: "",
    pluckingInterval: "",
    leafQuality: "",
    rainfall: "",
    soilPh: "",
    pestDisease: "",
    weedDensity: "",
    shadeTree: "",
    inspectedBy: ""
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

      // --- NEW: EXTRACT UNIQUE YEARS FROM DATES ---
      const years = [...new Set(mappedData.map(item => {
        if (!item.date) return null;
        return item.date.substring(0, 4); // Extract YYYY from YYYY-MM-DD
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

  // --- NEW: RESET PAGE WHEN YEAR CHANGES ---
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

  // --- ACTIONS ---
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete Record ID ${id}?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: "DELETE"
        });
        
        if (response.ok) {
          setAllData(prevData => prevData.filter(item => item.id !== id));
          setOpenMenuId(null); 
          
          // Re-calculate years just in case we deleted the last record of a year
          fetchAgronomicData(); 
        } else {
          alert("Failed to delete record.");
        }
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  const openAddPopup = () => {
    setEditingItemId(null); 
    setFormData({
      date: "",
      fieldNo: "", cloneType: "", pruningYear: "", pluckingInterval: "",
      leafQuality: "", rainfall: "", soilPh: "", pestDisease: "",
      weedDensity: "", shadeTree: "", inspectedBy: ""
    });
    setIsPopupOpen(true);
  };

  const handleUpdate = (item) => {
    setEditingItemId(item.id); 
    setFormData({
      date: item.date || "", 
      fieldNo: item.fieldNo, cloneType: item.cloneType, pruningYear: item.pruningYear,
      pluckingInterval: item.pluckingInterval, leafQuality: item.leafQuality, 
      rainfall: item.rainfall, soilPh: item.soilPh, pestDisease: item.pestDisease,
      weedDensity: item.weedDensity, shadeTree: item.shadeTree, inspectedBy: item.inspectedBy
    });
    setIsPopupOpen(true);
    setOpenMenuId(null);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      inspectionDate: formData.date 
    };
    
    try {
      if (editingItemId) {
        const response = await fetch(`${API_BASE_URL}/${editingItemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          alert("Data Updated Successfully!");
        } else {
          alert("Failed to update data.");
        }
      } else {
        const response = await fetch(API_BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          alert("Agronomic Data Added Successfully!");
        } else {
          alert("Failed to add data.");
        }
      }
      
      setIsPopupOpen(false);
      setEditingItemId(null);
      
      // Re-fetch data to automatically update the table and year dropdown logic
      fetchAgronomicData();
      
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Network error. Could not save data.");
    }
  };

  return (
    <div className="yield-page">
      <div className="yield-header">
        
        <div className="title-section">
          <h1>Rangala Agronomic Data</h1>
          <p>Tracking field conditions and crop health metrics for {selectedYear}</p>
        </div>

        <button className="add-record-btn" onClick={openAddPopup}>
          + Add New Data Record
        </button>

        <div className="header-controls">
          
          {/* --- NEW: YEAR DROPDOWN UI --- */}
          <div className="dropdown-container">
            <label htmlFor="year-select" style={{ marginRight: '10px', fontWeight: 'bold' }}>Select Year: </label>
            <select 
              id="year-select" 
              className="year-dropdown"
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

          <button className="back-to-grid-btn" onClick={() => setPage("rangaladata")}>
            ← Back to Overview
          </button>
        </div>
      </div>

      <div className="table-card shadow-lg">
        <div className="table-responsive">
          <table className="yield-table">
            <thead>
              <tr>
                <th>ID</th> 
                <th>Date</th> 
                <th>Field No</th>
                <th>Clone/Type</th>
                <th>Pruning Yr</th>
                <th>Plucking (Days)</th>
                <th>Quality (%)</th>
                <th>Rainfall (mm)</th>
                <th>Soil pH</th>
                <th>Pest/Disease</th>
                <th>Weeds</th>
                <th>Shade Status</th>
                <th>Inspector</th>
                <th className="action-header">Actions</th>
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
                    <td className="id-cell">{item.id}</td> 
                    <td className="date-cell">{item.date}</td> 
                    <td>{item.fieldNo}</td>
                    <td style={{fontWeight: '600', color: '#555'}}>{item.cloneType}</td>
                    <td>{item.pruningYear}</td>
                    <td><span className="yield-badge">{item.pluckingInterval}</span></td>
                    <td>{item.leafQuality}%</td>
                    <td>{item.rainfall}</td>
                    <td>{item.soilPh}</td>
                    <td>{item.pestDisease}</td>
                    <td>{item.weedDensity}</td>
                    <td>{item.shadeTree}</td>
                    <td style={{fontSize: '0.85rem'}}>{item.inspectedBy}</td>
                    
                    <td className="action-cell" onMouseLeave={() => setOpenMenuId(null)}>
                      <button className="action-dots-btn" onClick={() => toggleMenu(item.id)}>⋮</button>
                      {openMenuId === item.id && (
                        <div className="action-dropdown">
                          <button onClick={() => handleUpdate(item)}>✎ Update</button>
                          <button className="delete-btn" onClick={() => handleDelete(item.id)}>🗑 Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <div className="table-footer">
            <button className="nav-btn" onClick={() => { setCurrentPage(p => p - 1); setOpenMenuId(null); }} disabled={currentPage === 1}>
              ← Previous 25
            </button>
            <div className="year-label">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              <span style={{marginLeft: "10px", fontSize: "0.85rem", color: "#888"}}>
                {/* --- NEW: SHOW FILTERED LENGTH --- */}
                (Total records for {selectedYear}: {yearData.length})
              </span>
            </div>
            <button className="nav-btn" onClick={() => { setCurrentPage(p => p + 1); setOpenMenuId(null); }} disabled={currentPage === totalPages}>
              Next 25 →
            </button>
          </div>
        )}
      </div>

      {isPopupOpen && (
        <div className="modal-overlay">
          <div className="modal-content agronomic-modal">
            <div className="modal-header">
              <h2>{editingItemId ? "Edit Agronomic Data" : "Add Agronomic Data"}</h2>
              <button className="close-btn" onClick={() => setIsPopupOpen(false)}>✕</button>
            </div>

            <form className="add-form grid-form" onSubmit={handleSubmit}>
              
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleFormChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Field No</label>
                <input type="text" name="fieldNo" value={formData.fieldNo} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label>Tea Clone/Type</label>
                <input type="text" name="cloneType" value={formData.cloneType} onChange={handleFormChange} placeholder="e.g. Clonal, Seedling" required />
              </div>
              <div className="form-group">
                <label>Pruning Year</label>
                <input type="text" name="pruningYear" value={formData.pruningYear} onChange={handleFormChange} placeholder="e.g. 1st Year" required />
              </div>
              <div className="form-group">
                <label>Plucking Interval (Days)</label>
                <input type="number" name="pluckingInterval" value={formData.pluckingInterval} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label>Leaf Quality (%)</label>
                <input type="number" step="0.1" name="leafQuality" value={formData.leafQuality} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label>Rainfall (mm)</label>
                <input type="number" step="0.1" name="rainfall" value={formData.rainfall} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label>Soil pH Level</label>
                <input type="number" step="0.1" name="soilPh" value={formData.soilPh} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label>Pest/Disease Observed</label>
                <input type="text" name="pestDisease" value={formData.pestDisease} onChange={handleFormChange} placeholder="e.g. None, Mites" required />
              </div>
              <div className="form-group">
                <label>Weed Density</label>
                <input type="text" name="weedDensity" value={formData.weedDensity} onChange={handleFormChange} placeholder="e.g. 5%" required />
              </div>
              <div className="form-group">
                <label>Shade Tree Status</label>
                <input type="text" name="shadeTree" value={formData.shadeTree} onChange={handleFormChange} placeholder="e.g. Good, Needs lopping" required />
              </div>
              <div className="form-group full-width">
                <label>Inspected By</label>
                <input type="text" name="inspectedBy" value={formData.inspectedBy} onChange={handleFormChange} required />
              </div>

              <button type="submit" className="submit-btn full-width">
                {editingItemId ? "Save Changes" : "Save Field Data"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}