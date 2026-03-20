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
    date: "", 
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
      const response = await fetch("http://13.233.134.204:8080/api/fertilizer-data");
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

  // --- ACTIONS ---
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete Record ID ${id}?`)) {
      try {
        const response = await fetch(`http://13.233.134.204:8080/api/fertilizer-data/${id}`, {
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
      date: "", 
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
      date: item.date || "", 
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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      applicationDate: formData.date,
      fieldNo: parseInt(formData.fieldNo, 10),
      teaType: formData.typeOfTea,
      cropStatus: formData.cropStatus,
      fertilizerName: formData.fertilizerName,
      nutrientRatio: formData.nutrientRatio,
      quantityPerHa: parseFloat(formData.quantityPerHa),
      totalQuantityUsed: parseFloat(formData.totalQuantity),
      applicationMethod: formData.applicationMethod,
      weatherSoilCondition: formData.condition,
      supervisorName: formData.supervisor
    };

    try {
      const url = editingItemId 
        ? `http://13.233.134.204:8080/api/fertilizer-data/${editingItemId}`
        : "http://13.233.134.204:8080/api/fertilizer-data";
        
      const method = editingItemId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save data. Please check your inputs.");
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
    <div className="new-fert-page">
      <div className="new-fert-header">
        
        <div className="new-fert-title-section">
          {/* Updated Title */}
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

          {/* Updated Back Button Target */}
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
                <th>Date</th>
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
                <th className="new-fert-action-header">Actions</th>
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
                      <button className="new-fert-action-dots-btn" onClick={() => toggleMenu(item.id)}>
                        ⋮
                      </button>

                      {openMenuId === item.id && (
                        <div className="new-fert-action-dropdown">
                          <button onClick={() => handleUpdate(item)}>✎ Update</button>
                          <button className="new-fert-delete-btn" onClick={() => handleDelete(item.id)}>🗑 Delete</button>
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
              <h2>{editingItemId ? "Edit Fertilizer Data" : "Add Fertilizer Data"}</h2>
              <button className="new-fert-close-btn" onClick={() => setIsPopupOpen(false)}>✕</button>
            </div>

            <form className="new-fert-add-form new-fert-grid-form" onSubmit={handleSubmit}>
              
              <div className="new-fert-form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleFormChange} 
                  required 
                />
              </div>

              <div className="new-fert-form-group">
                <label>Field No</label>
                <input type="number" name="fieldNo" value={formData.fieldNo} onChange={handleFormChange} placeholder="e.g., 1" required />
              </div>

              <div className="new-fert-form-group">
                <label>Type of Tea</label>
                <select name="typeOfTea" value={formData.typeOfTea} onChange={handleFormChange}>
                  {teaTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <div className="new-fert-form-group">
                <label>Crop Status</label>
                <select name="cropStatus" value={formData.cropStatus} onChange={handleFormChange}>
                  {cropStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>

              <div className="new-fert-form-group">
                <label>Fertilizer Name</label>
                <input type="text" name="fertilizerName" value={formData.fertilizerName} onChange={handleFormChange} placeholder="e.g., T-65" required />
              </div>

              <div className="new-fert-form-group">
                <label>Nutrient Ratio (N:P:K)</label>
                <input type="text" name="nutrientRatio" value={formData.nutrientRatio} onChange={handleFormChange} placeholder="e.g., 25:5:15" required />
              </div>

              <div className="new-fert-form-group">
                <label>Supervisor Name</label>
                <input type="text" name="supervisor" value={formData.supervisor} onChange={handleFormChange} placeholder="Supervisor Name" required />
              </div>

              <div className="new-fert-form-group">
                <label>Quantity per Ha (kg)</label>
                <input type="number" name="quantityPerHa" value={formData.quantityPerHa} onChange={handleFormChange} placeholder="150" required min="0" step="0.01" />
              </div>

              <div className="new-fert-form-group">
                <label>Total Quantity Used (kg)</label>
                <input type="number" name="totalQuantity" value={formData.totalQuantity} onChange={handleFormChange} placeholder="450" required min="0" step="0.01" />
              </div>

              <div className="new-fert-form-group">
                <label>Application Method</label>
                <select name="applicationMethod" value={formData.applicationMethod} onChange={handleFormChange}>
                  {applicationMethods.map(method => <option key={method} value={method}>{method}</option>)}
                </select>
              </div>

              <div className="new-fert-form-group">
                <label>Weather/Soil Condition</label>
                <select name="condition" value={formData.condition} onChange={handleFormChange}>
                  {weatherConditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
                </select>
              </div>

              <button type="submit" className="new-fert-submit-btn new-fert-full-width">
                {editingItemId ? "Save Changes" : "Save Record"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}