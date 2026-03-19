import { useState } from "react";
import "./App.css";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";

import Dashboard from "./components/sdgp/Dashboard";
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
import AddFertilizerData from "./components/sdgp/AddFertilizerData";

import YieldPrediction from "./components/sdgp/YieldPrediction";

import CropYields from "./components/sdgp/CropYields";
import FertilizerAnalytics from "./components/sdgp/FertilizerAnalytics";
import FinanceAnalytics from "./components/sdgp/FinanceAnalytics";
import AgronomicData from "./components/sdgp/AgronomicData";

// --- IMPORT NEW DIVISION COMPONENTS HERE ---
import NewDivCropYields from "./components/sdgp/NewDivCropYields";
import NewDivFertilizer from "./components/sdgp/NewDivFertilizer"; 
import NewDivFinancials from "./components/sdgp/NewDivFinancials";
import NewDivAgronomic from "./components/sdgp/NewDivAgronomic";


export default function SDGPApp() {
  const [page, setPage] = useState("fieldmap");

  return (
    <>
      <Header />

      <div className="app-layout">
        <Sidebar page={page} setPage={setPage} />

        <main className="app-main">

          {page === "dashboard" && <Dashboard />}

          {page === "fieldmap" && <FieldMap />}

          {page === "fielddata" && (
            <FieldData setPage={setPage} />
          )}

          {page === "climaterisk" && <ClimateRisk />}

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

          {page === "crop_yields" && (
            <CropYields setPage={setPage} />
          )}

          {page === "yield_prediction" && (
            <YieldPrediction setPage={setPage} />
          )}

          {page === "fertilizer_analytics" && (
            <FertilizerAnalytics setPage={setPage} />
          )}

          {page === "financials" && (
            <FinanceAnalytics setPage={setPage} />
          )}

          {page === "agronomic_data" && (
            <AgronomicData setPage={setPage} />
          )}

         

          {page === "fertilizerrangaladivisions" && (
            <FertilizerRangalaDivisions setPage={setPage} />
          )}

          {page === "rangalafertilizer" && (
            <RangalaFertilizerData setPage={setPage} />
          )}

          {page === "fertilizerdata" && (
            <FertilizerData setPage={setPage} />
          )}

          {page === "newdivisionfertilizer" && (
            <NewDivisionFertilizerData setPage={setPage} />
          )}

          {page === "addfertilizer" && (
            <AddFertilizerData setPage={setPage} />
          )}

          {/* ========================================== */}
          {/* NEW DIVISION TARGET PAGES                  */}
          {/* ========================================== */}

          {page === "new_div_crop_yields" && (
            <NewDivCropYields setPage={setPage} />
          )}

          {page === "new_div_fertilizer" && (
            <NewDivFertilizer setPage={setPage} />
          )}

          {/* This is now active and safe since the import is above */}
          {page === "new_div_financials" && (
            <NewDivFinancials setPage={setPage} />
          )}

       
          {page === "new_div_agronomic" && (
            <NewDivAgronomic setPage={setPage} />
          )}

        </main>
      </div>
    </>
  );
}
