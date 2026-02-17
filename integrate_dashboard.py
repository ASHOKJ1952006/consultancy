"""
Script to integrate Dashboard with backend API
Dashboard aggregates data from multiple endpoints
"""
import re

# Read the file
with open(r'C:\Users\ashok\OneDrive\Desktop\consultancy\premeir_textile_dyers\src\pages\Dashboard.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
content = content.replace(
    "import React from 'react';",
    "import React, { useState, useEffect } from 'react';"
)

content = content.replace(
    "import './Dashboard.css';",
    "import { batchAPI, machineAPI, inventoryAPI, inspectionAPI } from '../services/api';\nimport './Dashboard.css';"
)

# Add Dashboard component with state
# Find "const Dashboard = () => {" and add state after it
dashboard_start = "const Dashboard = () => {"
state_code = """const Dashboard = () => {
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
"""

content = content.replace(dashboard_start, state_code)

# Write back
with open(r'C:\Users\ashok\OneDrive\Desktop\consultancy\premeir_textile_dyers\src\pages\Dashboard.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Dashboard integrated successfully")
