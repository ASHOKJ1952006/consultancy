import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, AlertCircle, Settings as SettingsIcon, X } from 'lucide-react';
import { alertAPI } from '../services/api';
import './Alerts.css';

const Alerts = () => {
  const [filter, setFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch alerts on component mount
  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await alertAPI.getAll();
      setAlerts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !alert.read;
    return alert.type === filter;
  });

  const unreadCount = alerts.filter(a => !a.read).length;
  const criticalAlerts = alerts.filter(a => a.type === 'critical').length;
  const warningAlerts = alerts.filter(a => a.type === 'warning').length;

  if (loading) {
    return <div className="alerts"><div className="page-header"><h1>Loading alerts...</h1></div></div>;
  }

  if (error) {
    return <div className="alerts"><div className="page-header"><h1>Error: {error}</h1></div></div>;
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      case 'info':
        return <CheckCircle size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const getAlertClass = (type) => {
    switch (type) {
      case 'critical':
        return 'alert-critical';
      case 'warning':
        return 'alert-warning';
      case 'info':
        return 'alert-info';
      default:
        return '';
    }
  };

  const getCategoryBadge = (category) => {
    const badges = {
      inventory: { label: 'Inventory', color: '#8b5cf6' },
      machine: { label: 'Machine', color: '#3b82f6' },
      quality: { label: 'Quality', color: '#ec4899' },
      production: { label: 'Production', color: '#10b981' },
      maintenance: { label: 'Maintenance', color: '#f59e0b' }
    };
    return badges[category] || { label: category, color: '#6b7280' };
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="alerts-page">
      <div className="page-header">
        <div>
          <h1>Alerts & Notifications</h1>
          <p className="page-subtitle">Monitor system alerts and critical notifications</p>
        </div>
        <button className="settings-button" onClick={() => setShowSettings(true)}>
          <SettingsIcon size={20} />
          Settings
        </button>
      </div>

      {/* Summary Stats */}
      <div className="alerts-summary">
        <div className="summary-card">
          <div className="summary-icon blue">
            <Bell size={24} />
          </div>
          <div className="summary-info">
            <p className="summary-label">Unread Alerts</p>
            <h3 className="summary-value">{unreadCount}</h3>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon red">
            <AlertTriangle size={24} />
          </div>
          <div className="summary-info">
            <p className="summary-label">Critical</p>
            <h3 className="summary-value">{criticalAlerts}</h3>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon orange">
            <AlertCircle size={24} />
          </div>
          <div className="summary-info">
            <p className="summary-label">Warnings</p>
            <h3 className="summary-value">{warningAlerts}</h3>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon green">
            <CheckCircle size={24} />
          </div>
          <div className="summary-info">
            <p className="summary-label">Resolved Today</p>
            <h3 className="summary-value">12</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="alerts-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Alerts
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button
          className={`filter-btn ${filter === 'critical' ? 'active' : ''}`}
          onClick={() => setFilter('critical')}
        >
          Critical
        </button>
        <button
          className={`filter-btn ${filter === 'warning' ? 'active' : ''}`}
          onClick={() => setFilter('warning')}
        >
          Warnings
        </button>
        <button
          className={`filter-btn ${filter === 'info' ? 'active' : ''}`}
          onClick={() => setFilter('info')}
        >
          Info
        </button>
      </div>

      {/* Alerts List */}
      <div className="alerts-container">
        {filteredAlerts.map((alert) => {
          const categoryBadge = getCategoryBadge(alert.category);
          return (
            <div key={alert._id} className={`alert-item ${getAlertClass(alert.type)} ${alert.read ? 'read' : 'unread'}`}>
              <div className="alert-icon">
                {getAlertIcon(alert.type)}
              </div>
              <div className="alert-content">
                <div className="alert-header">
                  <h4>{alert.title}</h4>
                  <span
                    className="category-badge"
                    style={{ background: `${categoryBadge.color}15`, color: categoryBadge.color }}
                  >
                    {categoryBadge.label}
                  </span>
                </div>
                <p className="alert-message">{alert.message}</p>
                <div className="alert-footer">
                  <span className="alert-time">{formatTime(alert.createdAt)}</span>
                  {alert.actionable && (
                    <button className="action-link">Take Action →</button>
                  )}
                </div>
              </div>
              {!alert.read && <div className="unread-indicator"></div>}
            </div>
          );
        })}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Notification Settings</h2>
              <button className="close-btn" onClick={() => setShowSettings(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="settings-section">
              <h3>Alert Categories</h3>
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <span>Inventory Alerts</span>
                    <p>Low stock and reorder notifications</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <span>Machine Alerts</span>
                    <p>Machine status and efficiency warnings</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <span>Quality Alerts</span>
                    <p>Color inspection and quality issues</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <span>Production Alerts</span>
                    <p>Production targets and batch updates</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <span>Maintenance Alerts</span>
                    <p>Scheduled maintenance reminders</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h3>Notification Preferences</h3>
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <span>Email Notifications</span>
                    <p>Receive alerts via email</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <span>Sound Alerts</span>
                    <p>Play sound for critical alerts</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
