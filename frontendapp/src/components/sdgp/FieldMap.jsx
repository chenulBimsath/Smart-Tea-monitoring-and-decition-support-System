import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  GeoJSON,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./FieldMap.css";

/* ================= AUTO ZOOM ================= */
function ZoomToLayer({ data }) {
  const map = useMap();

  useEffect(() => {
    if (!data?.features?.length) return;

    const layer = L.geoJSON(data);
    map.fitBounds(layer.getBounds());
  }, [data, map]);

  return null;
}

/* ================= FILTERED LAYER ================= */
function FilteredLayer({ geoData, selectedDivision, showNDVI }) {
  if (!geoData || !selectedDivision) return null;

  const target = selectedDivision.toLowerCase().trim();

  const filteredFeatures = geoData.features.filter((feature) => {
    const name = feature.properties?.name?.toLowerCase().trim() || "";
    return name.includes(target);
  });

  if (!filteredFeatures.length) return null;

  const filteredData = {
    type: "FeatureCollection",
    features: filteredFeatures
  };

  return (
    <>
      <ZoomToLayer data={filteredData} />

      <GeoJSON
        key={selectedDivision + showNDVI}  // ⭐ force reset layer
        data={filteredData}
        style={{
          color: "#2e7d32",
          weight: 2,
          fillColor: "#4caf50",
          fillOpacity: showNDVI ? 0.5 : 0
        }}
        onEachFeature={(feature, layer) => {
          layer.bindPopup(`<strong>${feature.properties?.name}</strong>`);
        }}
      />
    </>
  );
}

/* ================= MAIN COMPONENT ================= */
export default function FieldMap() {
  const [geoData, setGeoData] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("rangala");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [viewMode, setViewMode] = useState("boundary");

  /* ================= LOAD GEOJSON ================= */
  useEffect(() => {
    fetch("/data/tea-fields.json")
      .then((res) => res.json())
      .then((data) => {
        const cleanData = {
          ...data,
          features: data.features.filter(
            (f) => f.properties?.["@geometry-type"] !== "groundoverlay"
          )
        };
        setGeoData(cleanData);
      })
      .catch((err) => console.error("GeoJSON load error:", err));
  }, []);

  /* District → division mapping */
  const districtDivisions = {
    rangala: ["NEW DIVIDON", "RANGALA 1", "RANGALA 2", "RANGALA 3"],
    galle: ["NEW DIVIDON"],
    nuwaraeliya: ["NEW DIVIDON"]
  };

  const divisions = districtDivisions[selectedDistrict] || [];

  return (
    <div className="fieldmap-layout">
      {/* ================= MAP ================= */}
      <div className="fieldmap-map">
        <MapContainer
          center={[7.34, 80.80]}
          zoom={13}
          zoomControl={false}
          className="leaflet-map"
        >
          <ZoomControl position="topleft" />

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <FilteredLayer
            geoData={geoData}
            selectedDivision={selectedDivision}
            showNDVI={viewMode === "ndvi"}
          />
        </MapContainer>
      </div>

      {/* ================= FILTER PANEL ================= */}
      <div className="filter-card">
        <h3>Districts</h3>

        {["rangala", "galle", "nuwaraeliya"].map((district) => (
          <label key={district}>
            <input
              type="radio"
              name="district"
              checked={selectedDistrict === district}
              onChange={() => {
                setSelectedDistrict(district);
                setSelectedDivision("");
              }}
            />
            {district}
          </label>
        ))}

        <div className="divider" />

        <h3>Division</h3>

        {divisions.map((division) => (
          <label key={division}>
            <input
              type="radio"
              name="division"
              checked={selectedDivision === division}
              onChange={() => setSelectedDivision(division)}
            />
            {division}
          </label>
        ))}

        <div className="divider" />

        <h3>View Mode</h3>

        <label>
          <input
            type="radio"
            name="view"
            checked={viewMode === "boundary"}
            onChange={() => setViewMode("boundary")}
          />
          Show Division (Boundary Only)
        </label>

        <label>
          <input
            type="radio"
            name="view"
            checked={viewMode === "ndvi"}
            onChange={() => setViewMode("ndvi")}
          />
          Show NDVI (Green Area)
        </label>
      </div>
    </div>
  );
}