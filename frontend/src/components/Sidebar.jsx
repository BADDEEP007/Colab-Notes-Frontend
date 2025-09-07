import { useState } from 'react'
import './Sidebar.css'

export default function Sidebar({ isOpen, onToggle }) {

  return (
    <>


      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="close-btn" onClick={onToggle}>
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li><a href="/">Dashboard</a></li>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/notes">My Notes</a></li>
            <li><a href="/shared">Shared Notes</a></li>
            <li><a href="/classes">Classes</a></li>
            <li><a href="/settings">Settings</a></li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">👤</div>
            <div className="user-details">
              <span className="username">John Doe</span>
              <span className="status">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onToggle}></div>}
    </>
  )
}