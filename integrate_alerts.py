"""
Script to integrate Alerts with backend API
"""
import re

# Read the file
with open(r'C:\Users\ashok\OneDrive\Desktop\consultancy\premeir_textile_dyers\src\pages\Alerts.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
content = content.replace(
    "import React, { useState } from 'react';",
    "import React, { useState, useEffect } from 'react';"
)

content = content.replace(
    "import './Alerts.css';",
    "import { alertAPI } from '../services/api';\nimport './Alerts.css';"
)

# Add state variables after existing useState
# Find the last useState and add after it
content = content.replace(
    "const [selectedCategory, setSelectedCategory] = useState('all');",
    """const [selectedCategory, setSelectedCategory] = useState('all');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);"""
)

# Find and remove hardcoded alerts array
pattern = r'const alerts = \[[\s\S]*?\];'
replacement = """// Fetch alerts on component mount
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
  };"""

content = re.sub(pattern, replacement, content, flags=re.MULTILINE)

# Write back
with open(r'C:\Users\ashok\OneDrive\Desktop\consultancy\premeir_textile_dyers\src\pages\Alerts.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Alerts integrated successfully")
