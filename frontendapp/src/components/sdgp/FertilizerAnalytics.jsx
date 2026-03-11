import React, { useState, useEffect } from "react";
import "./FertilizerAnalytics.css"; 

export default function FertilizerAnalytics({ setPage }) {
  // --- STATE ---
  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;
  const [openMenuId, setOpenMenuId] = useState(null);

  // --- POPUP & EDIT STATE ---
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null); 
  
  const [formData, setFormData] = useState({
    fieldNo: "",
    typeOfTea: "Clonal",
    cropStatus: "Mature",
    fertilizerName: "",
    nutrientRatio: "",
    quantityPerHa: "",
    totalQuantity: "",
    applicationMethod: "Broadcasting",
    condition: "Moist",
    supervisor: ""
  });

  // Dropdown options based on your sample data
  const teaTypes = ["Clonal", "Seedling"];
  const cropStatuses = ["Mature", "Immature", "Pruned"];
  const applicationMethods = ["Broadcasting", "Ring Placement", "Foliar Spray"];
  const weatherConditions = ["Moist", "Sunny", "Rain", "Dry"];

  // --- FETCH DATA FROM SPRING BOOT ---
  // Note: Update the URL to match your backend endpoint for fertilizer
  useEffect(() => {
    fetchFertilizerData();
  }, []);

  const fetchFertilizerData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/fertilizer-details");
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      setAllData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Fallback sample data for testing purposes if backend is down
      
      setAllData([
        { id: 1, fieldNo: "1", typeOfTea: "Clonal", cropStatus: "Mature", fertilizerName: "T-65", nutrientRatio: "25:5:15", quantityPerHa: 150, totalQuantity: 450, applicationMethod: "Broadcasting", condition: "Moist", supervisor: "Kumara Mallwathantri" },
        { id: 2, fieldNo: "2", typeOfTea: "Seedling", cropStatus: "Immature", fertilizerName: "T-200", nutrientRatio: "15:15:15", quantityPerHa: 100, totalQuantity: 200, applicationMethod: "Ring Placement", condition: "Sunny", supervisor: "Kumara Mallwathantri" }
      ]);
      
    }
  };

  // --- PAGINATE ---
  const totalPages = Math.ceil(allData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = allData.slice(startIndex, startIndex + rowsPerPage);

  // --- ACTIONS ---
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete Record ID ${id}?`)) {
      try {
        const response = await fetch(`http://localhost:8080/api/fertilizer-details/${id}`, {
          method: "DELETE"
        });

        if (response.ok) {
          setAllData(prevData => prevData.filter(item => item.id !== id));
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
      fieldNo: "",
      typeOfTea: "Clonal",
      cropStatus: "Mature",
      fertilizerName: "",
      nutrientRatio: "",
      quantityPerHa: "",
      totalQuantity: "",
      applicationMethod: "Broadcasting",
      condition: "Moist",
      supervisor: ""
    });
    setIsPopupOpen(true);
  };

  const handleUpdate = (item) => {
    setEditingItemId(item.id); 
    setFormData({
      fieldNo: item.fieldNo,
      typeOfTea: item.typeOfTea,
      cropStatus: item.cropStatus,
      fertilizerName: item.fertilizerName,
      nutrientRatio: item.nutrientRatio,
      quantityPerHa: item.quantityPerHa,
      totalQuantity: item.totalQuantity,
      applicationMethod: item.applicationMethod,
      condition: item.condition,
      supervisor: item.supervisor
    });
    setIsPopupOpen(true);
    setOpenMenuId(null);
  };

  // --- FORM HANDLERS ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    // Auto-calculate Total Quantity if Quantity Per Ha changes (Optional logic, adjust if you have a Ha field)
    // If you want to automatically calculate this, you'd need the field size in Hectares. 
    // For now, it just updates normally.
    
    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      fieldNo: formData.fieldNo,
      typeOfTea: formData.typeOfTea,
      cropStatus: formData.cropStatus,
      fertilizerName: formData.fertilizerName,
      nutrientRatio: formData.nutrientRatio,
      quantityPerHa: parseFloat(formData.quantityPerHa),
      totalQuantity: parseFloat(formData.totalQuantity),
      applicationMethod: formData.applicationMethod,
      condition: formData.condition,
      supervisor: formData.supervisor
    };

    try {
      const url = editingItemId 
        ? `http://localhost:8080/api/fertilizer-details/${editingItemId}`
        : "http://localhost:8080/api/fertilizer-details";
        
      const method = editingItemId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save data.");
      }

      alert(editingItemId ? "Data Updated Successfully!" : "Fertilizer Record Added Successfully!");
      
      setIsPopupOpen(false);
      setEditingItemId(null);
      fetchFertilizerData(); 

    } catch (error) {
      console.error("Error saving data:", error);
      alert(error.message);
    }
  };

  return (
    <div className="fertilizer-page">
      <div className="fertilizer-header">
        
        {/* LEFT: Title */}
        <div className="title-section">
          <h1>Rangala Fertilizer Analytics</h1>
          <p>Tracking nutrient applications and soil conditions</p>
        </div>

        {/* CENTER: Add Button */}
        <button 
          className="add-record-btn" 
          onClick={openAddPopup}
        >
          + Add Fertilizer Record
        </button>

        {/* RIGHT: Controls */}
        <div className="header-controls">
          <button className="back-to-grid-btn" onClick={() => setPage("rangaladata")}>
            ← Back to Overview
          </button>
        </div>
      </div>

      <div className="table-card shadow-lg">
        <div className="table-responsive">
          <table className="fertilizer-table">
            <thead>
              <tr>
                <th>Field No</th>
                <th>Tea Type</th>
                <th>Status</th>
                <th>Fertilizer</th>
                <th>N:P:K Ratio</th>
                <th>Qty/Ha (kg)</th>
                <th>Total Qty (kg)</th>
                <th>Method</th>
                <th>Condition</th>
                <th>Supervisor</th>
                <th className="action-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{textAlign: "center", padding: "30px", color: "#666"}}>
                    No records found. Please add data to your database.
                  </td>
                </tr>
              ) : (
                currentRows.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="id-cell">{item.fieldNo}</td>
                    <td>{item.typeOfTea}</td>
                    <td><span className={`status-badge ${item.cropStatus.toLowerCase()}`}>{item.cropStatus}</span></td>
                    <td style={{fontWeight: '600', color: '#555'}}>{item.fertilizerName}</td>
                    <td>{item.nutrientRatio}</td>
                    <td>{item.quantityPerHa}</td>
                    <td><span className="qty-badge">{item.totalQuantity} kg</span></td>
                    <td>{item.applicationMethod}</td>
                    <td>{item.condition}</td>
                    <td>{item.supervisor}</td>
                    
                    <td className="action-cell" onMouseLeave={() => setOpenMenuId(null)}>
                      <button className="action-dots-btn" onClick={() => toggleMenu(item.id)}>
                        ⋮
                      </button>

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
            <div className="page-label">
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
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h2>{editingItemId ? "Edit Fertilizer Data" : "Add Fertilizer Data"}</h2>
              <button className="close-btn" onClick={() => setIsPopupOpen(false)}>✕</button>
            </div>

            <form className="add-form grid-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Field No</label>
                <input type="text" name="fieldNo" value={formData.fieldNo} onChange={handleFormChange} placeholder="e.g., 1" required />
              </div>

              <div className="form-group">
                <label>Type of Tea</label>
                <select name="typeOfTea" value={formData.typeOfTea} onChange={handleFormChange}>
                  {teaTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Crop Status</label>
                <select name="cropStatus" value={formData.cropStatus} onChange={handleFormChange}>
                  {cropStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Fertilizer Name</label>
                <input type="text" name="fertilizerName" value={formData.fertilizerName} onChange={handleFormChange} placeholder="e.g., T-65" required />
              </div>

              <div className="form-group">
                <label>Nutrient Ratio (N:P:K)</label>
                <input type="text" name="nutrientRatio" value={formData.nutrientRatio} onChange={handleFormChange} placeholder="e.g., 25:5:15" required />
              </div>

              <div className="form-group">
                <label>Supervisor Name</label>
                <input type="text" name="supervisor" value={formData.supervisor} onChange={handleFormChange} placeholder="Supervisor Name" required />
              </div>

              <div className="form-group">
                <label>Quantity per Ha (kg)</label>
                <input type="number" name="quantityPerHa" value={formData.quantityPerHa} onChange={handleFormChange} placeholder="150" required min="0" step="0.01" />
              </div>

              <div className="form-group">
                <label>Total Quantity Used (kg)</label>
                <input type="number" name="totalQuantity" value={formData.totalQuantity} onChange={handleFormChange} placeholder="450" required min="0" step="0.01" />
              </div>

              <div className="form-group">
                <label>Application Method</label>
                <select name="applicationMethod" value={formData.applicationMethod} onChange={handleFormChange}>
                  {applicationMethods.map(method => <option key={method} value={method}>{method}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Weather/Soil Condition</label>
                <select name="condition" value={formData.condition} onChange={handleFormChange}>
                  {weatherConditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
                </select>
              </div>

              <button type="submit" className="submit-btn full-width">
                {editingItemId ? "Save Changes" : "Save Record"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}