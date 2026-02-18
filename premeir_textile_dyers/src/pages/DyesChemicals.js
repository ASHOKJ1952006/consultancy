import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Plus, Search } from 'lucide-react';
import { inventoryAPI } from '../services/api';
import './DyesChemicals.css';

const DyesChemicals = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dye',
    stock: '',
    minThreshold: 100,
    maxCapacity: 500,
    weeklyUsage: {
      sun: 0,
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0
    }
  });

  // Fetch inventory on component mount
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await inventoryAPI.getAll();
      setInventory(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Failed to load inventory');
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

  const handleWeeklyUsageChange = (day, value) => {
    setFormData(prev => ({
      ...prev,
      weeklyUsage: {
        ...prev.weeklyUsage,
        [day]: parseFloat(value) || 0
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate stock field
      if (!formData.stock || formData.stock === '') {
        alert('Please enter a stock value');
        return;
      }

      const stockValue = parseFloat(formData.stock);
      if (isNaN(stockValue) || stockValue < 0) {
        alert('Please enter a valid stock value (must be a positive number)');
        return;
      }

      const submitData = {
        ...formData,
        stock: stockValue,
        minThreshold: parseFloat(formData.minThreshold) || 100,
        maxCapacity: parseFloat(formData.maxCapacity) || 500
      };

      console.log('Submitting data:', submitData); // Debug log

      await inventoryAPI.create(submitData);
      setShowModal(false);
      setFormData({
        name: '',
        category: 'Dye',
        stock: '',
        minThreshold: 100,
        maxCapacity: 500,
        weeklyUsage: {
          sun: 0,
          mon: 0,
          tue: 0,
          wed: 0,
          thu: 0,
          fri: 0
        }
      });
      fetchInventory();
    } catch (err) {
      console.error('Error creating item:', err);
      console.error('Error response:', err.response?.data); // Debug log
      const errorMessage = err.response?.data?.error || err.message || 'Failed to create item';
      alert(`Failed to create item: ${errorMessage}`);
    }
  };

  // Filter items by tab and search
  const filteredItems = inventory.filter(item => {
    // Filter by tab
    const tabMatch = activeTab === 'all' ||
      (activeTab === 'dyes' && item.category === 'Dye') ||
      (activeTab === 'chemicals' && item.category === 'Chemical');

    // Filter by search
    const searchMatch = !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());

    return tabMatch && searchMatch;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'ok': return 'status-ok';
      case 'low': return 'status-low';
      case 'critical': return 'status-critical';
      default: return '';
    }
  };

  const getStatusText = (status, stockLevel) => {
    if (status === 'ok') return 'OK';
    if (status === 'low') return `🔻 ${stockLevel}%`;
    if (status === 'critical') return `🔻 ${stockLevel}%`;
    return '';
  };

  // Calculate dynamic stats
  const totalItems = inventory.length;
  const dyesCount = inventory.filter(i => i.category === 'Dye').length;
  const chemicalsCount = inventory.filter(i => i.category === 'Chemical').length;
  const lowStockCount = inventory.filter(i => i.status !== 'ok').length;

  // Calculate weekly usage data from inventory
  const weeklyUsageData = [
    { day: 'Sun', dyes: 0, chemicals: 0 },
    { day: 'Mon', dyes: 0, chemicals: 0 },
    { day: 'Tue', dyes: 0, chemicals: 0 },
    { day: 'Wed', dyes: 0, chemicals: 0 },
    { day: 'Thu', dyes: 0, chemicals: 0 },
    { day: 'Fri', dyes: 0, chemicals: 0 }
  ];

  inventory.forEach(item => {
    if (item.weeklyUsage) {
      const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri'];
      days.forEach((day, index) => {
        const usage = item.weeklyUsage[day] || 0;
        if (item.category === 'Dye') {
          weeklyUsageData[index].dyes += usage;
        } else {
          weeklyUsageData[index].chemicals += usage;
        }
      });
    }
  });

  if (loading) {
    return <div className="dyes-chemicals"><div className="page-header"><h1>Loading inventory...</h1></div></div>;
  }

  if (error) {
    return <div className="dyes-chemicals"><div className="page-header"><h1>Error: {error}</h1></div></div>;
  }

  return (
    <div className="dyes-chemicals">
      <div className="page-header">
        <div>
          <h1>Dyes & Chemicals Inventory</h1>
          <p className="page-subtitle">Weekly usage tracking and stock management</p>
        </div>
        <button className="add-item-button" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Add Item
        </button>
      </div>

      {/* Summary Cards */}
      <div className="inventory-summary">
        <div className="summary-card">
          <div className="summary-icon purple">
            <span>📦</span>
          </div>
          <div className="summary-info">
            <p className="summary-label">Total Items</p>
            <h3 className="summary-value">{totalItems}</h3>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon pink">
            <span>💜</span>
          </div>
          <div className="summary-info">
            <p className="summary-label">Dyes</p>
            <h3 className="summary-value">{dyesCount}</h3>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon blue">
            <span>🔵</span>
          </div>
          <div className="summary-info">
            <p className="summary-label">Chemicals</p>
            <h3 className="summary-value">{chemicalsCount}</h3>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon orange">
            <span>⚠️</span>
          </div>
          <div className="summary-info">
            <p className="summary-label">Low Stock</p>
            <h3 className="summary-value">{lowStockCount}</h3>
          </div>
        </div>
      </div>

      {/* Weekly Usage Chart */}
      <div className="chart-section">
        <div className="chart-header">
          <h3>Weekly Usage Trend</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyUsageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="dyes" fill="#a855f7" name="Dyes" radius={[4, 4, 0, 0]} />
            <Bar dataKey="chemicals" fill="#3b82f6" name="Chemicals" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Inventory Table */}
      <div className="inventory-table-section">
        <div className="table-controls">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Items
            </button>
            <button
              className={`tab ${activeTab === 'dyes' ? 'active' : ''}`}
              onClick={() => setActiveTab('dyes')}
            >
              Dyes
            </button>
            <button
              className={`tab ${activeTab === 'chemicals' ? 'active' : ''}`}
              onClick={() => setActiveTab('chemicals')}
            >
              Chemicals
            </button>
          </div>

          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Sun</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr key={item._id || index}>
                  <td className="item-name">{item.name}</td>
                  <td>
                    <span className={`category-badge ${item.category.toLowerCase()}`}>
                      {item.category}
                    </span>
                  </td>
                  <td>{(item.weeklyUsage?.sun || 0).toLocaleString()}</td>
                  <td>{(item.weeklyUsage?.mon || 0).toLocaleString()}</td>
                  <td>{(item.weeklyUsage?.tue || 0).toLocaleString()}</td>
                  <td>{(item.weeklyUsage?.wed || 0).toLocaleString()}</td>
                  <td>{(item.weeklyUsage?.thu || 0).toLocaleString()}</td>
                  <td>{(item.weeklyUsage?.fri || 0).toLocaleString()}</td>
                  <td className="stock-cell">
                    <span className={getStatusClass(item.status)}>
                      {item.stock} kg
                    </span>
                  </td>
                  <td className="status-cell">
                    <span className={`status-indicator ${getStatusClass(item.status)}`}>
                      {getStatusText(item.status, item.stockLevel)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Item</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Item Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., BLACK B (SF) Divine"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Dye">Dye</option>
                    <option value="Chemical">Chemical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Current Stock (kg) *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="e.g., 500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Min Threshold (kg)</label>
                  <input
                    type="number"
                    name="minThreshold"
                    value={formData.minThreshold}
                    onChange={handleInputChange}
                    placeholder="e.g., 100"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label>Max Capacity (kg)</label>
                  <input
                    type="number"
                    name="maxCapacity"
                    value={formData.maxCapacity}
                    onChange={handleInputChange}
                    placeholder="e.g., 500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="weekly-usage-section">
                <h3>Weekly Usage (kg)</h3>
                <div className="weekly-usage-grid">
                  <div className="form-group">
                    <label>Sunday</label>
                    <input
                      type="number"
                      value={formData.weeklyUsage.sun}
                      onChange={(e) => handleWeeklyUsageChange('sun', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Monday</label>
                    <input
                      type="number"
                      value={formData.weeklyUsage.mon}
                      onChange={(e) => handleWeeklyUsageChange('mon', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Tuesday</label>
                    <input
                      type="number"
                      value={formData.weeklyUsage.tue}
                      onChange={(e) => handleWeeklyUsageChange('tue', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Wednesday</label>
                    <input
                      type="number"
                      value={formData.weeklyUsage.wed}
                      onChange={(e) => handleWeeklyUsageChange('wed', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Thursday</label>
                    <input
                      type="number"
                      value={formData.weeklyUsage.thu}
                      onChange={(e) => handleWeeklyUsageChange('thu', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Friday</label>
                    <input
                      type="number"
                      value={formData.weeklyUsage.fri}
                      onChange={(e) => handleWeeklyUsageChange('fri', e.target.value)}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DyesChemicals;
