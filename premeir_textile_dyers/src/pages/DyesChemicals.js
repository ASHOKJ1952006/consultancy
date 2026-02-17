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

  const weeklyUsageData = [
    { day: 'Sun', dyes: 7200, chemicals: 3800 },
    { day: 'Mon', dyes: 8900, chemicals: 3400 },
    { day: 'Tue', dyes: 9300, chemicals: 3200 },
    { day: 'Wed', dyes: 9100, chemicals: 3400 },
    { day: 'Thu', dyes: 14200, chemicals: 2800 },
    { day: 'Fri', dyes: 9200, chemicals: 2900 }
  ];

  const inventoryItems = [
    { name: 'BLACK B (SF) Divine', category: 'Dye', sun: 3930, mon: 3165, tue: 3640, wed: 3415, thu: 3389, fri: 3815, stock: 617, status: 'ok', stockLevel: 100 },
    { name: 'DEEP BLACK', category: 'Dye', sun: 384, mon: 3184, tue: 3184, wed: 3134, thu: 8134, fri: 3134, stock: 50, status: 'low', stockLevel: 25 },
    { name: 'RED W3R (Divine)', category: 'Dye', sun: 1205, mon: 1158, tue: 1127, wed: 1101, thu: 1098, fri: 1081, stock: 148, status: 'critical', stockLevel: 69 },
    { name: 'RED F3B (Divine)', category: 'Dye', sun: 26, mon: 30, tue: 30, wed: 237, thu: 227, fri: 194, stock: 106, status: 'critical', stockLevel: 71 },
    { name: 'ORANGE W3R (Divine)', category: 'Dye', sun: 1120, mon: 1085, tue: 1035, wed: 1035, thu: 998, fri: 987, stock: 155, status: 'critical', stockLevel: 78 },
    { name: 'YELLOW ME49L (Divine)', category: 'Dye', sun: 114, mon: 14, tue: 147, wed: 108, thu: 108, fri: 108, stock: 5, status: 'critical', stockLevel: 10 },
    { name: 'BLUE RR (Divine)', category: 'Dye', sun: 370, mon: 370, tue: 370, wed: 370, thu: 356, fri: 356, stock: 19, status: 'critical', stockLevel: 19 },
    { name: 'RED RR (Divine)', category: 'Dye', sun: 120, mon: 120, tue: 120, wed: 145, thu: 109, fri: 103, stock: 13, status: 'critical', stockLevel: 13 },
    { name: 'Wetting Oil - BMW/CFLD', category: 'Chemical', sun: 1613, mon: 1500, tue: 1448, wed: 1389, thu: 1347, fri: 1386, stock: 288, status: 'critical', stockLevel: 72 },
    { name: 'Soaping Oil - OL 40', category: 'Chemical', sun: 1521, mon: 1428, tue: 1341, wed: 1293, thu: 1259, fri: 1224, stock: 321, status: 'critical', stockLevel: 80 },
    { name: 'Peroxide Killer Levocol NZCK', category: 'Chemical', sun: 411, mon: 406, tue: 406, wed: 406, thu: 397, fri: 396, stock: 15, status: 'critical', stockLevel: 15 },
    { name: 'Softner Cakes (1:15)', category: 'Chemical', sun: 125, mon: 100, tue: 100, wed: 100, thu: 75, fri: 75, stock: 75, status: 'critical', stockLevel: 75 }
  ];

  const filteredItems = inventoryItems.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'dyes') return item.category === 'Dye';
    if (activeTab === 'chemicals') return item.category === 'Chemical';
    return true;
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

  const totalItems = inventoryItems.length;
  const dyesCount = inventoryItems.filter(i => i.category === 'Dye').length;
  const chemicalsCount = inventoryItems.filter(i => i.category === 'Chemical').length;
  const lowStockCount = inventoryItems.filter(i => i.status !== 'ok').length;

  return (
    <div className="dyes-chemicals">
      <div className="page-header">
        <div>
          <h1>Dyes & Chemicals Inventory</h1>
          <p className="page-subtitle">Weekly usage tracking and stock management</p>
        </div>
        <button className="add-item-button">
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
            <input type="text" placeholder="Search items..." />
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
                <tr key={index}>
                  <td className="item-name">{item.name}</td>
                  <td>
                    <span className={`category-badge ${item.category.toLowerCase()}`}>
                      {item.category}
                    </span>
                  </td>
                  <td>{item.sun.toLocaleString()}</td>
                  <td>{item.mon.toLocaleString()}</td>
                  <td>{item.tue.toLocaleString()}</td>
                  <td>{item.wed.toLocaleString()}</td>
                  <td>{item.thu.toLocaleString()}</td>
                  <td>{item.fri.toLocaleString()}</td>
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
    </div>
  );
};

export default DyesChemicals;
