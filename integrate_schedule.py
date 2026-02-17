"""
Script to integrate ProductionSchedule with backend API
Removes hardcoded data and adds API integration
"""
import re

# Read the file
with open(r'C:\Users\ashok\OneDrive\Desktop\consultancy\premeir_textile_dyers\src\pages\ProductionSchedule.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
content = content.replace(
    "import React, { useState } from 'react';",
    "import React, { useState, useEffect } from 'react';"
)

content = content.replace(
    "import './ProductionSchedule.css';",
    "import { scheduleAPI } from '../services/api';\nimport './ProductionSchedule.css';"
)

# Add state variables after existing useState
content = content.replace(
    "const [selectedDate, setSelectedDate] = useState('2025-12-15');",
    """const [selectedDate, setSelectedDate] = useState('2025-12-15');
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);"""
)

# Find and remove hardcoded scheduledBatches array
# Pattern: const scheduledBatches = [ ... ];
pattern = r'const scheduledBatches = \[[\s\S]*?\];'
replacement = """// Fetch schedules on component mount
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

  const scheduledBatches = schedules;"""

content = re.sub(pattern, replacement, content, flags=re.MULTILINE)

# Write back
with open(r'C:\Users\ashok\OneDrive\Desktop\consultancy\premeir_textile_dyers\src\pages\ProductionSchedule.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ ProductionSchedule integrated successfully")
