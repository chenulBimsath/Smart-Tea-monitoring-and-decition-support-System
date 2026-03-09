import { useState } from "react";
import "./AddFertilizerData.css";

export default function AddFertilizerData({ setPage }) {

  const [formData, setFormData] = useState({
    division: "",
    field_no: "",
    year: "",
    month: "",
    date: "",
    fertilizer_type: "",
    quantity: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
    alert("Fertilizer data saved!");

    setPage("fertilizerrangaladivisions");
  };

  return (
    <div className="modal-overlay">

      <div className="modal-card">

        <div className="modal-header">
          <h2>Add Fertilizer Data</h2>

          <button
            className="close-btn"
            onClick={() => setPage("fertilizerrangaladivisions")}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <label>Division</label>
          <select name="division" onChange={handleChange} required>
            <option value="">Select Division</option>
            <option>Rangala Division</option>
            <option>Pooddelgodda Division</option>
            <option>Ranwella Division</option>
            <option>New Division</option>
            <option>Kalduriya Division</option>
            <option>Peru Division</option>
          </select>

          <label>Field No</label>
          <input
            type="text"
            name="field_no"
            placeholder="Enter Field Number"
            onChange={handleChange}
            required
          />

          <label>Year</label>
          <input
            type="number"
            name="year"
            placeholder="Enter Year"
            onChange={handleChange}
            required
          />

          <label>Month</label>
          <select name="month" onChange={handleChange} required>
            <option value="">Select Month</option>
            <option>January</option>
            <option>February</option>
            <option>March</option>
            <option>April</option>
            <option>May</option>
            <option>June</option>
            <option>July</option>
            <option>August</option>
            <option>September</option>
            <option>October</option>
            <option>November</option>
            <option>December</option>
          </select>

          <label>Date</label>
          <input
            type="date"
            name="date"
            onChange={handleChange}
          />

          <label>Fertilizer Type</label>
          <input
            type="text"
            name="fertilizer_type"
            placeholder="Enter Fertilizer Type"
            onChange={handleChange}
          />

          <label>Quantity (kg)</label>
          <input
            type="number"
            name="quantity"
            placeholder="Enter Quantity"
            onChange={handleChange}
          />

          <button className="save-btn">
            Save Fertilizer Data
          </button>

        </form>

      </div>

    </div>
  );
}