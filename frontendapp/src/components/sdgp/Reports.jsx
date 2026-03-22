import { useState, useEffect, useRef } from "react";
import "./Reports.css";

const API        = import.meta.env.VITE_API_BASE || "https://api.smartteamonitor.com";
const MONTH_NAMES = ["","January","February","March","April","May","June",
                     "July","August","September","October","November","December"];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt  = (n, dec = 0) => n != null ? Number(n).toLocaleString("en-US", { maximumFractionDigits: dec }) : "—";
const fmtD = (n)          => n != null ? Number(n).toFixed(2) : "—";
const sign = (n)          => n >= 0 ? `+${fmt(n,1)}` : fmt(n,1);
const pct  = (n)          => n != null ? `${sign(n)}%` : "—";
const clr  = (n)          => n == null ? "" : n >= 0 ? "pos" : "neg";

export default function Reports() {
  const now   = new Date();
  const prevM = now.getMonth() === 0 ? 12 : now.getMonth();
  const prevY = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

  const [year,    setYear]    = useState(prevY);
  const [month,   setMonth]   = useState(prevM);
  const [report,  setReport]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const printRef = useRef();

  useEffect(() => { fetchReport(); }, [year, month]);

  async function fetchReport() {
    setLoading(true); setError(null);
    try {
      const r = await fetch(`${API}/api/report/monthly?year=${year}&month=${month}`);
      if (!r.ok) throw new Error(`API error ${r.status}`);
      setReport(await r.json());
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  function handlePrint() {
    if (!report) return;
    // Set document title → browser uses it as the PDF filename
    const estatePart = (report.estateName || "Estate").replace(/\s+/g, "_");
    const prev = document.title;
    document.title = `${report.monthName}_${report.year}_${estatePart}`;
    window.print();
    document.title = prev;
  }

  if (loading) return (
    <div className="rp-page">
      <div className="rp-loading"><div className="rp-spinner"/><p>Generating report...</p></div>
    </div>
  );

  if (error) return (
    <div className="rp-page">
      <div className="rp-error">
        <h3>Could not load report</h3>
        <p>{error}</p>
      </div>
    </div>
  );

  if (!report) return null;

  const r = report;

  return (
    <div className="rp-page">

      {/* ── CONTROLS (hidden on print) ── */}
      <div className="rp-controls no-print">
        <div className="rp-controls-left">
          <select className="rp-select" value={year} onChange={e => setYear(+e.target.value)}>
            {[2021,2022,2023,2024,2025,2026].map(y => <option key={y}>{y}</option>)}
          </select>
          <select className="rp-select" value={month} onChange={e => setMonth(+e.target.value)}>
            {MONTH_NAMES.slice(1).map((m,i) => <option key={i+1} value={i+1}>{m}</option>)}
          </select>
          <button className="rp-btn" onClick={fetchReport}>Generate</button>
        </div>
        <button className="rp-btn rp-btn-pdf" onClick={handlePrint}>
          Download PDF
        </button>
      </div>

      {/* ══ PRINTABLE REPORT ══════════════════════════════════════════════════ */}
      <div className="rp-report" ref={printRef} id="rp-print-area">

        {/* ── COVER HEADER ── */}
        <div className="rp-cover">
          <div className="rp-cover-logo">
            <img src="/logo.png" alt="Logo" />
          </div>
          <div className="rp-cover-center">
            <div className="rp-cover-estate">{r.estateName}</div>
            <div className="rp-cover-title">Monthly Performance Report</div>
            <div className="rp-cover-period">{r.monthName} {r.year}</div>
          </div>
          <div className="rp-cover-meta">
            <div className="rp-cover-meta-row">Generated: {r.generatedAt}</div>
            <div className="rp-cover-meta-row">Smart Tea Monitor</div>
          </div>
        </div>

        {/* ── EXECUTIVE SUMMARY ── */}
        <section className="rp-section">
          <h2 className="rp-section-title">Executive Summary</h2>
          <div className="rp-kpi-grid">
            <div className="rp-kpi">
              <div className="rp-kpi-label">Total Actual Yield</div>
              <div className="rp-kpi-val green">{fmt(r.totalActualYield)} kg</div>
              <div className="rp-kpi-sub">{fmt(r.totalActualYield / 1000, 1)}t · All divisions</div>
            </div>
            <div className="rp-kpi">
              <div className="rp-kpi-label">ML Predicted Yield</div>
              <div className="rp-kpi-val blue">{fmt(r.totalPredictedYield)} kg</div>
              <div className="rp-kpi-sub">{fmt(r.totalPredictedYield / 1000, 1)}t · Random Forest</div>
            </div>
            <div className="rp-kpi">
              <div className="rp-kpi-label">Yield Variance</div>
              <div className={`rp-kpi-val ${clr(r.yieldVariance)}`}>{sign(r.yieldVariance)} kg</div>
              <div className="rp-kpi-sub">{pct(r.yieldVariancePct)} vs prediction</div>
            </div>
            <div className="rp-kpi">
              <div className="rp-kpi-label">Avg Temperature</div>
              <div className="rp-kpi-val amber">{fmtD(r.avgTemperature)}°C</div>
              <div className="rp-kpi-sub">Monthly average</div>
            </div>
            <div className="rp-kpi">
              <div className="rp-kpi-label">Avg Rainfall</div>
              <div className="rp-kpi-val blue">{fmtD(r.avgRainfall)} mm</div>
              <div className="rp-kpi-sub">Monthly average</div>
            </div>
            <div className="rp-kpi">
              <div className="rp-kpi-label">Avg NDVI</div>
              <div className={`rp-kpi-val ${r.avgNdvi >= 0.6 ? "green" : r.avgNdvi >= 0.4 ? "amber" : "neg"}`}>
                {fmtD(r.avgNdvi)}
              </div>
              <div className="rp-kpi-sub">Vegetation health index</div>
            </div>
          </div>
        </section>

        {/* ── DIVISION YIELD TABLE ── */}
        <section className="rp-section">
          <h2 className="rp-section-title">Division-Level Yield Performance</h2>
          <table className="rp-table">
            <thead>
              <tr>
                <th>Division</th>
                <th>Actual Yield</th>
                <th>Predicted</th>
                <th>Variance</th>
                <th>Var %</th>
                <th>Pluckers</th>
                <th>NDVI</th>
                <th>Temp °C</th>
                <th>Rain mm</th>
                <th>Cash/kg</th>
              </tr>
            </thead>
            <tbody>
              {(r.divisionYield || []).map((d, i) => (
                <tr key={i}>
                  <td className="rp-td-name">{d.divisionName}</td>
                  <td><strong>{fmt(d.actual)}</strong></td>
                  <td>{fmt(d.predicted)}</td>
                  <td className={clr(d.variance)}>{sign(d.variance)}</td>
                  <td className={clr(d.variancePct)}>{pct(d.variancePct)}</td>
                  <td>{fmt(d.pluckers)}</td>
                  <td>
                    <span className={`rp-ndvi-badge ${d.ndvi >= 0.6 ? "good" : d.ndvi >= 0.4 ? "mid" : "bad"}`}>
                      {fmtD(d.ndvi)}
                    </span>
                  </td>
                  <td>{fmtD(d.temperature)}</td>
                  <td>{fmtD(d.rainfall)}</td>
                  <td>{fmtD(d.cashKilo)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td><strong>TOTAL</strong></td>
                <td><strong>{fmt(r.totalActualYield)}</strong></td>
                <td><strong>{fmt(r.totalPredictedYield)}</strong></td>
                <td className={clr(r.yieldVariance)}><strong>{sign(r.yieldVariance)}</strong></td>
                <td className={clr(r.yieldVariancePct)}><strong>{pct(r.yieldVariancePct)}</strong></td>
                <td colSpan={5}/>
              </tr>
            </tfoot>
          </table>
        </section>

        {/* ── CLIMATE OVERVIEW ── */}
        <section className="rp-section">
          <h2 className="rp-section-title">Climate &amp; Weather Overview</h2>
          <div className="rp-two-col">
            <div>
              <h3 className="rp-sub-title">Monthly Averages</h3>
              <table className="rp-table rp-table-compact">
                <tbody>
                  <tr><td>Average Temperature</td><td><strong>{fmtD(r.avgTemperature)} °C</strong></td></tr>
                  <tr><td>Average Rainfall</td>   <td><strong>{fmtD(r.avgRainfall)} mm</strong></td></tr>
                  <tr><td>Average Humidity</td>   <td><strong>{fmtD(r.avgHumidity)} %</strong></td></tr>
                  <tr><td>Average NDVI</td>        <td><strong>{fmtD(r.avgNdvi)}</strong></td></tr>
                </tbody>
              </table>
            </div>
            {r.dailyWeather?.length > 0 && (
              <div>
                <h3 className="rp-sub-title">Daily Weather Log ({r.dailyWeather.length} records)</h3>
                <div className="rp-scroll-table">
                  <table className="rp-table rp-table-compact">
                    <thead>
                      <tr><th>Date</th><th>Division</th><th>Temp</th><th>Rain</th><th>Humidity</th><th>NDVI</th></tr>
                    </thead>
                    <tbody>
                      {r.dailyWeather.slice(0, 15).map((w, i) => (
                        <tr key={i}>
                          <td>{w.record_date}</td>
                          <td>{w.division}</td>
                          <td>{fmtD(w.temperature)}°</td>
                          <td>{fmtD(w.rainfall)}</td>
                          <td>{fmtD(w.humidity)}%</td>
                          <td>{fmtD(w.ndvi_value)}</td>
                        </tr>
                      ))}
                      {r.dailyWeather.length > 15 && (
                        <tr><td colSpan={6} className="rp-td-more">
                          + {r.dailyWeather.length - 15} more records
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── FINANCIAL ── */}
        {(r.totalRevenue != null || r.totalExpenses != null) && (
          <section className="rp-section">
            <h2 className="rp-section-title">Financial Summary</h2>
            <div className="rp-kpi-grid rp-kpi-grid-3">
              <div className="rp-kpi">
                <div className="rp-kpi-label">Total Revenue</div>
                <div className="rp-kpi-val green">Rs. {fmt(r.totalRevenue)}</div>
              </div>
              <div className="rp-kpi">
                <div className="rp-kpi-label">Total Expenses</div>
                <div className="rp-kpi-val neg">Rs. {fmt(r.totalExpenses)}</div>
              </div>
              <div className="rp-kpi">
                <div className="rp-kpi-label">Net Profit / Loss</div>
                <div className={`rp-kpi-val ${clr(r.netProfitLoss)}`}>Rs. {fmt(r.netProfitLoss)}</div>
              </div>
              {r.nsa != null && <div className="rp-kpi">
                <div className="rp-kpi-label">NSA (Net Sales Avg)</div>
                <div className="rp-kpi-val blue">Rs. {fmtD(r.nsa)}</div>
              </div>}
              {r.cop != null && <div className="rp-kpi">
                <div className="rp-kpi-label">COP (Cost of Production)</div>
                <div className="rp-kpi-val amber">Rs. {fmtD(r.cop)}</div>
              </div>}
              {r.pluckingCost != null && <div className="rp-kpi">
                <div className="rp-kpi-label">Plucking Cost</div>
                <div className="rp-kpi-val amber">Rs. {fmtD(r.pluckingCost)}</div>
              </div>}
            </div>

            {r.financialTransactions?.length > 0 && (
              <>
                <h3 className="rp-sub-title" style={{marginTop:20}}>Transaction Breakdown</h3>
                <table className="rp-table">
                  <thead>
                    <tr><th>Type</th><th>Category</th><th>Amount (Rs.)</th></tr>
                  </thead>
                  <tbody>
                    {r.financialTransactions.map((t, i) => (
                      <tr key={i}>
                        <td>
                          <span className={`rp-type-badge ${t.transaction_type === "Income" ? "income" : "expense"}`}>
                            {t.transaction_type}
                          </span>
                        </td>
                        <td>{t.category}</td>
                        <td className={t.transaction_type === "Income" ? "pos" : "neg"}>
                          {fmt(t.total_amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </section>
        )}

        {/* ── FERTILIZER ── */}
        {r.fertilizerApplications?.length > 0 && (
          <section className="rp-section">
            <h2 className="rp-section-title">Fertilizer Applications</h2>
            <div className="rp-kpi-grid rp-kpi-grid-2">
              <div className="rp-kpi">
                <div className="rp-kpi-label">Total Fertilizer Applied</div>
                <div className="rp-kpi-val green">{fmt(r.totalFertilizerKg, 1)} kg</div>
              </div>
              <div className="rp-kpi">
                <div className="rp-kpi-label">Application Records</div>
                <div className="rp-kpi-val blue">{r.fertilizerApplications.length}</div>
              </div>
            </div>
            <table className="rp-table">
              <thead>
                <tr><th>Division</th><th>Fertilizer Type</th><th>Quantity (kg)</th><th>YPH Month</th><th>YPH To Date</th></tr>
              </thead>
              <tbody>
                {r.fertilizerApplications.map((f, i) => (
                  <tr key={i}>
                    <td>{f.division_name}</td>
                    <td>{f.fertilizer_type}</td>
                    <td>{fmtD(f.quantity_kg)}</td>
                    <td>{f.yph_month ?? "—"}</td>
                    <td>{f.yph_todate ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* ── AGRONOMIC ── */}
        {r.agronomicData?.length > 0 && (
          <section className="rp-section">
            <h2 className="rp-section-title">Agronomic Field Inspections</h2>
            <div className="rp-kpi-grid rp-kpi-grid-2">
              <div className="rp-kpi">
                <div className="rp-kpi-label">Avg Leaf Quality</div>
                <div className="rp-kpi-val green">{fmtD(r.avgLeafQuality)}</div>
              </div>
              <div className="rp-kpi">
                <div className="rp-kpi-label">Avg Soil pH</div>
                <div className="rp-kpi-val blue">{fmtD(r.avgSoilPh)}</div>
              </div>
            </div>
            <table className="rp-table">
              <thead>
                <tr><th>Field No</th><th>Clone Type</th><th>Leaf Quality</th><th>Soil pH</th><th>Pest/Disease</th><th>Weed Density</th><th>Inspected By</th></tr>
              </thead>
              <tbody>
                {r.agronomicData.map((a, i) => (
                  <tr key={i}>
                    <td>{a.field_no}</td>
                    <td>{a.clone_type}</td>
                    <td>{fmtD(a.leaf_quality)}</td>
                    <td>{fmtD(a.soil_ph)}</td>
                    <td>{a.pest_disease || "—"}</td>
                    <td>{a.weed_density || "—"}</td>
                    <td>{a.inspected_by || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* ── FOOTER ── */}
        <div className="rp-footer">
          <div>Smart Tea Monitoring &amp; Decision Support System</div>
          <div>{r.monthName} {r.year} · {r.estateName} · Generated {r.generatedAt}</div>
        </div>

      </div>
    </div>
  );
}