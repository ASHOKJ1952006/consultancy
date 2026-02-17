"""
Script to integrate DyesChemicals (Inventory) with backend API
"""
import re

# Read the file
with open(r'C:\Users\ashok\OneDrive\Desktop\consultancy\premeir_textile_dyers\src\pages\DyesChemicals.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
content = content.replace(
    "import React, { useState } from 'react';",
    "import React, { useState, useEffect } from 'react';"
)

content = content.replace(
    "import './DyesChemicals.css';",
    "import { inventoryAPI } from '../services/api';\nimport './DyesChemicals.css';"
)

# Add state variables
content = content.replace(
    "const [activeTab, setActiveTab] = useState('all');",
    """const [activeTab, setActiveTab] = useState('all');
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);"""
)

# Find and remove hardcoded inventory array
pattern = r'const inventory = \[[\s\S]*?\];'
replacement = """// Fetch inventory on component mount
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
  };"""

content = re.sub(pattern, replacement, content, flags=re.MULTILINE)

# Write back
with open(r'C:\Users\ashok\OneDrive\Desktop\consultancy\premeir_textile_dyers\src\pages\DyesChemicals.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ DyesChemicals integrated successfully")
