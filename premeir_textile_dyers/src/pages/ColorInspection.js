import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Plus, Search, Eye, CheckCircle, Clock, XCircle } from 'lucide-react';
import { inspectionAPI } from '../services/api';
import './ColorInspection.css';

const ColorInspection = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const inspectionData = [
    { name: 'Approved', value: 10, color: '#10b981' },
    { name: 'Pending', value: 2, color: '#fbbf24' },
    { name: 'Rejected', value: 3, color: '#ef4444' }
  ];

  // Fetch inspections on component mount
  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    try {
      setLoading(true);
      const response = await inspectionAPI.getAll();
      setInspections(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching inspections:', err);
      setError('Failed to load inspections');
    } finally {
      setLoading(false);
    }
  };

  const filteredInspections = inspections.filter(item => {
    if (activeFilter === 'all') return true;
    return item.status === activeFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'rejected': return <XCircle size={16} />;
      default: return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getDeltaEClass = (deltaE) => {
    if (!deltaE) return '';
    if (deltaE <= 1) return 'delta-good';
    if (deltaE <= 2) return 'delta-warning';
    return 'delta-bad';
  };

  if (loading) {
    return <div className="color-inspection"><div className="page-header"><h1>Loading inspections...</h1></div></div>;
  }

  if (error) {
    return <div className="color-inspection"><div className="page-header"><h1>Error: {error}</h1></div></div>;
  }

  const totalInspections = inspections.length;
  const approvalRate = Math.round((inspections.filter(i => i.status === 'approved').length / totalInspections) * 100);
  const avgDeltaE = (inspections.filter(i => i.deltaE).reduce((sum, i) => sum + i.deltaE, 0) / inspections.filter(i => i.deltaE).length).toFixed(2);
  const pendingReview = inspections.filter(i => i.status === 'pending').length;

  return (
    <div className="color-inspection">
      <div className="page-header">
        <div>
          <h1>Color Inspection</h1>
          <p className="page-subtitle">Lab dip approvals and quality control tracking</p>
        </div>
        <button className="new-inspection-button">
          <Plus size={20} />
          New Inspection
        </button>
      </div>

      {/* Summary Stats */}
      <div className="inspection-stats">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Eye size={24} />
          </div>
          <div className="stat-details">
            <p className="stat-label">Total Inspections</p>
            <h3 className="stat-number">{totalInspections}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-details">
            <p className="stat-label">Approval Rate</p>
            <h3 className="stat-number">{approvalRate}%</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <span className="delta-symbol">ΔE</span>
          </div>
          <div className="stat-details">
            <p className="stat-label">Avg Delta E</p>
            <h3 className="stat-number">{avgDeltaE}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper orange">
            <Clock size={24} />
          </div>
          <div className="stat-details">
            <p className="stat-label">Pending Review</p>
            <h3 className="stat-number">{pendingReview}</h3>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="inspection-content">
        {/* Pie Chart */}
        <div className="chart-card">
          <h3 className="section-title">Inspection Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={inspectionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {inspectionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Inspection Table */}
        <div className="table-card">
          <div className="table-header">
            <div className="filter-tabs">
              <button
                className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-tab ${activeFilter === 'approved' ? 'active' : ''}`}
                onClick={() => setActiveFilter('approved')}
              >
                Approved
              </button>
              <button
                className={`filter-tab ${activeFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveFilter('pending')}
              >
                Pending
              </button>
              <button
                className={`filter-tab ${activeFilter === 'rejected' ? 'active' : ''}`}
                onClick={() => setActiveFilter('rejected')}
              >
                Rejected
              </button>
            </div>

            <div className="search-input">
              <Search size={18} />
              <input type="text" placeholder="Search colors..." />
            </div>
          </div>

          <div className="table-container">
            <table className="inspection-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Color</th>
                  <th>Client</th>
                  <th>Lot No.</th>
                  <th>ΔE</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredInspections.map((item, index) => (
                  <tr key={index}>
                    <td className="date-cell">
                      📅 {item.date}
                    </td>
                    <td className="color-cell">
                      <div className="color-indicator">
                        <span className="color-dot"></span>
                        <span>{item.color}</span>
                      </div>
                    </td>
                    <td>{item.client}</td>
                    <td className="lot-cell">{item.lotNo}</td>
                    <td>
                      {item.deltaE ? (
                        <span className={`delta-value ${getDeltaEClass(item.deltaE)}`}>
                          {item.deltaE}
                        </span>
                      ) : (
                        <span className="no-data">—</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(item.status)}`}>
                        {getStatusIcon(item.status)}
                        {getStatusText(item.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorInspection;
