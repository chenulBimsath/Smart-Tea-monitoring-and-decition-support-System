import "./FieldData.css";

export default function FertilizerData({ setPage }) {

  const stats = [
    { title: "Total Estates", value: 4 },
    { title: "Total Fertilizer Records", value: 18 },
    { title: "Available Stock", value: 12 },
    { title: "Low Stock", value: 6 },
  ];

  const regions = [
    {
      name: "Rangala",
      image: "/1.png"
    },
    {
      name: "Hatton",
      image: "/2.png"
    },
    {
      name: "Badulla",
      image: "/3.png"
    },
    {
      name: "Nuwara Eliya",
      image: "/4.png"
    }
  ];

  return (
    <div className="fielddata-page">


      <div className="fielddata-header">
        <h2>Fertilizer Data</h2>
        <button
          className="add-btn"
          onClick={() => setPage("addfertilizer")}
        >
          + Add Fertilizer Data
        </button>
      </div>


      <div className="stats-grid">
        {stats.map((item, index) => (
          <div key={index} className="stat-card">
            <h4>{item.title}</h4>
            <p>{item.value}</p>
          </div>
        ))}
      </div>


      <div className="region-grid">

        {regions.map((region, index) => (

          <div
            key={index}
            className="region-box"
            onClick={
              region.name === "Rangala"
                ? () => setPage("fertilizerrangaladivisions")
                : undefined
            }
          >

            <div className="region-image-wrapper">
              <img
                src={region.image}
                alt={region.name}
                className="region-image"
              />
            </div>

            <div className="region-info">
              <span>{region.name}</span>

              
              {region.name === "Rangala" && (
                <span className="arrow">→</span>
              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}