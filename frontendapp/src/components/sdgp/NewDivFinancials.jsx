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

  // --- FETCH DATA FROM SPRING BOOT ---
  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/financial-data");
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

  // Placeholders for final commit
  const toggleMenu = (id) => setOpenMenuId(openMenuId === id ? null : id);
  const openAddPopup = () => setIsPopupOpen(true);
  const handleUpdate = (item) => {};
  const handleDelete = async (id) => {};
  const handleFormChange = (e) => {};
  const handleSubmit = async (e) => { e.preventDefault(); };

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