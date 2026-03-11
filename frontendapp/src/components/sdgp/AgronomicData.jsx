import React, { useState, useEffect } from "react";
import "./AgronomicData.css"; 

export default function AgronomicData({ setPage }) {
  // --- STATE ---
  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;
  const [openMenuId, setOpenMenuId] = useState(null);

  // --- POPUP & EDIT STATE ---
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null); 
  
  const [formData, setFormData] = useState({
    fieldNo: "",
    teaClone: "Clonal",
    pruningYear: "",
    pluckingInterval: "",
    leafQuality: "",
    rainfall: "",
    soilPh: "",
    pestObserved: "None",
    weedDensity: "",
    shadeStatus: "Good",
    inspectedBy: ""
  });

  // --- FETCH DATA ---
  useEffect(() => {
    fetchAgronomicData();
  }, []);

  const fetchAgronomicData = async () => {
    try {
      // Update this URL to your specific agronomic endpoint
      const response = await fetch("http://localhost:8080/api/agronomic-data");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setAllData(data);
    } catch (error) {
      console.error("Error fetching agronomic data:", error);
    }
  };

  // --- PAGINATION ---
  const totalPages = Math.ceil(allData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = allData.slice(startIndex, startIndex + rowsPerPage);

  // --- ACTIONS ---
  const toggleMenu = (id) => setOpenMenuId(openMenuId === id ? null : id);

  const handleDelete = async (id) => {
    if (window.confirm(`Delete record for Field ${id}?`)) {
      try {
        await fetch(`http://localhost:8080/api/agronomic-data/${id}`, { method: "DELETE" });
        setAllData(prev => prev.filter(item => item.id !== id));
      } catch (error) { console.error("Error deleting:", error); }
    }
  };

  const openAddPopup = () => {
    setEditingItemId(null);
    setFormData({
      fieldNo: "", teaClone: "Clonal", pruningYear: "", pluckingInterval: "",
      leafQuality: "", rainfall: "", soilPh: "", pestObserved: "None",
      weedDensity: "", shadeStatus: "Good", inspectedBy: ""
    });
    setIsPopupOpen(true);
  };

  const handleUpdate = (item) => {
    setEditingItemId(item.id);
    setFormData({ ...item });
    setIsPopupOpen(true);
    setOpenMenuId(null);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingItemId ? "PUT" : "POST";
    const url = editingItemId 
      ? `http://localhost:8080/api/agronomic-data/${editingItemId}` 
      : "http://localhost:8080/api/agronomic-data";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setIsPopupOpen(false);
        fetchAgronomicData();
      }
    } catch (error) { alert("Error saving data"); }
  };

  return (
    <div className="agro-page">
      <div className="agro-header">
        <div className="title-section">
          <h1>Field Agronomic Data</h1>
          <p>Monitoring soil health and crop conditions</p>
        </div>

        <button className="add-agro-btn" onClick={openAddPopup}>+ New Inspection</button>

        <button className="back-btn" onClick={() => setPage("rangaladata")}>
          ← Overview
        </button>
      </div>

      <div className="table-card">
        <div className="table-responsive">
          <table className="agro-table">
            <thead>
              <tr>
                <th>Field No</th>
                <th>Clone/Type</th>
                <th>Pruning</th>
                <th>Interval</th>
                <th>Leaf Qual.</th>
                <th>Rainfall</th>
                <th>pH</th>
                <th>Pests</th>
                <th>Weed</th>
                <th>Shade</th>
                <th>Inspector</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="field-cell">#{item.fieldNo}</td>
                  <td>{item.teaClone}</td>
                  <td>{item.pruningYear}</td>
                  <td>{item.pluckingInterval} days</td>
                  <td><span className="perc-tag">{item.leafQuality}%</span></td>
                  <td>{item.rainfall}mm</td>
                  <td><strong>{item.soilPh}</strong></td>
                  <td className={item.pestObserved !== "None" ? "alert-text" : ""}>{item.pestObserved}</td>
                  <td>{item.weedDensity}</td>
                  <td>{item.shadeStatus}</td>
                  <td className="inspector-cell">{item.inspectedBy}</td>
                  <td className="action-cell">
                    <button className="dots-btn" onClick={() => toggleMenu(item.id)}>⋮</button>
                    {openMenuId === item.id && (
                      <div className="agro-dropdown">
                        <button onClick={() => handleUpdate(item)}>Update</button>
                        <button className="del-btn" onClick={() => handleDelete(item.id)}>Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL POPUP */}
      {isPopupOpen && (
        <div className="agro-modal-overlay">
          <div className="agro-modal-content">
            <h2>{editingItemId ? "Edit Inspection" : "Add Inspection"}</h2>
            <form className="agro-grid-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="f-group">
                  <label>Field No</label>
                  <input name="fieldNo" value={formData.fieldNo} onChange={handleFormChange} required />
                </div>
                <div className="f-group">
                  <label>Tea Clone</label>
                  <select name="teaClone" value={formData.teaClone} onChange={handleFormChange}>
                    <option value="Clonal">Clonal</option>
                    <option value="Seedling">Seedling</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="f-group">
                  <label>Pruning Year</label>
                  <input name="pruningYear" placeholder="e.g. 1st Year" value={formData.pruningYear} onChange={handleFormChange} />
                </div>
                <div className="f-group">
                  <label>Interval (Days)</label>
                  <input type="number" name="pluckingInterval" value={formData.pluckingInterval} onChange={handleFormChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="f-group">
                  <label>Leaf Quality (%)</label>
                  <input type="number" name="leafQuality" value={formData.leafQuality} onChange={handleFormChange} />
                </div>
                <div className="f-group">
                  <label>Rainfall (mm)</label>
                  <input type="number" step="0.1" name="rainfall" value={formData.rainfall} onChange={handleFormChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="f-group">
                  <label>Soil pH</label>
                  <input type="number" step="0.1" name="soilPh" value={formData.soilPh} onChange={handleFormChange} />
                </div>
                <div className="f-group">
                  <label>Weed Density</label>
                  <input name="weedDensity" placeholder="e.g. 5%" value={formData.weedDensity} onChange={handleFormChange} />
                </div>
              </div>

              <div className="f-group">
                <label>Pests/Diseases</label>
                <input name="pestObserved" value={formData.pestObserved} onChange={handleFormChange} />
              </div>

              <div className="f-group">
                <label>Shade Status</label>
                <input name="shadeStatus" value={formData.shadeStatus} onChange={handleFormChange} />
              </div>

              <div className="f-group">
                <label>Inspected By</label>
                <input name="inspectedBy" value={formData.inspectedBy} onChange={handleFormChange} required />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setIsPopupOpen(false)}>Cancel</button>
                <button type="submit" className="save-btn">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}