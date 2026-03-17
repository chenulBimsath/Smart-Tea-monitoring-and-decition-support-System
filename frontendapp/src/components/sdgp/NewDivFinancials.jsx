import React, { useState, useEffect } from "react";
import "./NewDivFinancials.css"; 

export default function NewDivFinancials({ setPage }) {
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
    transactionDate: "", transactionType: "Expense", category: "",
    descriptionDetails: "", quantity: "", unitPriceRate: "",
    totalAmount: "", paymentMethod: "Cash", voucherInvoiceRef: "",
    authorizedBy: ""
  });

  // --- HELPER FUNCTION: Get Today's Date ---
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; 
  };

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
    <div className="new-fin-page">
      <div className="new-fin-header">
        <div className="new-fin-title-section">
          <h1>New Division Financial Analytics</h1>
          <p>Managing estate expenses and transactions for {selectedYear}</p>
        </div>

        <button className="new-fin-add-btn" onClick={openAddPopup}>
          + Add New Transaction
        </button>

        <div className="new-fin-controls">
          <div className="new-fin-dropdown-container">
            <label htmlFor="year-select">Select Year: </label>
            <select 
              id="year-select" 
              className="new-fin-year-dropdown"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option>No data</option>
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
              <th>ID</th><th>Date</th><th>Type & Category</th><th>Description</th>
              <th>Qty</th><th>Rate</th><th>Total Amount</th><th>Payment Info</th>
              <th>Auth By</th><th className="new-fin-action-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="10" style={{textAlign: "center", padding: "30px", color: "#666"}}>
                No financial records found for {selectedYear}. Please add data.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {isPopupOpen && (
        <div className="new-fin-modal-overlay">
          <div className="new-fin-modal-content">
            <div className="new-fin-modal-header">
              <h2>Add Transaction</h2>
              <button className="new-fin-close-btn" onClick={() => setIsPopupOpen(false)}>✕</button>
            </div>
            <form className="new-fin-add-form" onSubmit={handleSubmit}>
              <button type="submit" className="new-fin-submit-btn">
                Save Transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}