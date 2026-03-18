import { useState, useEffect } from "react";
import "./Header.css";
import { useTranslation } from "react-i18next";

// live clock
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

  //  get i18n (this was missing before)
  const { i18n } = useTranslation();

  return (
    <header className="app-header">

      {/* LEFT SIDE: logo + title */}
      <div className="header-left">
        <img src="/logo.png" alt="Logo" className="header-logo" />

        <div className="header-title-wrap">
          <div className="header-app-name">
            Smart Tea Monitor
          </div>

          <div className="header-subtitle">
            {subtitle}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="header-right">

        {/* CLOCK */}
        <div className="header-clock-wrap">
          <div className="header-clock">
            {now.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>

          <div className="header-date">
            {now.toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>

        {/*  LANGUAGE SWITCH */}
        <div className="language-switcher">

          <button
            className={i18n.language === "en" ? "active" : ""}
            onClick={() => i18n.changeLanguage("en")}
          >
            EN
          </button>

          <button
            className={i18n.language === "si" ? "active" : ""}
            onClick={() => i18n.changeLanguage("si")}
          >
            සිං
          </button>

          <button
            className={i18n.language === "ta" ? "active" : ""}
            onClick={() => i18n.changeLanguage("ta")}
          >
            த
          </button>

        </div>

        {/*  REFRESH BUTTON */}
        {onRefresh && (
          <button
            className="header-refresh-btn"
            onClick={onRefresh}
          >
            Refresh
          </button>
        )}

      </div>

    </header>
  );
}