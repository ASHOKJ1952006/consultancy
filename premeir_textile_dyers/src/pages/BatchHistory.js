import React, { useState, useEffect } from 'react';
import { Search, Eye, Download, Calendar, FlaskConical, Cpu } from 'lucide-react';
import { batchAPI } from '../services/api';
import './BatchHistory.css';

const BatchHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Download batch report as text file
  const downloadBatchReport = (batch) => {
    const reportContent = `
========================================
PREMIER TEXTILE DYERS
Batch Production Report
========================================

BATCH INFORMATION
-----------------
Batch ID:       ${batch.batchId}
Date:           ${batch.date}
Machine:        ${batch.machine}
Party:          ${batch.party}
Color:          ${batch.color}
Lot Number:     ${batch.lotNo}
Quantity:       ${batch.quantity}
Duration:       ${batch.duration}
Status:         ${batch.status.toUpperCase()}
Efficiency:     ${batch.efficiency}%
Delta E:        ${batch.deltaE}
Operator:       ${batch.operator}

RECIPE - DYES
-------------
${batch.recipe.dyes.map(dye => `${dye.name.padEnd(40)} ${dye.qty}`).join('\n')}

RECIPE - CHEMICALS
------------------
${batch.recipe.chemicals.map(chem => `${chem.name.padEnd(40)} ${chem.qty}`).join('\n')}

PROCESS STAGES
--------------
${batch.stages.map((stage, i) => `${i + 1}. ${stage.name.padEnd(15)} Duration: ${stage.duration.padEnd(10)} Temperature: ${stage.temp}`).join('\n')}

========================================
Report Generated: ${new Date().toLocaleString()}
========================================
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${batch.batchId}_Report_${batch.date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Download all batches as CSV
  const downloadAllBatchesCSV = () => {
    const headers = ['Batch ID', 'Date', 'Machine', 'Party', 'Color', 'Lot No', 'Quantity', 'Duration', 'Status', 'Efficiency %', 'Delta E', 'Operator'];
    const csvContent = [
      headers.join(','),
      ...filteredBatches.map(batch => [
        batch.batchId,
        batch.date,
        batch.machine,
        batch.party,
        batch.color,
        batch.lotNo,
        batch.quantity,
        batch.duration,
        batch.status,
        batch.efficiency,
        batch.deltaE,
        batch.operator
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Batch_History_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };


  // Fetch batches on component mount
  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await batchAPI.getAll();
      setBatches(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching batches:', err);
      setError('Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  const filteredBatches = batches.filter(batch =>
    batch.batchId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    batch.color?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    batch.lotNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    batch.party?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedCount = batches.filter(b => b.status === 'completed').length;
  const totalQuantity = batches.reduce((sum, b) => sum + parseFloat(b.quantity), 0);
  const avgEfficiency = Math.round(batches.reduce((sum, b) => sum + b.efficiency, 0) / batches.length);

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  const getDeltaEClass = (deltaE) => {
    if (deltaE <= 1) return 'delta-good';
    if (deltaE <= 2) return 'delta-warning';
    return 'delta-bad';
  };

  if (loading) {
    return (
      <div className="batch-history">
        <div className="page-header">
          <h1>Loading batches...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="batch-history">
        <div className="page-header">
          <h1>Error: {error}</h1>
          <button onClick={fetchBatches}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="batch-history">
      <div className="page-header">
        <div>
          <h1>Batch History</h1>
          <p className="page-subtitle">Complete production records with recipes and analytics</p>
        </div>
        <button className="export-button" onClick={downloadAllBatchesCSV}>
          <Download size={20} />
          Export Data
        </button>
      </div>

      {/* Summary Stats */}
      <div className="history-stats">
        <div className="stat-card">
          <div className="stat-icon green">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Completed Batches</p>
            <h3 className="stat-value">{completedCount}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <Cpu size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Avg Efficiency</p>
            <h3 className="stat-value">{avgEfficiency}%</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <FlaskConical size={24} />
          </div>
          <div className="stat-info">
            <p className="stat-label">Total Produced</p>
            <h3 className="stat-value">{totalQuantity.toFixed(0)} kg</h3>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search by batch ID, color, lot no, or party..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Batch List */}
      <div className="batch-list">
        {filteredBatches.map((batch) => (
          <div key={batch._id} className="batch-card">
            <div className="batch-header">
              <div className="batch-title">
                <h3>{batch.batchId}</h3>
                <span className={`status-badge ${getStatusClass(batch.status)}`}>
                  {batch.status.toUpperCase()}
                </span>
              </div>
              <button className="view-btn" onClick={() => setSelectedBatch(batch)}>
                <Eye size={18} />
                View Details
              </button>
            </div>

            <div className="batch-info-grid">
              <div className="info-item">
                <span className="info-label">Date</span>
                <span className="info-value">{batch.date}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Machine</span>
                <span className="info-value">{batch.machine}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Party</span>
                <span className="info-value">{batch.party}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Color</span>
                <span className="info-value color-text">{batch.color}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Lot No</span>
                <span className="info-value">{batch.lotNo}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Quantity</span>
                <span className="info-value">{batch.quantity}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Duration</span>
                <span className="info-value">{batch.duration}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Efficiency</span>
                <span className="info-value">{batch.efficiency}%</span>
              </div>
              <div className="info-item">
                <span className="info-label">Delta E</span>
                <span className={`info-value ${getDeltaEClass(batch.deltaE)}`}>
                  {batch.deltaE}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Operator</span>
                <span className="info-value">{batch.operator}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Batch Detail Modal */}
      {selectedBatch && (
        <div className="modal-overlay" onClick={() => setSelectedBatch(null)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedBatch.id} - {selectedBatch.color}</h2>
                <p className="modal-subtitle">Complete batch information and recipe</p>
              </div>
              <button className="close-btn" onClick={() => setSelectedBatch(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Batch Information</h3>
                <div className="detail-grid">
                  <div><strong>Date:</strong> {selectedBatch.date}</div>
                  <div><strong>Machine:</strong> {selectedBatch.machine}</div>
                  <div><strong>Party:</strong> {selectedBatch.party}</div>
                  <div><strong>Lot No:</strong> {selectedBatch.lotNo}</div>
                  <div><strong>Quantity:</strong> {selectedBatch.quantity}</div>
                  <div><strong>Duration:</strong> {selectedBatch.duration}</div>
                  <div><strong>Efficiency:</strong> {selectedBatch.efficiency}%</div>
                  <div><strong>Delta E:</strong> <span className={getDeltaEClass(selectedBatch.deltaE)}>{selectedBatch.deltaE}</span></div>
                  <div><strong>Operator:</strong> {selectedBatch.operator}</div>
                  <div><strong>Status:</strong> <span className={`status-badge ${getStatusClass(selectedBatch.status)}`}>{selectedBatch.status}</span></div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Recipe</h3>
                <div className="recipe-columns">
                  <div className="recipe-column">
                    <h4>Dyes</h4>
                    <ul className="recipe-list">
                      {selectedBatch.recipe.dyes.map((dye, index) => (
                        <li key={index}>
                          <span>{dye.name}</span>
                          <span className="qty-badge">{dye.qty}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="recipe-column">
                    <h4>Chemicals</h4>
                    <ul className="recipe-list">
                      {selectedBatch.recipe.chemicals.map((chem, index) => (
                        <li key={index}>
                          <span>{chem.name}</span>
                          <span className="qty-badge">{chem.qty}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Process Stages</h3>
                <div className="stages-timeline">
                  {selectedBatch.stages.map((stage, index) => (
                    <div key={index} className="stage-item">
                      <div className="stage-marker">{index + 1}</div>
                      <div className="stage-content">
                        <h4>{stage.name}</h4>
                        <p>Duration: {stage.duration} | Temperature: {stage.temp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-download" onClick={() => downloadBatchReport(selectedBatch)}>
                <Download size={18} />
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchHistory;
