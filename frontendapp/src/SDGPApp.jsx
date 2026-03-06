import { useState } from "react";
import "./App.css";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";

import FieldMap from "./components/sdgp/FieldMap";
import FieldData from "./components/sdgp/FieldData";
import ClimateRisk from "./components/sdgp/ClimateRisk";
import RangalaData from "./components/sdgp/RangalaData";
import RangalaDivisions from "./components/sdgp/RangalaDivisions";
import NewDivisionData from "./components/sdgp/NewDivisionData";
import AddFieldData from "./components/sdgp/AddFieldData";

export default function SDGPApp() {

  const [page, setPage] = useState("fieldmap");

  return (
    <>
      <Header />

      <div className="app-layout">

        <Sidebar page={page} setPage={setPage} />

        <main className="app-main">

          {page === "fieldmap" && <FieldMap />}
          {page === "fielddata" && <FieldData setPage={setPage} />}
          {page === "climaterisk" && <ClimateRisk />}
          {page === "rangaladivisions" && (<RangalaDivisions setPage={setPage} />)}
          {page === "rangaladata" && (<RangalaData setPage={setPage} />)}
          {page === "newdivisiondata" && (<NewDivisionData setPage={setPage} />)}
          {page === "addfield" && (<AddFieldData setPage={setPage} />)}

        </main>

      </div>
    </>
  );
}