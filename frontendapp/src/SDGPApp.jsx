import { useState } from "react";
import "./App.css";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";

import FieldMap from "./components/sdgp/FieldMap";
import FieldData from "./components/sdgp/FieldData";
import ClimateRisk from "./components/sdgp/ClimateRisk";

export default function SDGPApp() {
  const [page, setPage] = useState("fieldmap");

  return (
    <>
      <Header />

      <div className="app-layout">
        <Sidebar page={page} setPage={setPage} />

        <main className="app-main">
          {page === "fieldmap" && <FieldMap />}
          {page === "fielddata" && <FieldData />}
          {page === "climaterisk" && <ClimateRisk />}
        </main>
      </div>
    </>
  );
}