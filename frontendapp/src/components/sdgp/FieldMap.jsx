import { useState, useEffect } from "react";
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


/* NDVI color */

function getNDVIColor(ndvi){
  if(ndvi > 0.6) return "green";
  if(ndvi > 0.4) return "yellow";
  return "red";
}

/* NDVI health text */

function getNDVIStatus(ndvi){
  if(ndvi > 0.6) return "Healthy Vegetation";
  if(ndvi > 0.4) return "Moderate Vegetation";
  return "Poor Vegetation";
}


/* district coordinates */

const districtLocations = {
  rangala: [7.327, 80.820],
  galle: [6.0535, 80.221],
  nuwaraeliya: [6.9497, 80.7891]
};


/* zoom to layer */

function ZoomToLayer({ data }){

  const map = useMap();

  useEffect(()=>{

    if(!data?.features?.length) return;

    const layer = L.geoJSON(data);

    map.fitBounds(layer.getBounds(),{
      padding:[80,80],
      maxZoom:16
    });

  },[data,map]);

  return null;
}


/* fly to district */

function FlyToDistrict({ district }){

  const map = useMap();

  useEffect(()=>{

    if(!district) return;

    const coords = districtLocations[district];

    if(coords){
      map.flyTo(coords,12);
    }

  },[district,map]);

  return null;
}


/* boundary layer */

function BoundaryLayer({ geoData, selectedDivision }){

  if(!geoData || !selectedDivision) return null;

  const target = selectedDivision.toLowerCase().trim();

  const filtered = geoData.features.filter((feature)=>{

    const name = feature.properties?.name?.toLowerCase().trim() || "";
    return name.includes(target);

  });

  if(!filtered.length) return null;

  const filteredData={
    type:"FeatureCollection",
    features:filtered
  };

  return(
    <>
      <ZoomToLayer data={filteredData}/>

      <GeoJSON
        key={selectedDivision}
        data={filteredData}
        style={{
          color:"#2e7d32",
          weight:2,
          fillOpacity:0
        }}
      />
    </>
  );
}


/* NDVI layer */

function NDVILayer({ ndviData, selectedDivision }){

  if(!ndviData || !selectedDivision) return null;

  const target = selectedDivision.toLowerCase().trim();

  const filtered = ndviData.features.filter((feature)=>{

    const name = feature.properties?.name?.toLowerCase().trim() || "";
    return name.includes(target);

  });

  if(!filtered.length) return null;

  const filteredData={
    type:"FeatureCollection",
    features:filtered
  };

  return(
    <>
      <ZoomToLayer data={filteredData}/>

      <GeoJSON
        key={selectedDivision}
        data={filteredData}
        style={(feature)=>{

          const ndvi = feature.properties.mean;

          return{
            color:"#000",
            weight:2,
            fillColor:getNDVIColor(ndvi),
            fillOpacity:0.6
          };

        }}
      />
    </>
  );
}


/* MAIN COMPONENT */

