import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Plus, Search, Eye, CheckCircle, Clock, XCircle, Edit2 } from 'lucide-react';
import { inspectionAPI } from '../services/api';
import './ColorInspection.css';

const ColorInspection = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    color: '',
    client: '',
    lotNo: '',
    deltaE: '',
    status: 'pending',
    notes: ''
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        deltaE: formData.deltaE ? parseFloat(formData.deltaE) : undefined
      };

      if (isEditing && editingId) {
        // Update existing inspection
        await inspectionAPI.update(editingId, submitData);
      } else {
        // Create new inspection
        await inspectionAPI.create(submitData);
      }

      setShowModal(false);
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        color: '',
        client: '',
        lotNo: '',
        deltaE: '',
        status: 'pending',
        notes: ''
      });
      fetchInspections();
    } catch (err) {
      console.error('Error saving inspection:', err);
      alert(`Failed to ${isEditing ? 'update' : 'create'} inspection`);
    }
  };

  const handleEdit = (inspection) => {
    setIsEditing(true);
    setEditingId(inspection._id);
    setFormData({
      date: inspection.date,
      color: inspection.color,
      client: inspection.client,
      lotNo: inspection.lotNo,
      deltaE: inspection.deltaE || '',
      status: inspection.status,
      notes: inspection.notes || ''
    });
    setShowModal(true);
  };

  const handleNewInspection = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      color: '',
      client: '',
      lotNo: '',
      deltaE: '',
      status: 'pending',
      notes: ''
    });
    setShowModal(true);
  };

  const filteredInspections = inspections.filter(item => {
    // Filter by status
    const statusMatch = activeFilter === 'all' || item.status === activeFilter;

    // Filter by search query
    const searchMatch = !searchQuery ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lotNo.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
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
  const approvedCount = inspections.filter(i => i.status === 'approved').length;
  const pendingCount = inspections.filter(i => i.status === 'pending').length;
  const rejectedCount = inspections.filter(i => i.status === 'rejected').length;
  const approvalRate = totalInspections > 0 ? Math.round((approvedCount / totalInspections) * 100) : 0;
  const withDeltaE = inspections.filter(i => i.deltaE);
  const avgDeltaE = withDeltaE.length > 0 ? (withDeltaE.reduce((sum, i) => sum + i.deltaE, 0) / withDeltaE.length).toFixed(2) : '0.00';
  const pendingReview = pendingCount;

  // Dynamic pie chart data
  const inspectionData = [
    { name: 'Approved', value: approvedCount, color: '#10b981' },
    { name: 'Pending', value: pendingCount, color: '#fbbf24' },
    { name: 'Rejected', value: rejectedCount, color: '#ef4444' }
  ].filter(item => item.value > 0); // Only show non-zero values

  return (
    <div className="color-inspection">
      <div className="page-header">
        <div>
          <h1>Color Inspection</h1>
          <p className="page-subtitle">Lab dip approvals and quality control tracking</p>
        </div>
        <button className="new-inspection-button" onClick={handleNewInspection}>
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
              <input
                type="text"
                placeholder="Search colors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                  <th>Actions</th>
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
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(item)}
                        title="Edit inspection"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Inspection Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditing ? 'Edit Inspection' : 'New Inspection'}</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Color *</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="e.g., Navy Blue"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Client *</label>
                  <input
                    type="text"
                    name="client"
                    value={formData.client}
                    onChange={handleInputChange}
                    placeholder="e.g., ABC Textiles"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Lot Number *</label>
                  <input
                    type="text"
                    name="lotNo"
                    value={formData.lotNo}
                    onChange={handleInputChange}
                    placeholder="e.g., LOT-2024-001"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Delta E (ΔE)</label>
                  <input
                    type="number"
                    name="deltaE"
                    value={formData.deltaE}
                    onChange={handleInputChange}
                    placeholder="e.g., 1.2"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="form-group full-width">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Additional notes or observations..."
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  {isEditing ? 'Update Inspection' : 'Create Inspection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorInspection;
