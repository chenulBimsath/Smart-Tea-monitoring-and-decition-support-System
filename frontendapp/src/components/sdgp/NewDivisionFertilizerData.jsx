import "./FertilizerTable.css";

export default function NewDivisionFertilizerData({ setPage }) {

  const data = [
    {
      field_no: "F7",
      date: "2024-01-15",
      fertilizer_name: "Urea",
      quantity: 100,
      cost: 20000,
      supplier: "Agro Lanka",
      type_of_tea: "VP",
      nutrient_ratio: "46:0:0",
      total_quantity: 100,
      application_method: "Manual Spread",
      soil_condition: "Dry Soil",
      supervisor: "Mr. Perera"
    },
    {
      field_no: "F8",
      date: "2024-02-18",
      fertilizer_name: "NPK",
      quantity: 130,
      cost: 26000,
      supplier: "Green Agro",
      type_of_tea: "Seedling",
      nutrient_ratio: "10:26:26",
      total_quantity: 130,
      application_method: "Machine Spread",
      soil_condition: "Wet Soil",
      supervisor: "Mr. Silva"
    },
    {
      field_no: "F9",
      date: "2024-03-20",
      fertilizer_name: "Organic",
      quantity: 80,
      cost: 16000,
      supplier: "Eco Fert",
      type_of_tea: "VP",
      nutrient_ratio: "5:5:5",
      total_quantity: 80,
      application_method: "Manual",
      soil_condition: "Moist Soil",
      supervisor: "Mr. Fernando"
    }
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

            {data.length > 0 ? (
              data.map((item, index) => (
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
              ))
            ) : (
              <tr>
                <td colSpan="13" className="empty-row">
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