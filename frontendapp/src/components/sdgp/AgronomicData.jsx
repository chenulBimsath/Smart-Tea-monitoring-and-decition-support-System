import React, { useState, useEffect } from "react";
import "./AgronomicData.css"; // You can use a new CSS file or import your existing one

export default function AgronomicData({ setPage }) {
  // --- INITIAL SAMPLE DATA ---
  const initialData = [
    { id: 1, fieldNo: "1", cloneType: "Clonal", pruningYear: "1st Year", pluckingInterval: 7, leafQuality: 82, rainfall: 12.5, soilPh: 4.8, pestDisease: "None", weedDensity: "5%", shadeTree: "Good", inspectedBy: "Kumara Mallwathantri" },
    { id: 2, fieldNo: "2", cloneType: "Seedling", pruningYear: "3rd Year", pluckingInterval: 10, leafQuality: 68, rainfall: 12.5, soilPh: 5.1, pestDisease: "None", weedDensity: "12%", shadeTree: "Needs lopping", inspectedBy: "Kumara Mallwathantri" },
    { id: 3, fieldNo: "3", cloneType: "Clonal", pruningYear: "4th Year", pluckingInterval: 12, leafQuality: 65, rainfall: 12.5, soilPh: 4.9, pestDisease: "None", weedDensity: "15%", shadeTree: "Good", inspectedBy: "Kumara Mallwathantri" },
    { id: 4, fieldNo: "4", cloneType: "Seedling", pruningYear: "2nd Year", pluckingInterval: 8, leafQuality: 75, rainfall: 12.5, soilPh: 5.0, pestDisease: "Mites - Low", weedDensity: "8%", shadeTree: "Good", inspectedBy: "sadun wijesighe" },
    { id: 5, fieldNo: "Clonal", cloneType: "Clonal", pruningYear: "1st Year", pluckingInterval: 7, leafQuality: 80, rainfall: 12.5, soilPh: 4.7, pestDisease: "None", weedDensity: "6%", shadeTree: "Good", inspectedBy: "jeraj fonseka" }
  ];

  // --- STATE ---
  const [allData, setAllData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;
  const [openMenuId, setOpenMenuId] = useState(null);

  // --- POPUP & EDIT STATE ---
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null); 
  
  const [formData, setFormData] = useState({
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

  // --- PAGINATION ---
  const totalPages = Math.ceil(allData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = allData.slice(startIndex, startIndex + rowsPerPage);

  // --- ACTIONS ---
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete Field No ${id}?`)) {
      // NOTE: Add your fetch DELETE request here when backend is ready
      setAllData(prevData => prevData.filter(item => item.id !== id));
      setOpenMenuId(null); 
    }
  };

  // --- POPUP OPENERS ---
  const openAddPopup = () => {
    setEditingItemId(null); 
    setFormData({
      fieldNo: "", cloneType: "", pruningYear: "", pluckingInterval: "",
      leafQuality: "", rainfall: "", soilPh: "", pestDisease: "",
      weedDensity: "", shadeTree: "", inspectedBy: ""
    });
    setIsPopupOpen(true);
  };

  const handleUpdate = (item) => {
    setEditingItemId(item.id); 
    setFormData({
      fieldNo: item.fieldNo, cloneType: item.cloneType, pruningYear: item.pruningYear,
      pluckingInterval: item.pluckingInterval, leafQuality: item.leafQuality, 
      rainfall: item.rainfall, soilPh: item.soilPh, pestDisease: item.pestDisease,
      weedDensity: item.weedDensity, shadeTree: item.shadeTree, inspectedBy: item.inspectedBy
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // NOTE: Replace this block with your POST/PUT fetch request later
    if (editingItemId) {
      setAllData(prev => prev.map(item => item.id === editingItemId ? { ...formData, id: editingItemId } : item));
      alert("Data Updated Successfully!");
    } else {
      const newItem = { ...formData, id: Date.now() }; // temporary ID generation
      setAllData(prev => [...prev, newItem]);
      alert("Agronomic Data Added Successfully!");
    }
    
    setIsPopupOpen(false);
    setEditingItemId(null);
  };

  return (
    <div className="yield-page">
      <div className="yield-header">
        
        {/* LEFT: Title */}
        <div className="title-section">
          <h1>Rangala Agronomic Data</h1>
          <p>Tracking field conditions and crop health metrics</p>
        </div>

        {/* CENTER: Add Button */}
        <button className="add-record-btn" onClick={openAddPopup}>
          + Add New Data Record
        </button>

        {/* RIGHT: Controls */}
        <div className="header-controls">
          <button className="back-to-grid-btn" onClick={() => setPage("rangaladata")}>
            ← Back to Overview
          </button>
        </div>
      </div>

      <div className="table-card shadow-lg">
        {/* Wrapped in a responsive container in case columns get too wide */}
        <div className="table-responsive">
          <table className="yield-table">
            <thead>
              <tr>
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
                  <td colSpan="12" style={{textAlign: "center", padding: "30px", color: "#666"}}>
                    No agronomic records found. Please add data.
                  </td>
                </tr>
              ) : (
                currentRows.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="id-cell">{item.fieldNo}</td>
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
                (Total records: {allData.length})
              </span>
            </div>
            <button className="nav-btn" onClick={() => { setCurrentPage(p => p + 1); setOpenMenuId(null); }} disabled={currentPage === totalPages}>
              Next 25 →
            </button>
          </div>
        )}
      </div>

      {/* --- POPUP MODAL --- */}
      {isPopupOpen && (
        <div className="modal-overlay">
          <div className="modal-content agronomic-modal">
            <div className="modal-header">
              <h2>{editingItemId ? "Edit Agronomic Data" : "Add Agronomic Data"}</h2>
              <button className="close-btn" onClick={() => setIsPopupOpen(false)}>✕</button>
            </div>

            <form className="add-form grid-form" onSubmit={handleSubmit}>
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
                <input type="number" name="leafQuality" value={formData.leafQuality} onChange={handleFormChange} required />
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