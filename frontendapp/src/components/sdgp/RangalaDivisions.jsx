import "./RangalaDivisions.css";

export default function RangalaDivisions({ setPage }) {

  const divisions = [
    "Rangala Division",
    " New Division",
    "Ranwella Division",
    "Pooddelgodda",
    "Kalduriya Division",
    "Peru Division"
  ];
 

  return (
    <div className="division-page">

      <div className="division-header">
        <h2>Rangala Plantation Divisions</h2>

        <button
          className="back-btn"
          onClick={() => setPage("fielddata")}
        >
          ← Back
        </button>
      </div>

      <div className="division-grid">

        {divisions.map((division, index) => (

          <div key={index} className="division-card" onClick={(division === "Rangala Division" || division === "New Division") ? () => setPage(division === "Rangala Division" ? "rangaladata" : "newdivisiondata") : undefined}>

            <h3>{division}</h3>

            {(division === "Rangala Division" || division === "New Division") && <span className="arrow">→</span>}

          </div>

        ))}

      </div>

    </div>
  );
}