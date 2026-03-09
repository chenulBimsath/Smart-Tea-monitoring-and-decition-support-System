import "./RangalaDivisions.css";

export default function FertilizerRangalaDivisions({ setPage }) {

  const divisions = [
    "Rangala Division",
    "Pooddelgodda",
    "Ranwella Division",
    "New Division",
    "Kalduriya Division",
    "Peru Division"
  ];

  const handleClick = (division) => {
    if (division === "Rangala Division") {
      setPage("fertilizerrangaladata");
    }

    if (division === "New Division") {
      setPage("fertilizernewdivisiondata");
    }
  };

  return (
    <div className="division-page">

      <div className="division-header">
        <h2>Rangala Fertilizer Divisions</h2>

        <button
          className="back-btn"
          onClick={() => setPage("fertilizerdata")}
        >
          ← Back
        </button>
      </div>

      <div className="division-grid">

        {divisions.map((division, index) => (

          <div
            key={index}
            className="division-card"
            onClick={() => handleClick(division)}
          >

            <h3>{division}</h3>

            {(division === "Rangala Division" || division === "New Division") &&
              <span className="arrow">→</span>
            }

          </div>

        ))}

      </div>

    </div>
  );
}