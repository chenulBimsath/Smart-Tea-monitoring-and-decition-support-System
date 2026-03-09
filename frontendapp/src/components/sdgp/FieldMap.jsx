// React hooks
import { useState, useEffect } from "react";

// Leaflet components
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  GeoJSON,
  useMap,
  Marker,
  Popup
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./FieldMap.css";


/* -------- District coordinates -------- */

const districtLocations = {
  rangala: [7.327, 80.820],
  galle: [6.0535, 80.221],
  nuwaraeliya: [6.9497, 80.7891]
};


/* -------- Zoom to selected division -------- */

function ZoomToLayer({ data }) {

  const map = useMap();

  useEffect(() => {

    if (!data?.features?.length) return;

    const layer = L.geoJSON(data);

    map.fitBounds(layer.getBounds(), {
      padding: [80, 80],  
      maxZoom: 16          
    });

  }, [data, map]);

  return null;
}


/* -------- Move map to district -------- */

function FlyToDistrict({ district }) {

  const map = useMap();

  useEffect(() => {

    if (!district) return;

    const coords = districtLocations[district];

    if (coords) {
      map.flyTo(coords, 12);
    }

  }, [district, map]);

  return null;
}


/* -------- Show selected division polygon -------- */

function FilteredLayer({ geoData, selectedDivision, showNDVI }) {

  if (!geoData || !selectedDivision) return null;

  const target = selectedDivision.toLowerCase().trim();

  // filter polygon
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
      {/* zoom to polygon */}
      <ZoomToLayer data={filteredData} />

      <GeoJSON
        key={selectedDivision + showNDVI}
        data={filteredData}
        style={() => ({
          color: "#2e7d32",
          weight: 2,
          fillColor: "#4caf50",
          fillOpacity: showNDVI ? 0.5 : 0
        })}
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

  const [markerPosition, setMarkerPosition] = useState(
    districtLocations["rangala"]
  );


  /* -------- Load GeoJSON -------- */

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

      .catch((err) => console.error("GeoJSON error:", err));

  }, []);



  /* -------- District divisions -------- */

  const districtDivisions = {

    rangala: [
      "NEW DIVIDON",
      "RANGALA 1",
      "RANGALA 2",
      "RANGALA 3"
    ],

    galle: [],

    nuwaraeliya: []
  };

  const divisions = districtDivisions[selectedDistrict] || [];



  /* ================= UI ================= */

  return (
    <div className="fieldmap-layout">

      {/* ------------ MAP ------------ */}

      <div className="fieldmap-map">

        <MapContainer
          center={[7.34, 80.80]}
          zoom={13}
          zoomControl={false}
          className="leaflet-map"
        >

          <ZoomControl position="topleft" />

          {/* base map */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* move map when district changes */}
          <FlyToDistrict district={selectedDistrict} />

          {/* district marker */}
          {markerPosition && (
            <Marker position={markerPosition}>
              <Popup>{selectedDistrict.toUpperCase()}</Popup>
            </Marker>
          )}

          {/* division boundary */}
          <FilteredLayer
            geoData={geoData}
            selectedDivision={selectedDivision}
            showNDVI={viewMode === "ndvi"}
          />

        </MapContainer>

      </div>



      {/* ------------ FILTER PANEL ------------ */}

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
                setViewMode("boundary");
                setMarkerPosition(districtLocations[district]);

              }}
            />

            {district}

          </label>

        ))}


        <div className="divider" />


        {/* -------- Division list -------- */}

        <h3>Division</h3>

        {divisions.length === 0 ? (

          <p>No divisions added yet</p>

        ) : (

          divisions.map((division) => (

            <label key={division}>

              <input
                type="radio"
                name="division"
                checked={selectedDivision === division}
                onChange={() => setSelectedDivision(division)}
              />

              {division}

            </label>

          ))

        )}



        {/* -------- View Mode only if divisions exist -------- */}

        {divisions.length > 0 && (
          <>
            <div className="divider" />

            <h3>View Mode</h3>

            <label>

              <input
                type="radio"
                name="view"
                checked={viewMode === "boundary"}
                onChange={() => setViewMode("boundary")}
              />

              Boundary Only

            </label>


            <label>

              <input
                type="radio"
                name="view"
                checked={viewMode === "ndvi"}
                onChange={() => setViewMode("ndvi")}
              />

              NDVI (Green Area)

            </label>

          </>
        )}

      </div>  
    </div>
  );
}