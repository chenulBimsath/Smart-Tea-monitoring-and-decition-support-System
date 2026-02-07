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
} from "lucide-react";

export default function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        <SidebarItem
          icon={<LayoutGrid size={18} />}
          label="Dashboard"
          active={page === "dashboard"}
          onClick={() => setPage("dashboard")}
        />

        <SidebarItem
          icon={<MapPin size={18} />}
          label="Field Map"
          active={page === "fieldmap"}
          onClick={() => setPage("fieldmap")}
        />

        <SidebarItem
          icon={<Database size={18} />}
          label="Field Data"
          active={page === "fielddata"}
          onClick={() => setPage("fielddata")}
        />

        <SidebarItem
          icon={<Cloud size={18} />}
          label="Climate Risk"
          active={page === "climate"}
          onClick={() => setPage("climate")}
        />

        <SidebarItem
          icon={<TrendingUp size={18} />}
          label="Yield Prediction"
          active={page === "yield"}
          onClick={() => setPage("yield")}
        />

        <SidebarItem
          icon={<FileText size={18} />}
          label="Reports"
          active={page === "reports"}
          onClick={() => setPage("reports")}
        />
      </div>

      <div className="sidebar-bottom">
        <SidebarItem
  icon={<User size={18} />}
  label="My Profile"
  active={page === "profile"}
  onClick={() => setPage("profile")}
 />


        <SidebarItem icon={<LogOut size={18} />} label="Logout" />
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
