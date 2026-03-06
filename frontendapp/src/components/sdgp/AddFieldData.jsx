import { useState } from "react";
import "./AddFieldData.css";

export default function AddFieldData({ setPage }) {

  const [formData, setFormData] = useState({
    plantation_name: "",
    division_name: "",
    year: "",
    month: "",
    green_leaf: "",
    pluckers: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("New Field Data:", formData);

    alert("Field Data Added Successfully!");

    setFormData({
      plantation_name: "",
      division_name: "",
      year: "",
      month: "",
      green_leaf: "",
      pluckers: ""
    });
  };

  return (
    <div className="add-page">

      <div className="form-container">

        <div className="add-header">

          <h2>Add Field Data</h2>

          <button
            className="back-btn"
            onClick={() => setPage("fielddata")}
          >
            ← Back
          </button>

        </div>

        <form className="add-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Plantation Name</label>
            <input
              type="text"
              name="plantation_name"
              value={formData.plantation_name}
              onChange={handleChange}
              placeholder="Enter Plantation Name"
              required
            />
          </div>

          <div className="form-group">
            <label>Division Name</label>
            <input
              type="text"
              name="division_name"
              value={formData.division_name}
              onChange={handleChange}
              placeholder="Enter Division Name"
              required
            />
          </div>

          <div className="form-group">
            <label>Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="Enter Year"
              required
            />
          </div>

          <div className="form-group">
            <label>Month</label>
            <input
              type="text"
              name="month"
              value={formData.month}
              onChange={handleChange}
              placeholder="Enter Month"
              required
            />
          </div>

          <div className="form-group">
            <label>Green Leaf (kg)</label>
            <input
              type="number"
              name="green_leaf"
              value={formData.green_leaf}
              onChange={handleChange}
              placeholder="Enter Green Leaf Amount"
              required
            />
          </div>

          <div className="form-group">
            <label>Number of Pluckers</label>
            <input
              type="number"
              name="pluckers"
              value={formData.pluckers}
              onChange={handleChange}
              placeholder="Enter Pluckers Count"
              required
            />
          </div>

          <button className="submit-btn">
            Save Field Data
          </button>

        </form>

      </div>

    </div>
  );
}