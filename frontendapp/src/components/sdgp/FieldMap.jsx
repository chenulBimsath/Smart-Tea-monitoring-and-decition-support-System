import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  ZoomControl,
  Marker,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./FieldMap.css";


const DISTRICTS = {
  talawakelle: { center: [6.94, 80.79], zoom: 12 },
  kothmale: { center: [7.05, 80.64], zoom: 12 },
  hatton: { center: [6.90, 80.60], zoom: 12 },
  nuwaraeliya: { center: [6.9697, 80.7891], zoom: 13 }
};


function FlyToLocation({ target }) {
  const map = useMap();

  if (target) {
    map.flyTo(target.center, target.zoom);
  }

  return null;
}

export default function FieldMap() {
  const [selectedDistrict, setSelectedDistrict] = useState("talawakelle");

  return (
    <div className="fieldmap-layout">
      {/* MAP */}
      <div className="fieldmap-map">
        <MapContainer
          center={[6.95, 80.78]}
          zoom={11}
          zoomControl={false}
          className="leaflet-map"
        >
          <ZoomControl position="topleft" />

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

        
          <FlyToLocation target={DISTRICTS[selectedDistrict]} />

          {/* Marker */}
          <Marker position={DISTRICTS[selectedDistrict].center} />
        </MapContainer>
      </div>

      
      <div className="filter-card">
        <div className="filter-card-header">
          <h3>Districts</h3>
          <span className="filter-menu">☰</span>
        </div>

        <div className="filter-group">
          <label>
            <input
              type="radio"
              name="district"
              checked={selectedDistrict === "talawakelle"}
              onChange={() => setSelectedDistrict("talawakelle")}
            />
            Talawakelle
          </label>

          <label>
            <input
              type="radio"
              name="district"
              checked={selectedDistrict === "kothmale"}
              onChange={() => setSelectedDistrict("kothmale")}
            />
            Kothmale
          </label>

          <label>
            <input
              type="radio"
              name="district"
              checked={selectedDistrict === "hatton"}
              onChange={() => setSelectedDistrict("hatton")}
            />
            Hatton
          </label>

          <label>
            <input
              type="radio"
              name="district"
              checked={selectedDistrict === "nuwaraeliya"}
              onChange={() => setSelectedDistrict("nuwaraeliya")}
            />
            Nuwara Eliya
          </label>
        </div>
      </div>
    </div>
  );
}
