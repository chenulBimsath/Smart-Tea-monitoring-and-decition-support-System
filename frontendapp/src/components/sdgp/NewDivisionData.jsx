import { useState } from "react";
import "./RangalaData.css";

export default function NewDivisionData({ setPage }) {

  const data = {
    2023: [
      { year: 2023, month: "January", green_leaf: 300, pluckers: 10, cash_kilo: 110, without_cash_avg: 95 },
      { year: 2023, month: "February", green_leaf: 280, pluckers: 9, cash_kilo: 108, without_cash_avg: 92 },
      { year: 2023, month: "March", green_leaf: 320, pluckers: 11, cash_kilo: 112, without_cash_avg: 97 }
    ],

    2024: [
      { year: 2024, month: "January", green_leaf: 340, pluckers: 12, cash_kilo: 115, without_cash_avg: 100 },
      { year: 2024, month: "February", green_leaf: 330, pluckers: 11, cash_kilo: 118, without_cash_avg: 103 },
      { year: 2024, month: "March", green_leaf: 360, pluckers: 13, cash_kilo: 120, without_cash_avg: 105 }
    ],

    2025: [
      { year: 2025, month: "January", green_leaf: 380, pluckers: 14, cash_kilo: 125, without_cash_avg: 110 },
      { year: 2025, month: "February", green_leaf: 370, pluckers: 13, cash_kilo: 128, without_cash_avg: 112 },
      { year: 2025, month: "March", green_leaf: 400, pluckers: 15, cash_kilo: 130, without_cash_avg: 115 }
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

        <h2>New Division Field Data - {currentYear}</h2>

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
              <th>Year</th>
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
                <td>{item.year}</td>
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