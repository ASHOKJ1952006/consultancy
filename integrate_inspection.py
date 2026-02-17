"""
Script to integrate ColorInspection with backend API
"""
import re

# Read the file
with open(r'C:\Users\ashok\OneDrive\Desktop\consultancy\premeir_textile_dyers\src\pages\ColorInspection.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
content = content.replace(
    "import React, { useState } from 'react';",
    "import React, { useState, useEffect } from 'react';"
)

content = content.replace(
    "import './ColorInspection.css';",
    "import { inspectionAPI } from '../services/api';\nimport './ColorInspection.css';"
)

# Add state variables
content = content.replace(
    "const [searchQuery, setSearchQuery] = useState('');",
    """const [searchQuery, setSearchQuery] = useState('');
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);"""
)

# Find and remove hardcoded inspections array
pattern = r'const inspections = \[[\s\S]*?\];'
replacement = """// Fetch inspections on component mount
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
  };"""

content = re.sub(pattern, replacement, content, flags=re.MULTILINE)

# Write back
with open(r'C:\Users\ashok\OneDrive\Desktop\consultancy\premeir_textile_dyers\src\pages\ColorInspection.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ ColorInspection integrated successfully")
