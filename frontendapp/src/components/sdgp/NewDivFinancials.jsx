import React, { useState, useEffect } from "react";
import "./NewDivFinancials.css"; 

export default function NewDivFinancials({ setPage }) {
  const API = import.meta.env.VITE_API_BASE || "http://localhost:8080";
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
    transactionDate: "", 
    transactionType: "Expense",
    category: "",
    descriptionDetails: "",
    quantity: "",
    unitPriceRate: "",
    totalAmount: "",
    paymentMethod: "Cash",
    voucherInvoiceRef: "",
    authorizedBy: ""
  });

  // --- HELPER FUNCTION: Get Today's Date ---
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; 
  };

  // --- FETCH DATA FROM SPRING BOOT ---
  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
const response = await fetch(`${API}/api/financial-data`);
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      setAllData(data);

      const years = [...new Set(data.map(item => item.transactionDate ? item.transactionDate.substring(0, 4) : null))]
        .filter(Boolean)
        .sort((a, b) => b - a);
        
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
        { id: 1, transactionDate: "2024-03-01", transactionType: "Expense", category: "Labor - Plucking", descriptionDetails: "Plucking wages Field 1", quantity: 350, unitPriceRate: 40, totalAmount: 14000, paymentMethod: "Cash", voucherInvoiceRef: "V-101", authorizedBy: "Kumara Mallwathantri" },
      ];
      setAllData(sampleData);
      setAvailableYears(["2024"]);
      setSelectedYear("2024");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setOpenMenuId(null); 
  }, [selectedYear]);

  // --- FILTER BY YEAR & PAGINATE ---
  const yearData = allData.filter(item => item.transactionDate && item.transactionDate.startsWith(selectedYear));
  const totalPages = Math.ceil(yearData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = yearData.slice(startIndex, startIndex + rowsPerPage);

  // --- ACTIONS ---
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete Transaction ID ${id}?`)) {
      try {
        const response = await fetch(`http://13.233.134.204:8080/api/financial-data/${id}`, {
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
      transactionDate: getTodayDate(),
      transactionType: "Expense",
      category: "",
      descriptionDetails: "",
      quantity: "",
      unitPriceRate: "",
      totalAmount: "",
      paymentMethod: "Cash",
      voucherInvoiceRef: "",
      authorizedBy: ""
    });
    setIsPopupOpen(true);
  };
  //ss

  const handleUpdate = (item) => {
    setEditingItemId(item.id);
    setFormData({
      transactionDate: item.transactionDate || getTodayDate(),
      transactionType: item.transactionType,
      category: item.category,
      descriptionDetails: item.descriptionDetails,
      quantity: item.quantity,
      unitPriceRate: item.unitPriceRate,
      totalAmount: item.totalAmount,
      paymentMethod: item.paymentMethod,
      voucherInvoiceRef: item.voucherInvoiceRef,
      authorizedBy: item.authorizedBy
    });
    setIsPopupOpen(true);
    setOpenMenuId(null);
  };

  // --- FORM HANDLERS ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    if (name === "quantity" || name === "unitPriceRate") {
      const qty = parseFloat(newFormData.quantity) || 0;
      const price = parseFloat(newFormData.unitPriceRate) || 0;
      if (qty > 0 || price > 0) {
        newFormData.totalAmount = (qty * price).toFixed(2);
      }
    }

    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      transactionDate: formData.transactionDate,
      transactionType: formData.transactionType,
      category: formData.category,
      descriptionDetails: formData.descriptionDetails,
      quantity: parseFloat(formData.quantity) || 0,
      unitPriceRate: parseFloat(formData.unitPriceRate) || 0,
      totalAmount: parseFloat(formData.totalAmount),
      paymentMethod: formData.paymentMethod,
      voucherInvoiceRef: formData.voucherInvoiceRef,
      authorizedBy: formData.authorizedBy
    };

    try {
const url = editingItemId
  ? `${API}/api/financial-data/${editingItemId}`
  : `${API}/api/financial-data`;
        
      const method = editingItemId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save finance data.");

      alert(editingItemId ? "Transaction Updated!" : "Transaction Added!");
      setIsPopupOpen(false);
      setEditingItemId(null);
      fetchFinanceData(); 

    } catch (error) {
      console.error("Error saving data:", error);
      alert(error.message);
    }
  };

  return (
    <div className="new-fin-page">
      <div className="new-fin-header">
        
        {/* LEFT: Title */}
        <div className="new-fin-title-section">
          <h1>New Division Financial Analytics</h1>
          <p>Managing estate expenses and transactions for {selectedYear}</p>
        </div>

        {/* CENTER: Add Button */}
        <button className="new-fin-add-btn" onClick={openAddPopup}>
          + Add New Transaction
        </button>

        {/* RIGHT: Controls & Dropdown */}
        <div className="new-fin-controls">
          <div className="new-fin-dropdown-container">
            <label htmlFor="year-select">Select Year: </label>
            <select 
              id="year-select" 
              className="new-fin-year-dropdown"
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

          <button className="new-fin-back-btn" onClick={() => setPage("newdivisiondata")}>
            ← Back to Overview
          </button>
        </div>
      </div>

      <div className="new-fin-table-card shadow-lg">
        <table className="new-fin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Type & Category</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Total Amount</th>
              <th>Payment Info</th>
              <th>Auth By</th>
              <th className="new-fin-action-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan="10" style={{textAlign: "center", padding: "30px", color: "#666"}}>
                  No financial records found for {selectedYear}. Please add data.
                </td>
              </tr>
            ) : (
              currentRows.map((item) => (
                <tr key={item.id}>
                  <td className="new-fin-id-cell">{item.id}</td>
                  <td>{item.transactionDate}</td>
                  <td>
                    <div style={{fontWeight: 'bold', color: item.transactionType === 'Expense' ? '#d32f2f' : '#2f7d5b'}}>
                      {item.transactionType}
                    </div>
                    <div style={{fontSize: '0.85rem', color: '#666'}}>{item.category}</div>
                  </td>
                  <td>{item.descriptionDetails}</td>
                  <td>{item.quantity === 0 ? '-' : item.quantity}</td>
                  <td>{item.unitPriceRate === 0 ? '-' : `රු. ${item.unitPriceRate}`}</td>
                  <td className="new-fin-currency-cell">රු. {item.totalAmount}</td>
                  <td>
                    <div>{item.paymentMethod}</div>
                    <div style={{fontSize: '0.85rem', color: '#888'}}>Ref: {item.voucherInvoiceRef}</div>
                  </td>
                  <td>{item.authorizedBy}</td>
                  
                  <td className="new-fin-action-cell" onMouseLeave={() => setOpenMenuId(null)}>
                    <button className="new-fin-action-dots-btn" onClick={() => toggleMenu(item.id)}>⋮</button>
                    {openMenuId === item.id && (
                      <div className="new-fin-action-dropdown">
                        <button onClick={() => handleUpdate(item)}>✎ Update</button>
                        <button className="new-fin-delete-btn" onClick={() => handleDelete(item.id)}>🗑 Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 0 && (
          <div className="new-fin-footer">
            <button className="new-fin-nav-btn" onClick={() => { setCurrentPage(p => p - 1); setOpenMenuId(null); }} disabled={currentPage === 1}>
              ← Prev
            </button>
            <div className="new-fin-year-label">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              <span style={{marginLeft: "10px", fontSize: "0.85rem", color: "#888"}}>
                (Total records: {yearData.length})
              </span>
            </div>
            <button className="new-fin-nav-btn" onClick={() => { setCurrentPage(p => p + 1); setOpenMenuId(null); }} disabled={currentPage === totalPages}>
              Next →
            </button>
          </div>
        )}
      </div>

      {/* --- POPUP MODAL --- */}
      {isPopupOpen && (
        <div className="new-fin-modal-overlay">
          <div className="new-fin-modal-content">
            <div className="new-fin-modal-header">
              <h2>{editingItemId ? "Edit Transaction" : "Add Transaction"}</h2>
              <button className="new-fin-close-btn" onClick={() => setIsPopupOpen(false)}>✕</button>
            </div>

            <form className="new-fin-add-form" onSubmit={handleSubmit}>
              <div className="new-fin-form-row">
                <div className="new-fin-form-group">
                  <label>Date</label>
                  <input type="date" name="transactionDate" value={formData.transactionDate} onChange={handleFormChange} required />
                </div>
                <div className="new-fin-form-group">
                  <label>Type</label>
                  <select name="transactionType" value={formData.transactionType} onChange={handleFormChange} required>
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
              </div>

              <div className="new-fin-form-row">
                <div className="new-fin-form-group" style={{ flex: 2 }}>
                  <label>Category</label>
                  <input type="text" name="category" value={formData.category} onChange={handleFormChange} placeholder="e.g., Labor - Plucking" required />
                </div>
              </div>

              <div className="new-fin-form-group">
                <label>Description / Details</label>
                <input type="text" name="descriptionDetails" value={formData.descriptionDetails} onChange={handleFormChange} placeholder="Enter details" required />
              </div>

              <div className="new-fin-form-row">
                <div className="new-fin-form-group">
                  <label>Quantity</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleFormChange} placeholder="Optional" min="0" step="0.01" />
                </div>
                <div className="new-fin-form-group">
                  <label>Unit Price / Rate</label>
                  <input type="number" name="unitPriceRate" value={formData.unitPriceRate} onChange={handleFormChange} placeholder="Optional" min="0" step="0.01" />
                </div>
              </div>

              <div className="new-fin-form-group">
                <label>Total Amount (LKR)</label>
                <input 
                  type="number" 
                  name="totalAmount" 
                  value={formData.totalAmount} 
                  onChange={handleFormChange} 
                  required 
                  min="0" 
                  step="0.01" 
                  placeholder="Enter total amount"
                />
              </div>

              <div className="new-fin-form-row">
                <div className="new-fin-form-group">
                  <label>Payment Method</label>
                  <select name="paymentMethod" value={formData.paymentMethod} onChange={handleFormChange} required>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
                <div className="new-fin-form-group">
                  <label>Voucher / Invoice Ref</label>
                  <input type="text" name="voucherInvoiceRef" value={formData.voucherInvoiceRef} onChange={handleFormChange} placeholder="e.g., V-101" required />
                </div>
              </div>

              <div className="new-fin-form-group">
                <label>Authorized By</label>
                <input type="text" name="authorizedBy" value={formData.authorizedBy} onChange={handleFormChange} placeholder="Name" required />
              </div>

              <button type="submit" className="new-fin-submit-btn">
                {editingItemId ? "Save Changes" : "Save Transaction"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}