import "./Header.css";
import { useTranslation } from "react-i18next";

export default function Header({ onRefresh, subtitle = "Rangala Estate" }) {
  const { i18n } = useTranslation();

  return (
    <header className="app-header no-print">

      {/* LEFT: Logo + title */}
      <div className="header-left">
        <img src="/logo.png" alt="Logo" className="header-logo" />
        <div className="header-title-wrap">
          <div className="header-app-name">Smart Tea Monitor</div>
          <div className="header-subtitle">{subtitle}</div>
        </div>
      </div>

      {/* RIGHT: Language + refresh */}
      <div className="header-right">

        <div className="language-switcher">
          {[["en","EN"], ["si","සිං"], ["ta","த"]].map(([code, label]) => (
            <button
              key={code}
              className={i18n.language === code ? "active" : ""}
              onClick={() => i18n.changeLanguage(code)}
            >
              {label}
            </button>
          ))}
        </div>

        {onRefresh && (
          <button className="header-refresh-btn" onClick={onRefresh}>Refresh</button>
        )}
      </div>

    </header>
  );
}