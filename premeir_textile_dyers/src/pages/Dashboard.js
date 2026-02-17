import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import { Settings, TrendingUp, FlaskConical, Palette, AlertTriangle } from 'lucide-react';
import { batchAPI, machineAPI, inventoryAPI, inspectionAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    batchStats: null,
    machineStats: null,
    inventoryAlerts: [],
    inspectionStats: null
  });

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [batchStats, machineStats, inventoryAlerts, inspectionStats] = await Promise.all([
        batchAPI.getStats(),
        machineAPI.getStats(),
        inventoryAPI.getAlerts(),
        inspectionAPI.getStats()
      ]);

      setDashboardData({
        batchStats: batchStats.data,
        machineStats: machineStats.data,
        inventoryAlerts: inventoryAlerts.data,
        inspectionStats: inspectionStats.data
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const weeklyProductionData = [
    { day: 'Mon', production: 350, target: 400 },
    { day: 'Tue', production: 420, target: 400 },
    { day: 'Wed', production: 390, target: 400 },
    { day: 'Thu', production: 520, target: 400 },
    { day: 'Fri', production: 490, target: 400 },
    { day: 'Sat', production: 320, target: 400 },
    { day: 'Sun', production: 380, target: 400 }
  ];

  const stockAlerts = [
    { name: 'Red F3B (Divine)', current: 194, max: 250, percentage: 78, status: 'low' },
    { name: 'RED RR (Divine)', current: 103, max: 150, percentage: 69, status: 'critical' },
    { name: 'Softner Cakes (1:15)', current: 75, max: 100, percentage: 75, status: 'critical' }
  ];

  if (loading) {
    return <div className="dashboard"><div className="page-header"><h1>Loading dashboard...</h1></div></div>;
  }

  if (error) {
    return <div className="dashboard"><div className="page-header"><h1>Error: {error}</h1></div></div>;
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Premier Textile Dyers - Data Analytics Overview</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-info">
              <p className="kpi-label">Machines Running</p>
              <h2 className="kpi-value">3/5</h2>
              <p className="kpi-meta">2 machines idle or in maintenance</p>
            </div>
            <div className="kpi-icon blue">
              <Settings size={24} />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-info">
              <p className="kpi-label">Weekly Production</p>
              <h2 className="kpi-value">2,770 kg</h2>
              <p className="kpi-meta positive">
                <TrendingUp size={14} /> +12% from last week
              </p>
            </div>
            <div className="kpi-icon green">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-info">
              <p className="kpi-label">Dyes in Stock</p>
              <h2 className="kpi-value">42</h2>
              <p className="kpi-meta warning">4 items below minimum</p>
            </div>
            <div className="kpi-icon orange">
              <FlaskConical size={24} />
            </div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="kpi-info">
              <p className="kpi-label">Colors Inspected</p>
              <h2 className="kpi-value">28</h2>
              <p className="kpi-meta negative">-5% from last week</p>
            </div>
            <div className="kpi-icon purple">
              <Palette size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Weekly Production Chart */}
        <div className="chart-card large">
          <div className="card-header">
            <div>
              <h3>Weekly Production</h3>
              <p className="card-subtitle">Fabric output in kg</p>
            </div>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-dot production"></span> Production
              </span>
              <span className="legend-item">
                <span className="legend-dot target"></span> Target
              </span>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyProductionData}>
                <defs>
                  <linearGradient id="productionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '10px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="production"
                  stroke="#1e3a5f"
                  strokeWidth={2}
                  fill="url(#productionGradient)"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#ff9500"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="chart-card">
          <div className="card-header">
            <div>
              <h3>
                <AlertTriangle size={20} className="warning-icon" />
                Stock Alerts
              </h3>
              <p className="card-subtitle">Low inventory items</p>
            </div>
            <span className="alert-badge">4 items</span>
          </div>
          <div className="stock-alerts">
            {stockAlerts.map((item, index) => (
              <div key={index} className="stock-alert-item">
                <div className="alert-icon">
                  <FlaskConical size={18} />
                </div>
                <div className="alert-content">
                  <div className="alert-header">
                    <span className="alert-name">{item.name}</span>
                    <span className={`alert-status ${item.status}`}>
                      {item.status === 'critical' ? 'Critical' : 'Low'}
                    </span>
                  </div>
                  <div className="alert-details">
                    <span className="alert-quantity">{item.current} / {item.max} kg</span>
                    <span className="alert-percentage">{item.percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${item.status}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
