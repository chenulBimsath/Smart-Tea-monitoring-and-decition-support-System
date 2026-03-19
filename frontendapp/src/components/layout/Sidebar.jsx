import "./Sidebar.css";
import {
  LayoutGrid,
  MapPin,
  Database,
  Cloud,
  TrendingUp,
  FileText,
  User,
  LogOut,
  Leaf
} from "lucide-react";

import { useTranslation } from "react-i18next"; // ✅ ADD

export default function Sidebar({ page, setPage }) {
  const { t } = useTranslation(); // ✅ ADD

  return (
    <aside className="sidebar no-print">

      <div className="sidebar-menu">

        <SidebarItem
          icon={<LayoutGrid size={18} />}
          label={t("dashboard")}
          active={page === "dashboard"}
          onClick={() => setPage("dashboard")}
        />

        <SidebarItem
          icon={<MapPin size={18} />}
          label={t("fieldMap")}
          active={page === "fieldmap"}
          onClick={() => setPage("fieldmap")}
        />

        <SidebarItem
          icon={<Database size={18} />}
          label={t("fieldData")}
          active={page === "fielddata"}
          onClick={() => setPage("fielddata")}
        />

        

        <SidebarItem
          icon={<Cloud size={18} />}
          label={t("climateRisk")}
          active={page === "climaterisk"}
          onClick={() => setPage("climaterisk")}
        />

        <SidebarItem
          icon={<TrendingUp size={18} />}
          label={t("yieldPrediction")}
          active={page === "yield_prediction"}
          onClick={() => setPage("yield_prediction")}
        />

        <SidebarItem
          icon={<FileText size={18} />}
          label={t("reports")}
          active={page === "reports"}
          onClick={() => setPage("reports")}
        />

      </div>

      <div className="sidebar-bottom">

        <SidebarItem
          icon={<User size={18} />}
          label={t("myProfile")}
          active={page === "profile"}
          onClick={() => setPage("profile")}
        />

        <SidebarItem
          icon={<LogOut size={18} />}
          label={t("logout")}
        />

      </div>

    </aside>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div
      className={`sidebar-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="sidebar-icon">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
