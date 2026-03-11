import React, { useState, useEffect } from "react";
import "./FinanceAnalytics.css"; 

export default function FinanceAnalytics({ setPage }) {
  // --- STATE ---
  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 25;
  const [openMenuId, setOpenMenuId] = useState(null);

  // --- POPUP & EDIT STATE ---
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  
  const [formData, setFormData] = useState({
    transactionType: "Expense",
    category: "",
    description: "",
    quantity: "",
    unitPrice: "",
    totalAmount: "",
    paymentMethod: "Cash",
    voucherRef: "",
    authorizedBy: ""
  });

  // --- FETCH DATA FROM SPRING BOOT ---
  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/finance-details");
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      setAllData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAllData([
        { id: 1, transactionType: "Expense", category: "Labor - Plucking", description: "Plucking wages Field 1", quantity: 350, unitPrice: 40, totalAmount: 14000, paymentMethod: "Cash", voucherRef: "V-101", authorizedBy: "Kumara Mallwathantri" },
        { id: 2, transactionType: "Expense", category: "Labor - Plucking", description: "Plucking wages Field 2", quantity: 300, unitPrice: 40, totalAmount: 12000, paymentMethod: "Cash", voucherRef: "V-102", authorizedBy: "Kumara Mallwathantri" },
        { id: 3, transactionType: "Expense", category: "Labor - Sundry", description: "Weeding Field 3", quantity: 5, unitPrice: 1000, totalAmount: 5000, paymentMethod: "Cash", voucherRef: "V-103", authorizedBy: "Kumara Mallwathantri" },
        { id: 4, transactionType: "Expense", category: "Fertilizer", description: "T-65 Purchase", quantity: 150, unitPrice: 80, totalAmount: 12000, paymentMethod: "Bank Transfer", voucherRef: "V-104", authorizedBy: "Sadun Wijesighe" }
      ]);
    }
  };

  // --- FILTER & PAGINATE ---
  const totalPages = Math.ceil(allData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = allData.slice(startIndex, startIndex + rowsPerPage);

  // --- ACTIONS ---
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete Transaction ID ${id}?`)) {
      try {
        const response = await fetch(`http://localhost:8080/api/finance-details/${id}`, {
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
      transactionType: "Expense",
      category: "",
      description: "",
      quantity: "",
      unitPrice: "",
      totalAmount: "",
      paymentMethod: "Cash",
      voucherRef: "",
      authorizedBy: ""
    });
    setIsPopupOpen(true);
  };

  const handleUpdate = (item) => {
    setEditingItemId(item.id);
    setFormData({
      transactionType: item.transactionType,
      category: item.category,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalAmount: item.totalAmount,
      paymentMethod: item.paymentMethod,
      voucherRef: item.voucherRef,
      authorizedBy: item.authorizedBy
    });
    setIsPopupOpen(true);
    setOpenMenuId(null);
  };

  // --- FORM HANDLERS ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    // Auto-calculate Total Amount when Quantity or Unit Price changes
    if (name === "quantity" || name === "unitPrice") {
      const qty = parseFloat(newFormData.quantity) || 0;
      const price = parseFloat(newFormData.unitPrice) || 0;
      // Only auto-calculate if both have a value greater than 0
      if (qty > 0 || price > 0) {
        newFormData.totalAmount = (qty * price).toFixed(2);
      }
    }

    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Allow quantity and unitPrice to be 0 or null if the user is just entering a flat Total Amount
    const payload = {
      transactionType: formData.transactionType,
      category: formData.category,
      description: formData.description,
      quantity: parseFloat(formData.quantity) || 0,
      unitPrice: parseFloat(formData.unitPrice) || 0,
      totalAmount: parseFloat(formData.totalAmount),
      paymentMethod: formData.paymentMethod,
      voucherRef: formData.voucherRef,
      authorizedBy: formData.authorizedBy
    };

    try {
      const url = editingItemId 
        ? `http://localhost:8080/api/finance-details/${editingItemId}`
        : "http://localhost:8080/api/finance-details";
        
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
    <div className="finance-page">
      <div className="finance-header">
        <div className="title-section">
          <h1>Rangala Financial Analytics</h1>
          <p>Managing estate expenses and transactions</p>
        </div>

        <button className="add-record-btn" onClick={openAddPopup}>
          + Add New Transaction
        </button>

        <div className="header-controls">
          <button className="back-to-grid-btn" onClick={() => setPage("rangaladata")}>
            ← Back to Overview
          </button>
        </div>
      </div>

      <div className="table-card shadow-lg">
        <table className="finance-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type & Category</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Total Amount</th>
              <th>Payment Info</th>
              <th>Auth By</th>
              <th className="action-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan="9" style={{textAlign: "center", padding: "30px", color: "#666"}}>
                  No financial records found. Please add data.
                </td>
              </tr>
            ) : (
              currentRows.map((item) => (
                <tr key={item.id}>
                  <td className="id-cell">{item.id}</td>
                  <td>
                    <div style={{fontWeight: 'bold', color: item.transactionType === 'Expense' ? '#d32f2f' : '#2f7d5b'}}>
                      {item.transactionType}
                    </div>
                    <div style={{fontSize: '0.85rem', color: '#666'}}>{item.category}</div>
                  </td>
                  <td>{item.description}</td>
                  <td>{item.quantity === 0 ? '-' : item.quantity}</td>
                  <td>{item.unitPrice === 0 ? '-' : `රු. ${item.unitPrice}`}</td>
                  <td className="currency-cell">රු. {item.totalAmount}</td>
                  <td>
                    <div>{item.paymentMethod}</div>
                    <div style={{fontSize: '0.85rem', color: '#888'}}>Ref: {item.voucherRef}</div>
                  </td>
                  <td>{item.authorizedBy}</td>
                  
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

        {totalPages > 0 && (
          <div className="table-footer">
            <button className="nav-btn" onClick={() => { setCurrentPage(p => p - 1); setOpenMenuId(null); }} disabled={currentPage === 1}>
              ← Prev
            </button>
            <div className="year-label">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </div>
            <button className="nav-btn" onClick={() => { setCurrentPage(p => p + 1); setOpenMenuId(null); }} disabled={currentPage === totalPages}>
              Next →
            </button>
          </div>
        )}
      </div>

      {/* --- POPUP MODAL --- */}
      {isPopupOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingItemId ? "Edit Transaction" : "Add Transaction"}</h2>
              <button className="close-btn" onClick={() => setIsPopupOpen(false)}>✕</button>
            </div>

            <form className="add-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select name="transactionType" value={formData.transactionType} onChange={handleFormChange} required>
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input type="text" name="category" value={formData.category} onChange={handleFormChange} placeholder="e.g., Labor - Plucking" required />
                </div>
              </div>

              <div className="form-group">
                <label>Description / Details</label>
                <input type="text" name="description" value={formData.description} onChange={handleFormChange} placeholder="Enter details" required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantity</label>
                  <input type="number" name="quantity" value={formData.quantity} onChange={handleFormChange} placeholder="Optional" min="0" step="0.01" />
                </div>
                <div className="form-group">
                  <label>Unit Price / Rate</label>
                  <input type="number" name="unitPrice" value={formData.unitPrice} onChange={handleFormChange} placeholder="Optional" min="0" step="0.01" />
                </div>
              </div>

              <div className="form-group">
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

              <div className="form-row">
                <div className="form-group">
                  <label>Payment Method</label>
                  <select name="paymentMethod" value={formData.paymentMethod} onChange={handleFormChange} required>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Voucher / Invoice Ref</label>
                  <input type="text" name="voucherRef" value={formData.voucherRef} onChange={handleFormChange} placeholder="e.g., V-101" required />
                </div>
              </div>

              <div className="form-group">
                <label>Authorized By</label>
                <input type="text" name="authorizedBy" value={formData.authorizedBy} onChange={handleFormChange} placeholder="Name" required />
              </div>

              <button type="submit" className="submit-btn">
                {editingItemId ? "Save Changes" : "Save Transaction"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}