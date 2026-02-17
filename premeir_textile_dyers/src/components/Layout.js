import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, FlaskConical, Palette, ChevronLeft, Bell, User, Search, Calendar, History } from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Settings, label: 'Machine Data', path: '/machine-data' },
    { icon: FlaskConical, label: 'Dyes & Chemicals', path: '/dyes-chemicals' },
    { icon: Palette, label: 'Color Inspection', path: '/color-inspection' },
    { icon: Calendar, label: 'Production Schedule', path: '/production-schedule' },
    { icon: Bell, label: 'Alerts', path: '/alerts' },
    { icon: History, label: 'Batch History', path: '/batch-history' }
  ];

  return (
    <div className="layout">
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <FlaskConical size={24} />
            </div>
            {!isSidebarCollapsed && (
              <div className="logo-text">
                <div className="company-name">PREMIER</div>
                <div className="company-subtitle">TEXTILE DYERS</div>
              </div>
            )}
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
                title={item.label}
              >
                <Icon size={20} />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <button
          className="sidebar-toggle"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          <ChevronLeft size={20} className={isSidebarCollapsed ? 'rotated' : ''} />
        </button>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="search-bar">
            <Search size={20} />
            <input type="text" placeholder="Search..." />
          </div>

          <div className="header-actions">
            <button className="icon-button" onClick={() => navigate('/alerts')}>
              <Bell size={20} />
              <span className="notification-badge">4</span>
            </button>
            <button className="icon-button user-button">
              <User size={20} />
            </button>
          </div>
        </header>

        <div className="content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
