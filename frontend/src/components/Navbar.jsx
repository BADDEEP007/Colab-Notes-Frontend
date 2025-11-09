import { useState } from 'react';
import styles from './Navbar.module.css';
import clsx from 'clsx';

export default function Navbar({ onSidebarToggle, onChatbotToggle }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <div className={styles.navLogo}>
          <a href="/">ColabNotes</a>
        </div>

        {/* Navigation Links */}
        <ul className={clsx(styles.navMenu, isMenuOpen && 'active')}>
          <li className={styles.navItem}>
            <a href="/" className={styles.navLink}>
              Home
            </a>
          </li>
          <li className={styles.navItem}>
            <a href="/about" className={styles.navLink}>
              About
            </a>
          </li>
          <li className={styles.navItem}>
            <a href="/contact" className={styles.navLink}>
              Contact
            </a>
          </li>
          <li className={styles.navItem}>
            <a href="/notes" className={styles.navLink}>
              Notes
            </a>
          </li>
        </ul>

        {/* Action Buttons */}
        <div className={styles.navActions}>
          <button
            className={clsx(styles.navBtn, styles.chatbotBtn)}
            onClick={onChatbotToggle}
            title="Open Chatbot"
          >
            💬
          </button>
          <button className={styles.navBtn} onClick={onSidebarToggle} title="Open Menu">
            ☰
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className={clsx(styles.navToggle, isMenuOpen && 'active')} onClick={toggleMenu}>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </div>
      </div>
    </nav>
  );
}
