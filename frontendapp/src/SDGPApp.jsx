import { useState } from "react";
import "./App.css";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
<<<<<<< Updated upstream
=======

import Dashboard from "./components/sdgp/Dashboard";
>>>>>>> Stashed changes
import FieldMap from "./components/sdgp/FieldMap";
import FieldData from "./components/sdgp/FieldData";
import ClimateRisk from "./components/sdgp/ClimateRisk";
import MyProfile from "./components/sdgp/MyProfile";
import RangalaData from "./components/sdgp/RangalaData";
import RangalaDivisions from "./components/sdgp/RangalaDivisions";
import NewDivisionData from "./components/sdgp/NewDivisionData";
import AddFieldData from "./components/sdgp/AddFieldData";
import FertilizerData from "./components/sdgp/FertilizerData";
import FertilizerRangalaDivisions from "./components/sdgp/FertilizerRangalaDivisions";
import RangalaFertilizerData from "./components/sdgp/RangalaFertilizerData";
import NewDivisionFertilizerData from "./components/sdgp/NewDivisionFertilizerData";
import CropYields from "./components/sdgp/CropYields";
import AddFertilizerData from "./components/sdgp/AddFertilizerData";


export default function SDGPApp() {

  const [page, setPage] = useState("fieldmap");

  return (
    <>
      <Header />

      <div className="app-layout"> <Sidebar page={page} setPage={setPage} />

        <main className="app-main">

          {page === "dashboard" && <Dashboard />}

          {page === "fieldmap" && <FieldMap />}


          {page === "fielddata" && <FieldData setPage={setPage} />}


          {page === "fielddata" && (<FieldData setPage={setPage} />)}

          {page === "climaterisk" && <ClimateRisk />}
          {page === "profile" && <MyProfile />}
          {page === "rangaladivisions" && ( <RangalaDivisions setPage={setPage} /> )}
          {page === "rangaladata" && ( <RangalaData setPage={setPage} />)}
          {page === "newdivisiondata" && (<NewDivisionData setPage={setPage} />         )}
          {page === "addfield" && (<AddFieldData setPage={setPage} /> )}
          {page === "crop_yields" && (<CropYields setPage={setPage} />)}
          {page === "profile" && <MyProfile />}


          {page === "rangaladivisions" && (
            <RangalaDivisions setPage={setPage} />
          )}

          {page === "rangaladata" && (
            <RangalaData setPage={setPage} />
          )}

          {page === "newdivisiondata" && (
            <NewDivisionData setPage={setPage} />
          )}

          {page === "addfield" && (
            <AddFieldData setPage={setPage} />
          )}

          {page === "rangaladivisions" && ( <RangalaDivisions setPage={setPage} /> )}

          {page === "fielddata" && (<FieldData setPage={setPage} />)}
          {page === "climaterisk" && <ClimateRisk />}
          {page === "profile" && <MyProfile />}
          {page === "rangaladivisions" && ( <RangalaDivisions setPage={setPage} /> )}

          {page === "rangaladata" && ( <RangalaData setPage={setPage} />  )}
          {page === "newdivisiondata" && (  <NewDivisionData setPage={setPage} /> )}
          {page === "addfield" && ( <AddFieldData setPage={setPage} />)}
          {page === "crop_yields" && (<CropYields setPage={setPage} />)}
          {page === "fertilizerdata" && (<FertilizerData setPage={setPage} />)}
          {page === "fertilizerrangaladivisions" && (<FertilizerRangalaDivisions setPage={setPage} />)}
          {page === "rangalafertilizer" && (<RangalaFertilizerData setPage={setPage} />)}
          {page === "newdivisionfertilizer" && (<NewDivisionFertilizerData setPage={setPage} />)}
          {page === "addfertilizer" && (<AddFertilizerData setPage={setPage} />)}
          {page === "rangalafertilizer" && (<RangalaFertilizerData setPage={setPage} />)}
          {page === "newdivisionfertilizer" && (<NewDivisionFertilizerData setPage={setPage} />)}
          {page === "addfertilizer" && (<AddFertilizerData setPage={setPage} />)}




        </main>

      </div>
    </>
  );
}