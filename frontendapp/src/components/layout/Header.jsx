import { useState, useEffect } from "react";
import "./Header.css";
import { useTranslation } from "react-i18next";

function useClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function Header({ onRefresh, subtitle = "Rangala Estate" }) {
  const now = useClock();
  const { i18n } = useTranslation();

  return (
    <header className="app-header">

      {/* LEFT: Logo + title */}
      <div className="header-left">
        <img src="/logo.png" alt="Logo" className="header-logo" />
        <div className="header-title-wrap">
          <div className="header-app-name">Smart Tea Monitor</div>
          <div className="header-subtitle">{subtitle}</div>
        </div>
      </div>

      {/* RIGHT: Clock + language + refresh */}
      <div className="header-right">
        <div className="header-clock-wrap">
          <div className="header-clock">
            {now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
          <div className="header-date">
            {now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
          </div>
        </div>

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
