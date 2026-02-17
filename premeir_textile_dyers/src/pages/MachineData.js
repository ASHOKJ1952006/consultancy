import React, { useState, useEffect } from 'react';
import { Activity, Clock, Plus, X } from 'lucide-react';
import { machineAPI } from '../services/api';
import './MachineData.css';

const MachineData = () => {
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newlyAddedMachine, setNewlyAddedMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    machine: '',
    party: '',
    color: '',
    lotNo: '',
    quantity: '',
    stage: 'TD Load',
    expectedDuration: ''
  });

  const [machines, setMachines] = useState([]);

  // Fetch machines on component mount
  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      setLoading(true);
      const response = await machineAPI.getAll();
      setMachines(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching machines:', err);
      setError('Failed to load machines');
    } finally {
      setLoading(false);
    }
  };

  const runningMachines = machines.filter(m => m.status === 'running').length;
  const totalMachines = machines.length;
  const avgEfficiency = Math.round(
    machines.filter(m => m.status === 'running')
      .reduce((sum, m) => sum + m.efficiency, 0) / runningMachines
  );
  const totalProduction = machines.filter(m => m.status === 'running')
    .reduce((sum, m) => sum + parseInt(m.quantity), 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'status-running';
      case 'idle': return 'status-idle';
      case 'maintenance': return 'status-maintenance';
      default: return '';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'running': return 'Running';
      case 'idle': return 'Idle';
      case 'maintenance': return 'Maintenance';
      default: return status;
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
      // Find the machine by machineId
      const machine = machines.find(m => m.machineId === formData.machine);
      if (!machine) {
        alert('Machine not found');
        return;
      }

      // Assign job to machine via API
      await machineAPI.assignJob(machine._id, {
        party: formData.party,
        color: formData.color,
        lotNo: formData.lotNo,
        quantity: `${formData.quantity} kg`,
        stage: formData.stage
      });

      // Refresh machines list
      await fetchMachines();

      // Highlight the newly added machine
      setNewlyAddedMachine(formData.machine);
      setTimeout(() => setNewlyAddedMachine(null), 3000);

      alert(`Job added successfully to ${formData.machine}!`);

      setShowAddJobModal(false);

      // Reset form
      setFormData({
        machine: '',
        party: '',
        color: '',
        lotNo: '',
        quantity: '',
        stage: 'TD Load',
        expectedDuration: ''
      });
    } catch (err) {
      console.error('Error adding job:', err);
      alert('Failed to add job. Please try again.');
    }
  };

  const availableMachines = machines.filter(m => m.status === 'idle' || m.status === 'maintenance');

  if (loading) {
    return <div className="machine-data"><div className="page-header"><h1>Loading...</h1></div></div>;
  }

  if (error) {
    return <div className="machine-data"><div className="page-header"><h1>Error: {error}</h1></div></div>;
  }


  return (
    <div className="machine-data">
      <div className="page-header">
        <div>
          <h1>Machine Running Data</h1>
          <p className="page-subtitle">Real-time production monitoring and machine status</p>
        </div>
        <button className="add-job-button" onClick={() => setShowAddJobModal(true)}>
          <Plus size={20} />
          Add Job
        </button>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Running</p>
            <h3 className="stat-value">{runningMachines}/{totalMachines}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Avg Efficiency</p>
            <h3 className="stat-value">{avgEfficiency}.8%</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Production</p>
            <h3 className="stat-value">{totalProduction.toLocaleString()} kg</h3>
          </div>
        </div>
      </div>

      {/* Machine Cards Grid */}
      <div className="machines-grid">
        {machines.map((machine) => (
          <div
            key={machine._id}
            className={`machine-card ${machine.status} ${newlyAddedMachine === machine.machineId ? 'newly-added' : ''}`}
          >
            <div className="machine-header">
              <div className="machine-id-badge">{machine.machineId}</div>
              <span className={`status-badge ${getStatusColor(machine.status)}`}>
                <span className="status-dot"></span>
                {getStatusLabel(machine.status)}
              </span>
            </div>

            <h3 className="machine-name">{machine.name}</h3>

            {machine.status === 'running' ? (
              <>
                <div className="machine-details">
                  <div className="detail-row">
                    <span className="detail-label">Party</span>
                    <span className="detail-value">{machine.party}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Colour</span>
                    <span className="detail-value">{machine.color}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Lot No.</span>
                    <span className="detail-value">{machine.lotNo}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Quantity</span>
                    <span className="detail-value">{machine.quantity}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Stage</span>
                    <span className="stage-badge">{machine.stage}</span>
                  </div>
                </div>

                <div className="efficiency-section">
                  <div className="efficiency-header">
                    <span className="efficiency-label">Efficiency</span>
                    <span className="efficiency-value">{machine.efficiency}%</span>
                  </div>
                  <div className="efficiency-bar">
                    <div
                      className="efficiency-fill"
                      style={{ width: `${machine.efficiency}%` }}
                    ></div>
                  </div>
                  <div className="runtime">Runtime: {machine.runtime}</div>
                </div>
              </>
            ) : (
              <div className="machine-status-message">
                {machine.status === 'idle' ? (
                  <p>No active job</p>
                ) : (
                  <p>Under maintenance</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Job Modal */}
      {showAddJobModal && (
        <div className="modal-overlay" onClick={() => setShowAddJobModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Job</h2>
              <button className="close-btn" onClick={() => setShowAddJobModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="job-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="machine">Select Machine *</label>
                  <select
                    id="machine"
                    name="machine"
                    value={formData.machine}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Choose a machine</option>
                    {availableMachines.map((machine) => (
                      <option key={machine._id} value={machine.machineId}>
                        {machine.name} ({machine.machineId}) - {machine.status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="party">Party Name *</label>
                  <input
                    type="text"
                    id="party"
                    name="party"
                    value={formData.party}
                    onChange={handleInputChange}
                    placeholder="e.g., LUX, Modenik, JG"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="color">Color *</label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="e.g., Navy Blue, Olive"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lotNo">Lot Number *</label>
                  <input
                    type="text"
                    id="lotNo"
                    name="lotNo"
                    value={formData.lotNo}
                    onChange={handleInputChange}
                    placeholder="e.g., 2384/2385"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Quantity (kg) *</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="e.g., 450"
                    min="1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stage">Starting Stage *</label>
                  <select
                    id="stage"
                    name="stage"
                    value={formData.stage}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="TD Load">TD Load</option>
                    <option value="Dyeing">Dyeing</option>
                    <option value="Soap Run">Soap Run</option>
                    <option value="Soap Steam">Soap Steam</option>
                    <option value="Unload">Unload</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="expectedDuration">Expected Duration (hours) *</label>
                  <input
                    type="number"
                    id="expectedDuration"
                    name="expectedDuration"
                    value={formData.expectedDuration}
                    onChange={handleInputChange}
                    placeholder="e.g., 6"
                    min="1"
                    step="0.5"
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddJobModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MachineData;
