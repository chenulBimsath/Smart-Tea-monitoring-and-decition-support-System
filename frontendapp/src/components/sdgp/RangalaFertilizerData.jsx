import { useState } from "react";
import "./FertilizerTable.css";
import AddFertilizerData from "./AddFertilizerData";

export default function RangalaFertilizerData({ setPage }) {

  const [showForm, setShowForm] = useState(false);

  const data = [
    {
      field_no: "F1",
      date: "2024-01-10",
      fertilizer_name: "Urea",
      quantity: 120,
      cost: 24000,
      supplier: "Agro Lanka",
      type_of_tea: "VP",
      nutrient_ratio: "46:0:0",
      total_quantity: 120,
      application_method: "Manual Spread",
      soil_condition: "Moist",
      supervisor: "Mr. Silva"
    },
    {
      field_no: "F2",
      date: "2024-02-12",
      fertilizer_name: "NPK",
      quantity: 150,
      cost: 30000,
      supplier: "Green Agro",
      type_of_tea: "Seedling",
      nutrient_ratio: "10:26:26",
      total_quantity: 150,
      application_method: "Machine Spread",
      soil_condition: "Wet Soil",
      supervisor: "Mr. Perera"
    }
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

          <button
            className="add-btn"
            onClick={() => setShowForm(true)}
          >
            + Add Fertilizer Data
          </button>

        </div>

      </div>

      <div className="table-container">

        <table className="fertilizer-table">

          <thead>
            <tr>
              <th>#</th>
              <th>Field No</th>
              <th>Date</th>
              <th>Fertilizer Name</th>
              <th>Quantity (kg)</th>
              <th>Cost (LKR)</th>
              <th>Supplier</th>
              <th>Type of Tea</th>
              <th>Nutrient Ratio (N:P:K)</th>
              <th>Total Quantity Used</th>
              <th>Application Method</th>
              <th>Weather / Soil Condition</th>
              <th>Supervisor Name</th>
            </tr>
          </thead>

          <tbody>

            {data.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.field_no}</td>
                <td>{item.date}</td>
                <td>{item.fertilizer_name}</td>
                <td>{item.quantity}</td>
                <td>{item.cost}</td>
                <td>{item.supplier}</td>
                <td>{item.type_of_tea}</td>
                <td>{item.nutrient_ratio}</td>
                <td>{item.total_quantity}</td>
                <td>{item.application_method}</td>
                <td>{item.soil_condition}</td>
                <td>{item.supervisor}</td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {showForm && (
        <AddFertilizerData closeModal={() => setShowForm(false)} />
      )}

    </div>
  );
}