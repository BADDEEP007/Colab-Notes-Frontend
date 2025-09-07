import { useState } from "react";
import "./Navbar.css";

export default function Navbar({ onSidebarToggle, onChatbotToggle }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <a href="/">ColabNotes</a>
        </div>

        {/* Navigation Links */}
        <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <li className="nav-item">
            <a href="/" className="nav-link">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a href="/about" className="nav-link">
              About
            </a>
          </li>
          <li className="nav-item">
            <a href="/contact" className="nav-link">
              Contact
            </a>
          </li>
          <li className="nav-item">
            <a href="/notes" className="nav-link">
              Notes
            </a>
          </li>
        </ul>

        {/* Action Buttons */}
        <div className="nav-actions">
          <button
            className="nav-btn chatbot-btn"
            onClick={onChatbotToggle}
            title="Open Chatbot"
          >
            💬
          </button>
          <button
            className="nav-btn sidebar-btn"
            onClick={onSidebarToggle}
            title="Open Menu"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div
          className={`nav-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
}
