import { useState, useEffect } from "react";
import {
  MapContainer, TileLayer, ZoomControl,
  GeoJSON, useMap, Marker, Popup
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./FieldMap.css";
import L from "leaflet"; 

const customIcon = L.icon({
  iconUrl: "/marker.png", 
  iconSize: [50, 50],
  iconAnchor: [20, 50],
  popupAnchor: [0, -40]
});

/* ── NDVI helpers ── */
function getNDVIColor(ndvi) {
  if (ndvi < 0.2) return "#8c510a";
  if (ndvi < 0.4) return "#d97706";
  if (ndvi < 0.6) return "#4ade80";
  return "#16a34a";
}
function getNDVIStatus(ndvi) {
  if (ndvi >= 0.6) return "Dense Healthy Vegetation";
  if (ndvi >= 0.4) return "Moderate Vegetation";
  if (ndvi >= 0.2) return "Sparse Vegetation";
  return "Very Low / Bare Soil";
}
function getNDVIDescription(ndvi) {
  if (ndvi >= 0.6) return "Dense vegetation. Crops are healthy and growing well.";
  if (ndvi >= 0.4) return "Moderate vegetation. Growth is normal but can be improved.";
  if (ndvi >= 0.2) return "Sparse vegetation. Possible stress or low growth.";
  return "Very low vegetation. Likely bare soil or unhealthy crops.";
}

const districtLocations = {
  rangala:     [7.327,  80.820],
  galle:       [6.0535, 80.221],
  nuwaraeliya: [6.9497, 80.7891]
};

function ZoomToLayer({ data }) {
  const map = useMap();
  useEffect(() => {
    if (!data?.features?.length) return;
    const layer = L.geoJSON(data);
    map.fitBounds(layer.getBounds(), { padding: [80, 80], maxZoom: 16 });
  }, [data, map]);
  return null;
}

function FlyToDistrict({ district }) {
  const map = useMap();
  useEffect(() => {
    const coords = districtLocations[district];
    if (coords) map.flyTo(coords, 12);
  }, [district, map]);
  return null;
}

function BoundaryLayer({ geoData, selectedDivision }) {
  if (!geoData || !selectedDivision) return null;
  const target = selectedDivision.toLowerCase().trim();
  const filtered = geoData.features.filter(
    f => (f.properties?.name?.toLowerCase().trim() || "") === target
  );
  if (!filtered.length) return null;
  const filteredData = { type: "FeatureCollection", features: filtered };
  return (
    <>
      <ZoomToLayer data={filteredData} />
      <GeoJSON
        key={selectedDivision + "_boundary"}
        data={filteredData}
        style={{ color: "#025520", weight: 2.5, fillOpacity: 0, dashArray: "6 4" }}
      />
    </>
  );
}

function NDVILayer({ ndviData, selectedDivision }) {
  if (!ndviData || !selectedDivision) return null;
  const target = selectedDivision.toLowerCase().trim();
  const filtered = ndviData.features.filter(
    f => (f.properties?.name?.toLowerCase().trim() || "") === target
  );
  if (!filtered.length) return null;
  const filteredData = { type: "FeatureCollection", features: filtered };
  return (
    <>
      <ZoomToLayer data={filteredData} />
      <GeoJSON
        key={selectedDivision + "_ndvi"}
        data={filteredData}
        style={(feature) => {
          let ndvi = feature.properties?.mean ?? 0;
          if (ndvi > 1) ndvi = ndvi / 100;
          return { color: "#0f1a12", weight: 1.5, fillColor: getNDVIColor(ndvi), fillOpacity: 0.75 };
        }}
        onEachFeature={(feature, layer) => {
          let ndvi = feature.properties?.mean ?? 0;
          if (ndvi > 1) ndvi = ndvi / 100;
          layer.bindPopup(`
            <b>${feature.properties.name}</b><br/>
            NDVI: ${ndvi.toFixed(2)}<br/>
            Status: ${getNDVIStatus(ndvi)}<br/>
            ${getNDVIDescription(ndvi)}
          `);
        }}
      />
    </>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function FieldMap() {
  const [geoData,          setGeoData]          = useState(null);
  const [ndviData,         setNdviData]          = useState(null);
  const [selectedDistrict, setSelectedDistrict]  = useState("rangala");
  const [selectedDivision, setSelectedDivision]  = useState("");
  const [viewMode,         setViewMode]           = useState("boundary");
  const [selectedNDVI,     setSelectedNDVI]       = useState(null);
  const [markerPosition,   setMarkerPosition]     = useState(districtLocations["rangala"]);
  const [panelOpen,        setPanelOpen]          = useState(false);  // mobile panel state

  useEffect(() => {
    fetch("/data/tea-fields.json")
      .then(r => r.json()).then(setGeoData)
      .catch(err => console.error("Failed to load tea-fields.json:", err));

    fetch("/data/division_ndvi1.geojson")
      .then(r => r.json())
      .then(data => {
        console.log("=== division_ndvi1.geojson loaded ===");
        data.features.forEach((f, i) => {
          const raw = f.properties?.mean;
          const ndvi = raw > 1 ? raw / 100 : raw;
          console.log(`  [${i}] name: "${f.properties?.name}" | mean: ${raw} | normalized: ${ndvi?.toFixed(4)}`);
        });
        setNdviData(data);
      })
      .catch(err => console.error("Failed to load division_ndvi1.geojson:", err));
  }, []);

  useEffect(() => {
    if (!ndviData || !selectedDivision) { setSelectedNDVI(null); return; }
    const target = selectedDivision.toLowerCase().trim();
    const feature = ndviData.features.find(
      f => (f.properties?.name?.toLowerCase().trim() || "") === target
    );
    if (feature) {
      let ndvi = feature.properties.mean;
      if (ndvi > 1) ndvi = ndvi / 100;
      setSelectedNDVI(ndvi);
    } else {
      setSelectedNDVI(null);
    }
  }, [selectedDivision, ndviData]);

  // Close panel when clicking outside (mobile)
  useEffect(() => {
    if (!panelOpen) return;
    const handler = (e) => {
      if (!e.target.closest(".filter-card") && !e.target.closest(".filter-toggle-btn"))
        setPanelOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [panelOpen]);

  const districtDivisions = {
    rangala:     ["NEW DIVIDON", "RANGALA 1", "RANGALA 2", "RANGALA 3"],
    galle:       [],
    nuwaraeliya: []
  };
  const divisions = districtDivisions[selectedDistrict] || [];

  function handleDistrictChange(district) {
    setSelectedDistrict(district);
    setSelectedDivision("");
    setViewMode("boundary");
    setSelectedNDVI(null);
    setMarkerPosition(districtLocations[district]);
  }

  function handleDivisionChange(division) {
    setSelectedDivision(division);
  }

  return (
    <div className="fieldmap-layout">

      {/* ── Map ── */}
      <div className="fieldmap-map">
        <MapContainer
          center={[7.34, 80.80]}
          zoom={13}
          zoomControl={false}
          className="leaflet-map"
        >
          <ZoomControl position="topleft" />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {viewMode === "ndvi" && (
            <TileLayer
              url="https://earthengine.googleapis.com/v1/projects/ndvi-project-489709/maps/411895cfe625a22b3dd17c2d472400af-d192c232c3bfebd02e7f668f52aad4e4/tiles/{z}/{x}/{y}"
              opacity={0.3}
            />
          )}
          <FlyToDistrict district={selectedDistrict} />
          <Marker position={markerPosition} icon={customIcon}>
  <Popup>{selectedDistrict.toUpperCase()}</Popup>
</Marker>
          <BoundaryLayer geoData={geoData} selectedDivision={selectedDivision} />
          {viewMode === "ndvi" && selectedDivision && (
            <NDVILayer ndviData={ndviData} selectedDivision={selectedDivision} />
          )}
        </MapContainer>

        {/* Toggle button — mobile only, right side below the badge */}
        <button
          className="filter-toggle-btn"
          onClick={() => setPanelOpen(o => !o)}
          aria-label="Toggle map filters"
        >
          ☰ FILTERS
        </button>
      </div>

      {/* Backdrop — mobile only */}
      {panelOpen && (
        <div className="filter-backdrop" onClick={() => setPanelOpen(false)} />
      )}

      {/* ── Side Panel ── */}
      <div className={`filter-card${panelOpen ? " filter-open" : ""}`}>

        {/* Close button — mobile only */}
        <button
          className="filter-close-btn"
          onClick={() => setPanelOpen(false)}
          aria-label="Close filters"
        >
          ✕
        </button>

        <h3>Districts</h3>

        {["rangala", "galle", "nuwaraeliya"].map((district) => (
          <label key={district}>
            <input
              type="radio"
              checked={selectedDistrict === district}
              onChange={() => handleDistrictChange(district)}
            />
            {district.charAt(0).toUpperCase() + district.slice(1)}
          </label>
        ))}

        <div className="divider" />

        <h3>Division</h3>

        {divisions.length === 0 ? (
          <p>No divisions available</p>
        ) : (
          divisions.map((division) => (
            <label key={division}>
              <input
                type="radio"
                checked={selectedDivision === division}
                onChange={() => handleDivisionChange(division)}
              />
              {division}
            </label>
          ))
        )}

        {divisions.length > 0 && (
          <>
            <div className="divider" />

            <h3>View Mode</h3>

            <label>
              <input
                type="radio"
                checked={viewMode === "boundary"}
                onChange={() => setViewMode("boundary")}
              />
              Boundary Only
            </label>

            <label>
              <input
                type="radio"
                disabled={!selectedDivision}
                checked={viewMode === "ndvi"}
                onChange={() => setViewMode("ndvi")}
              />
              NDVI Vegetation
            </label>

            {viewMode === "ndvi" && selectedNDVI !== null && (
              <div className="ndvi-dashboard">
                <h3>{selectedDivision}</h3>
                <div className="ndvi-score">
                  <span className="ndvi-number">{selectedNDVI.toFixed(2)}</span>
                  <span className="ndvi-label">{getNDVIStatus(selectedNDVI)}</span>
                </div>
                <p style={{ fontSize: "11px", marginTop: "8px", marginBottom: "10px" }}>
                  {getNDVIDescription(selectedNDVI)}
                </p>
                <div className="ndvi-bar">
                  <div
                    className="ndvi-progress"
                    style={{ width: `${Math.max(selectedNDVI * 100, 2)}%`, background: getNDVIColor(selectedNDVI) }}
                  />
                </div>
                <div className="ndvi-legend" style={{ marginTop: "14px" }}>
                  {[
                    { color: "#16a34a", label: "0.8 – 1.0", status: "Very Healthy" },
                    { color: "#4ade80", label: "0.6 – 0.8", status: "Healthy" },
                    { color: "#86efac", label: "0.4 – 0.6", status: "Moderate" },
                    { color: "#d97706", label: "0.2 – 0.4", status: "Stressed" },
                    { color: "#8c510a", label: "0.0 – 0.2", status: "Bare Soil" },
                  ].map(({ color, label, status }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                      <span style={{
                        width: 10, height: 10, background: color,
                        display: "inline-block", borderRadius: 2, flexShrink: 0,
                        opacity: selectedNDVI !== null && getNDVIColor(selectedNDVI) === color ? 1 : 0.45
                      }} />
                      <span style={{
                        fontSize: "10px", fontFamily: "'Space Mono', monospace",
                        color: getNDVIColor(selectedNDVI) === color ? "#1a2e1a" : "#4a6350"
                      }}>
                        {label} <span style={{ color: "#7da882" }}>{status}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewMode === "ndvi" && !selectedDivision && (
              <p style={{ fontSize: "11px", color: "#4a6350", marginTop: "8px", padding: "0 20px" }}>
                Select a division to view NDVI data.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
