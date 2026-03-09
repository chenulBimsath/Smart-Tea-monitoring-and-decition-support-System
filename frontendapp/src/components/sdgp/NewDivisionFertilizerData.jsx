import "./FertilizerTable.css";

export default function NewDivisionFertilizerData({ setPage }) {

  const data = [
    { field_no: "F7", year: 2024, month: "January", fertilizer_type: "Urea", quantity: 100, cost: 20000, supplier: "Agro Lanka" },
    { field_no: "F8", year: 2024, month: "February", fertilizer_type: "NPK", quantity: 130, cost: 26000, supplier: "Green Agro" },
    { field_no: "F9", year: 2024, month: "March", fertilizer_type: "Organic", quantity: 80, cost: 16000, supplier: "Eco Fert" }
  ];

  return (
    <div className="fertilizer-page">

      {/* HEADER */}
      <div className="fertilizer-header">

        <h2>New Division Fertilizer Data</h2>

        <div className="header-buttons">

          <button
            className="back-btn"
            onClick={() => setPage("fertilizerrangaladivisions")}
          >
            ← Back
          </button>

        </div>

      </div>

      {/* TABLE */}
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

            {data.length > 0 ? (
              data.map((item, index) => (
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
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-row">
                  No fertilizer data available
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}