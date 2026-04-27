import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Activity, Play, FileText, LayoutDashboard, Info, Menu, X, History, Cpu } from 'lucide-react';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-container" style={{ flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <header className="header glass-panel">
        <div className="header-content">
          <div className="sidebar-brand" style={{ marginBottom: 0 }}>
            <Activity size={24} color="var(--primary)" />
            <span>FlowPilot</span>
          </div>
          
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <NavLink to="/" onClick={() => setMenuOpen(false)} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/record" onClick={() => setMenuOpen(false)} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
              <Play size={18} /> Recorder
            </NavLink>
            <NavLink to="/reports" onClick={() => setMenuOpen(false)} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
              <FileText size={18} /> Reports
            </NavLink>
            <NavLink to="/about" onClick={() => setMenuOpen(false)} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
              <Info size={18} /> About Us
            </NavLink>
            <NavLink to="/timeline" onClick={() => setMenuOpen(false)} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
              <History size={18} /> Timeline
            </NavLink>
            <NavLink to="/tech" onClick={() => setMenuOpen(false)} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
              <Cpu size={18} /> Tech Stack
            </NavLink>
          </nav>
        </div>
      </header>
      
      <main className="main-content" style={{ flex: 1, overflowY: 'auto', padding: '2rem 1rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', flex: '1 0 auto' }}>
          <Outlet />
        </div>
        <footer style={{ textAlign: 'center', padding: '2rem 0 1rem', color: 'var(--text-muted)', fontSize: '0.9rem', flexShrink: 0 }}>
          Developed by <strong style={{ color: 'var(--primary)' }}>Zain Shahid</strong> &copy; {new Date().getFullYear()} FlowPilot
        </footer>
      </main>
    </div>
  );
}
