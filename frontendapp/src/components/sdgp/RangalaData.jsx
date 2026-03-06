import { useState } from "react";
import "./RangalaData.css";

export default function RangalaData({ setPage }) {

  const data = {
    2023: [
      { crop_id: 1, month: "January", green_leaf: 300, pluckers: 10, cash_kilo: 110, without_cash_avg: 90 },
      { crop_id: 2, month: "February", green_leaf: 280, pluckers: 9, cash_kilo: 105, without_cash_avg: 85 },
      { crop_id: 3, month: "March", green_leaf: 320, pluckers: 11, cash_kilo: 115, without_cash_avg: 95 }
    ],

    2024: [
      { crop_id: 4, month: "January", green_leaf: 330, pluckers: 12, cash_kilo: 120, without_cash_avg: 98 },
      { crop_id: 5, month: "February", green_leaf: 310, pluckers: 10, cash_kilo: 118, without_cash_avg: 92 },
      { crop_id: 6, month: "March", green_leaf: 350, pluckers: 13, cash_kilo: 125, without_cash_avg: 100 }
    ],

    2025: [
      { crop_id: 7, month: "January", green_leaf: 360, pluckers: 14, cash_kilo: 130, without_cash_avg: 105 },
      { crop_id: 8, month: "February", green_leaf: 340, pluckers: 12, cash_kilo: 128, without_cash_avg: 102 },
      { crop_id: 9, month: "March", green_leaf: 370, pluckers: 15, cash_kilo: 135, without_cash_avg: 110 }
    ]
  };

  const years = Object.keys(data);

  const [currentPage, setCurrentPage] = useState(0);

  const currentYear = years[currentPage];
  const yearData = data[currentYear];

  const nextPage = () => {
    if (currentPage < years.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="rangala-page">

      <div className="rangala-header">

        <h2>Rangala Field Data - {currentYear}</h2>

        <div className="header-buttons">


          <button
            className="back-btn"
            onClick={() => setPage("rangaladivisions")}
          >
            ← Back to Divisions
          </button>

        </div>

      </div>

      <div className="table-container">

        <table className="data-table">

          <thead>
            <tr>
              <th>Crop ID</th>
              <th>Month</th>
              <th>Green Leaf</th>
              <th>Pluckers</th>
              <th>Cash/Kilo</th>
              <th>Without Cash Avg</th>
            </tr>
          </thead>

          <tbody>

            {yearData.map((item, index) => (

              <tr key={index}>
                <td>{item.crop_id}</td>
                <td>{item.month}</td>
                <td>{item.green_leaf}</td>
                <td>{item.pluckers}</td>
                <td>{item.cash_kilo}</td>
                <td>{item.without_cash_avg}</td>
              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="pagination">

        <button onClick={prevPage} disabled={currentPage === 0}>
          ← Previous
        </button>


        <button onClick={nextPage} disabled={currentPage === years.length - 1}>
          Next →
        </button>

      </div>

    </div>
  );
}