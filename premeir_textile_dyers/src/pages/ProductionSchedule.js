import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { scheduleAPI } from '../services/api';
import './ProductionSchedule.css';

const ProductionSchedule = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2025-12-15');
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch schedules on component mount
  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await scheduleAPI.getAll();
      setSchedules(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  const scheduledBatches = schedules;

  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date('2025-12-15');
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getDateNumber = (date) => {
    return date.getDate();
  };

  const getBatchesForDate = (dateStr) => {
    return scheduledBatches.filter(batch => batch.date === dateStr);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const weekDates = getNextWeekDates();
  const todayBatches = getBatchesForDate(selectedDate);

  if (loading) {
    return <div className="production-schedule"><div className="page-header"><h1>Loading schedules...</h1></div></div>;
  }

  if (error) {
    return <div className="production-schedule"><div className="page-header"><h1>Error: {error}</h1></div></div>;
  }

  return (
    <div className="production-schedule">
      <div className="page-header">
        <div>
          <h1>Production Schedule</h1>
          <p className="page-subtitle">Plan and manage upcoming production batches</p>
        </div>
        <button className="schedule-button" onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          Schedule Batch
        </button>
      </div>

      {/* Summary Stats */}
      <div className="schedule-stats">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Scheduled This Week</p>
            <h3 className="stat-value">{scheduledBatches.length}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Today's Batches</p>
            <h3 className="stat-value">{todayBatches.length}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Quantity</p>
            <h3 className="stat-value">2,530 kg</h3>
          </div>
        </div>
      </div>

      {/* Week Calendar View */}
      <div className="calendar-container">
        <h3>Weekly Overview</h3>
        <div className="week-calendar">
          {weekDates.map((date, index) => {
            const dateStr = formatDate(date);
            const batches = getBatchesForDate(dateStr);
            const isSelected = dateStr === selectedDate;

            return (
              <div
                key={index}
                className={`calendar-day ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedDate(dateStr)}
              >
                <div className="day-header">
                  <span className="day-name">{getDayName(date)}</span>
                  <span className="day-number">{getDateNumber(date)}</span>
                </div>
                <div className="day-batches">
                  <span className="batch-count">{batches.length} batches</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scheduled Batches Table */}
      <div className="schedule-table-container">
        <div className="table-header">
          <h3>Scheduled Batches - {selectedDate}</h3>
        </div>
        <div className="schedule-table-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Machine</th>
                <th>Party</th>
                <th>Color</th>
                <th>Lot No.</th>
                <th>Quantity</th>
                <th>Duration</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {todayBatches.length > 0 ? (
                todayBatches.map((batch) => (
                  <tr key={batch._id}>
                    <td>
                      <span className="time-badge">{batch.time}</span>
                    </td>
                    <td>
                      <span className="machine-badge">{batch.machine}</span>
                    </td>
                    <td>{batch.party}</td>
                    <td>
                      <span className="color-badge">{batch.color}</span>
                    </td>
                    <td>{batch.lotNo}</td>
                    <td>{batch.quantity}</td>
                    <td>{batch.duration}</td>
                    <td>
                      <span className={`priority-badge ${getPriorityClass(batch.priority)}`}>
                        {batch.priority.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn edit">
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-data">
                    No batches scheduled for this date
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Schedule New Batch</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Date</label>
                <input type="date" defaultValue="2025-12-15" />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input type="time" defaultValue="08:00" />
              </div>
              <div className="form-group">
                <label>Machine</label>
                <select>
                  <option>SF-01</option>
                  <option>SF-02</option>
                  <option>SF-03</option>
                  <option>SF-04</option>
                  <option>SF-05</option>
                </select>
              </div>
              <div className="form-group">
                <label>Party</label>
                <input type="text" placeholder="Party name" />
              </div>
              <div className="form-group">
                <label>Color</label>
                <input type="text" placeholder="Color name" />
              </div>
              <div className="form-group">
                <label>Lot No.</label>
                <input type="text" placeholder="Lot number" />
              </div>
              <div className="form-group">
                <label>Quantity (kg)</label>
                <input type="number" placeholder="450" />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn-save" onClick={() => setShowAddModal(false)}>Schedule Batch</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionSchedule;
