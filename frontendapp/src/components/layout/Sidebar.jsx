import "./Sidebar.css";
import { useState, useEffect } from "react";
import {
  LayoutGrid, MapPin, Database, Cloud,
  TrendingUp, FileText, User, LogOut, X, Menu
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ page, setPage }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Close sidebar when page changes
  useEffect(() => { setOpen(false); }, [page]);

  // Close when clicking outside on mobile
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!e.target.closest(".sidebar") && !e.target.closest(".sidebar-hamburger"))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const nav = (p) => {
    setPage(p);
    setOpen(false);
  };

  const handleLogout = () => {
    // Clear auth/session data
    localStorage.clear();

    // Redirect to landing page
    navigate("/"); // change to "/landing" if needed
  };

  return (
    <>
      {/* Hamburger — visible only on mobile */}
      <button
        className="sidebar-hamburger no-print"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Backdrop overlay on mobile */}
      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}

      <aside className={`sidebar no-print${open ? " sidebar-open" : ""}`}>

        {/* X button inside panel on mobile */}
        <button
          className="sidebar-close-btn"
          onClick={() => setOpen(false)}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="sidebar-menu">
          <SidebarItem icon={<LayoutGrid size={18}/>} label={t("dashboard")}      active={page==="dashboard"}        onClick={() => nav("dashboard")} />
          <SidebarItem icon={<MapPin size={18}/>}     label={t("fieldMap")}        active={page==="fieldmap"}         onClick={() => nav("fieldmap")} />
          <SidebarItem icon={<Database size={18}/>}   label={t("fieldData")}       active={page==="fielddata"}        onClick={() => nav("fielddata")} />
          <SidebarItem icon={<Cloud size={18}/>}      label={t("climateRisk")}     active={page==="climaterisk"}      onClick={() => nav("climaterisk")} />
          <SidebarItem icon={<TrendingUp size={18}/>} label={t("yieldPrediction")} active={page==="yield_prediction"} onClick={() => nav("yield_prediction")} />
          <SidebarItem icon={<FileText size={18}/>}   label={t("reports")}         active={page==="reports"}          onClick={() => nav("reports")} />
        </div>

        <div className="sidebar-bottom">
          <SidebarItem
            icon={<User size={18}/>}
            label={t("myProfile")}
            active={page==="profile"}
            onClick={() => nav("profile")}
          />

          <SidebarItem
            icon={<LogOut size={18}/>}
            label={t("logout")}
            onClick={handleLogout}
          />
        </div>

      </aside>
    </>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div
      className={`sidebar-item${active ? " active" : ""}`}
      onClick={onClick}
    >
      <span className="sidebar-icon">{icon}</span>
      <span>{label}</span>
    </div>
  );
}