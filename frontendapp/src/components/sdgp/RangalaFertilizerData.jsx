import { useState } from "react";
import "./FertilizerTable.css";
import AddFertilizerData from "./AddFertilizerData";

export default function RangalaFertilizerData({ setPage }) {

  const [showForm, setShowForm] = useState(false);

  const data = [
    { field_no: "F1", year: 2024, month: "January", fertilizer_type: "Urea", quantity: 120, cost: 24000, supplier: "Agro Lanka" },
    { field_no: "F2", year: 2024, month: "February", fertilizer_type: "NPK", quantity: 150, cost: 30000, supplier: "Green Agro" },
    { field_no: "F3", year: 2024, month: "March", fertilizer_type: "Organic", quantity: 90, cost: 18000, supplier: "Eco Fert" }
  ];

  return (
    <div className="fertilizer-page">

      <div className="fertilizer-header">

        <h2>Rangala Division Fertilizer Data</h2>

        <div className="header-buttons">

          <button
            className="back-btn"
            onClick={() => setPage("fertilizerrangaladivisions")}
          >
            ← Back
          </button>


        </div>

      </div>

      <div className="table-container">

        <table className="fertilizer-table">

          <thead>
            <tr>
              <th>#</th>
              <th>Field No</th>
              <th>Year</th>
              <th>Month</th>
              <th>Fertilizer Type</th>
              <th>Quantity (kg)</th>
              <th>Cost (LKR)</th>
              <th>Supplier</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.field_no}</td>
                <td>{item.year}</td>
                <td>{item.month}</td>
                <td>{item.fertilizer_type}</td>
                <td>{item.quantity}</td>
                <td>{item.cost}</td>
                <td>{item.supplier}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {/* MODAL */}
      {showForm && (
        <AddFertilizerData closeModal={() => setShowForm(false)} />
      )}

    </div>
  );
}