export default function FieldMap(){

  const [geoData,setGeoData]=useState(null);
  const [ndviData,setNdviData]=useState(null);

  const [selectedDistrict,setSelectedDistrict]=useState("rangala");
  const [selectedDivision,setSelectedDivision]=useState("");
  const [viewMode,setViewMode]=useState("boundary");

  const [selectedNDVI,setSelectedNDVI]=useState(null);

  const [markerPosition,setMarkerPosition]=useState(
    districtLocations["rangala"]
  );


  /* load boundary geojson */

  useEffect(()=>{

    fetch("/data/tea-fields.json")
      .then(res=>res.json())
      .then(data=>setGeoData(data));

  },[]);


  /* load NDVI geojson */

  useEffect(()=>{

    fetch("/data/division_ndvi.geojson")
      .then(res=>res.json())
      .then(data=>setNdviData(data));

  },[]);


  /* detect NDVI for selected division */

  useEffect(()=>{

    if(!ndviData || !selectedDivision) return;

    const target = selectedDivision.toLowerCase().trim();

    const feature = ndviData.features.find(f => {

      const name = f.properties?.name?.toLowerCase().trim() || "";
      return name.includes(target);

    });

    if(feature){
      setSelectedNDVI(feature.properties.mean);
    }

  },[selectedDivision, ndviData]);


  /* district divisions */

  const districtDivisions={

    rangala:[
      "NEW DIVIDON",
      "RANGALA 1",
      "RANGALA 2",
      "RANGALA 3"
    ],

    galle:[],
    nuwaraeliya:[]
  };

  const divisions=districtDivisions[selectedDistrict]||[];


  return(

    <div className="fieldmap-layout">

      <div className="fieldmap-map">

        <MapContainer
          center={[7.34,80.80]}
          zoom={13}
          zoomControl={false}
          className="leaflet-map"
        >

          <ZoomControl position="topleft"/>

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {viewMode==="ndvi" && (
            <TileLayer
              url="https://earthengine.googleapis.com/v1/projects/ndvi-project-489709/maps/47d6a46acbca51f3caf83df9a8240758-e08d069fb2b6012b5ac2de48365d3956/tiles/{z}/{x}/{y}"
              opacity={0.7}
            />
          )}

          <FlyToDistrict district={selectedDistrict}/>

          {markerPosition &&(
            <Marker position={markerPosition}>
              <Popup>{selectedDistrict.toUpperCase()}</Popup>
            </Marker>
          )}

          {viewMode==="boundary" &&(
            <BoundaryLayer
              geoData={geoData}
              selectedDivision={selectedDivision}
            />
          )}

          {viewMode==="ndvi" &&(
            <NDVILayer
              ndviData={ndviData}
              selectedDivision={selectedDivision}
            />
          )}

        </MapContainer>

      </div>


      {/* FILTER PANEL */}

      <div className="filter-card">

        <h3>Districts</h3>

        {["rangala","galle","nuwaraeliya"].map((district)=>(

          <label key={district}>

            <input
              type="radio"
              name="district"
              checked={selectedDistrict===district}
              onChange={()=>{

                setSelectedDistrict(district);
                setSelectedDivision("");
                setViewMode("boundary");
                setMarkerPosition(districtLocations[district]);

              }}
            />

            {district}

          </label>

        ))}

        <div className="divider"/>

        <h3>Division</h3>

        {divisions.length===0 ?(

          <p>No divisions added yet</p>

        ):(
          divisions.map((division)=>(

            <label key={division}>

              <input
                type="radio"
                name="division"
                checked={selectedDivision===division}
                onChange={()=>setSelectedDivision(division)}
              />

              {division}

            </label>

          ))
        )}

        {divisions.length>0 &&(
          <>
            <div className="divider"/>

            <h3>View Mode</h3>

            <label>
              <input
                type="radio"
                name="view"
                checked={viewMode==="boundary"}
                onChange={()=>setViewMode("boundary")}
              />
              Boundary Only
            </label>

            <label>
              <input
                type="radio"
                name="view"
                checked={viewMode==="ndvi"}
                onChange={()=>setViewMode("ndvi")}
              />
              NDVI (Vegetation)
            </label>

            {viewMode==="ndvi" && selectedNDVI!==null &&(

   <div className="ndvi-dashboard">

  <h3>Vegetation Health</h3>

  <div className="ndvi-score">
    <span className="ndvi-number">
      {selectedNDVI.toFixed(2)}
    </span>
    <span className="ndvi-label">
      {getNDVIStatus(selectedNDVI)}
    </span>
  </div>

  <div className="ndvi-bar">
    <div
      className="ndvi-progress"
      style={{
        width: `${selectedNDVI * 100}%`,
        background:
          selectedNDVI > 0.6
            ? "#2e7d32"
            : selectedNDVI > 0.4
            ? "#f9a825"
            : "#c62828"
      }}
    />
  </div>

  <div className="ndvi-stats">

    <div className="stat">
      <span className="label">Vegetation</span>
      <span className="value">
        {selectedNDVI > 0.6 && "Dense"}
        {selectedNDVI > 0.4 && selectedNDVI <= 0.6 && "Moderate"}
        {selectedNDVI <= 0.4 && "Low"}
      </span>
    </div>

    <div className="stat">
      <span className="label">Health</span>
      <span className="value">
        {selectedNDVI > 0.6 && "Excellent"}
        {selectedNDVI > 0.4 && selectedNDVI <= 0.6 && "Average"}
        {selectedNDVI <= 0.4 && "Poor"}
      </span>
    </div>

  </div>

</div>

            )}

          </>
        )}

      </div>

    </div>
  );
}