import "./Header.css";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { i18n } = useTranslation();

  return (
    <header className="app-header">
      <div className="header-left">
        <img
          src="/logo.png"
          alt="Logo"
          className="header-logo"
        />
      </div>

      <div className="header-right">
        {/* LANGUAGE SWITCH */}
        <div className="language-switcher">
          <button onClick={() => i18n.changeLanguage("en")}>EN</button>
          <button onClick={() => i18n.changeLanguage("si")}>සිං</button>
          <button onClick={() => i18n.changeLanguage("ta")}>த</button>
        </div>
      </div>
    </header>
  );
}