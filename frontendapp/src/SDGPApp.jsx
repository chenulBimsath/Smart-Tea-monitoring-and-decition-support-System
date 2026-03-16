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

// 1. IMPORT YOUR FINANCE COMPONENT HERE
import FinanceAnalytics from "./components/sdgp/FinanceAnalytics";

// 2. IMPORT YOUR NEW AGRONOMIC DATA COMPONENT HERE
import AgronomicData from "./components/sdgp/AgronomicData";

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

          {/* 3. ADD YOUR NEW AGRONOMIC DATA PAGE CONDITION HERE */}
          {page === "agronomic_data" && (
            <AgronomicData setPage={setPage} />
          )}

          {page === "fertilizerdata" && (
            <FertilizerData setPage={setPage} />
          )}

          {page === "fertilizerrangaladivisions" && (
            <FertilizerRangalaDivisions setPage={setPage} />
          )}

          {page === "rangalafertilizer" && (
            <RangalaFertilizerData setPage={setPage} />
          )}

          {page === "newdivisionfertilizer" && (
            <NewDivisionFertilizerData setPage={setPage} />
          )}

          {page === "addfertilizer" && (
            <AddFertilizerData setPage={setPage} />
          )}

        </main>
      </div>
    </>
  );
}