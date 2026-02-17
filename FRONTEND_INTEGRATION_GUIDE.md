# Frontend Integration Guide

## ✅ Completed
- **MachineData.js** - Fully integrated with backend API
- **ESLint warnings** - All fixed
- **React key prop warnings** - Fixed

## 🔄 In Progress  
- **BatchHistory.js** - Partially integrated (needs completion)

## ⏳ Remaining Pages to Integrate

### 1. BatchHistory.js (Complete the integration)

**Current Issue:** Duplicate `batches` variable declaration

**Fix Required:**
Remove the hardcoded `batches` array (lines 96-254) and replace with the useEffect hook that's already added.

**Steps:**
1. Delete lines 96-254 (the entire hardcoded batches array)
2. The useEffect hook is already in place at the top
3. Update all `batch.id` references to `batch.batchId` (some already done)
4. Update batch list rendering to use `batch._id` for React keys

**Field Mapping:**
- `batch.id` → `batch.batchId` (for display)
- `key={batch.id}` → `key={batch._id}` (for React keys)

---

### 2. ProductionSchedule.js

**Integration Pattern:**
```javascript
import { scheduleAPI } from '../services/api';

// Add state
const [schedules, setSchedules] = useState([]);
const [loading, setLoading] = useState(true);

// Add useEffect
useEffect(() => {
  fetchSchedules();
}, []);

const fetchSchedules = async () => {
  try {
    setLoading(true);
    const response = await scheduleAPI.getAll();
    setSchedules(response.data);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    setLoading(false);
  }
};
```

**Field Mapping:**
- Schedule ID: Use `schedule._id` for React keys
- All other fields remain the same

**Form Submission:**
Update `handleSubmit` to call `scheduleAPI.create(formData)`

---

### 3. DyesChemicals.js (Inventory)

**Integration Pattern:**
```javascript
import { inventoryAPI } from '../services/api';

// Fetch inventory
const response = await inventoryAPI.getAll();
setInventory(response.data);
```

**Field Mapping:**
- `item.id` → `item._id` (for React keys)
- `item.name` - same
- `item.stock` - same
- `item.status` - auto-calculated by backend
- `item.weeklyUsage` - object with sun, mon, tue, etc.

**Low Stock Alerts:**
```javascript
const lowStockResponse = await inventoryAPI.getAlerts();
```

---

### 4. ColorInspection.js

**Integration Pattern:**
```javascript
import { inspectionAPI } from '../services/api';

// Fetch inspections
const response = await inspectionAPI.getAll();
setInspections(response.data);

// Get statistics
const statsResponse = await inspectionAPI.getStats();
```

**Field Mapping:**
- `inspection.id` → `inspection._id` (for React keys)
- All other fields remain the same

**Form Submission:**
```javascript
await inspectionAPI.create({
  date, color, client, lotNo, deltaE, status, notes
});
```

---

### 5. Alerts.js

**Integration Pattern:**
```javascript
import { alertAPI } from '../services/api';

// Fetch alerts
const response = await alertAPI.getAll();
setAlerts(response.data);

// Mark as read
await alertAPI.markAsRead(alertId);

// Generate system alerts
await alertAPI.generateAlerts();
```

**Field Mapping:**
- `alert.id` → `alert._id` (for React keys)
- `alert.timestamp` → `alert.createdAt` (MongoDB timestamp)
- All other fields remain the same

---

### 6. Dashboard.js

**Integration Pattern:**
```javascript
import { batchAPI, machineAPI, inventoryAPI, inspectionAPI } from '../services/api';

useEffect(() => {
  fetchDashboardData();
}, []);

const fetchDashboardData = async () => {
  try {
    const [batchStats, machineStats, inventoryAlerts, inspectionStats] = await Promise.all([
      batchAPI.getStats(),
      machineAPI.getStats(),
      inventoryAPI.getAlerts(),
      inspectionAPI.getStats()
    ]);
    
    // Update state with fetched data
  } catch (err) {
    console.error('Error:', err);
  }
};
```

**Data Aggregation:**
- Batch statistics from `/api/batches/stats`
- Machine statistics from `/api/machines/stats`
- Inventory alerts from `/api/inventory/alerts`
- Inspection statistics from `/api/inspections/stats`

---

## 🔑 Common Pattern for All Pages

### 1. Add Imports
```javascript
import { useState, useEffect } from 'react';
import { [entityAPI] } from '../services/api';
```

### 2. Add State
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

### 3. Add useEffect
```javascript
useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    setLoading(true);
    const response = await [entityAPI].getAll();
    setData(response.data);
    setError(null);
  } catch (err) {
    console.error('Error:', err);
    setError('Failed to load data');
  } finally {
    setLoading(false);
  }
};
```

### 4. Remove Hardcoded Arrays
Delete all hardcoded data arrays (like `const batches = [...]`)

### 5. Update Field References
- `item.id` → `item._id` for React keys
- `item.id` → `item.[entityId]` for display (e.g., `batchId`, `machineId`)

### 6. Update Form Submissions
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await [entityAPI].create(formData);
    await fetchData(); // Refresh list
    // Reset form, close modal, etc.
  } catch (err) {
    console.error('Error:', err);
    alert('Failed to save');
  }
};
```

### 7. Add Loading/Error States
```javascript
if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
```

---

## 🧪 Testing Checklist

After integrating each page:

- [ ] Page loads without errors
- [ ] Data displays correctly from backend
- [ ] Create functionality works
- [ ] Update functionality works (if applicable)
- [ ] Delete functionality works (if applicable)
- [ ] Search/filter works
- [ ] No console errors
- [ ] No React key warnings

---

## 📝 Quick Reference: API Methods

```javascript
// Batches
batchAPI.getAll(params)
batchAPI.getById(id)
batchAPI.getStats()
batchAPI.create(data)
batchAPI.update(id, data)
batchAPI.delete(id)

// Schedules
scheduleAPI.getAll(params)
scheduleAPI.getWeek(date)
scheduleAPI.create(data)
scheduleAPI.update(id, data)
scheduleAPI.delete(id)

// Inventory
inventoryAPI.getAll(params)
inventoryAPI.getAlerts()
inventoryAPI.create(data)
inventoryAPI.update(id, data)
inventoryAPI.recordUsage(id, data)
inventoryAPI.delete(id)

// Machines
machineAPI.getAll()
machineAPI.getStats()
machineAPI.assignJob(id, data)
machineAPI.completeJob(id)
machineAPI.update(id, data)

// Inspections
inspectionAPI.getAll(params)
inspectionAPI.getStats()
inspectionAPI.create(data)
inspectionAPI.update(id, data)
inspectionAPI.delete(id)

// Alerts
alertAPI.getAll(params)
alertAPI.markAsRead(id)
alertAPI.generateAlerts()
alertAPI.create(data)
alertAPI.delete(id)
```

---

## 🚀 Recommended Order

1. **BatchHistory** - Complete the started integration
2. **ProductionSchedule** - Similar to BatchHistory
3. **DyesChemicals** - Inventory management
4. **ColorInspection** - Quality control
5. **Alerts** - Notifications
6. **Dashboard** - Aggregates all data (do last)

---

## 💡 Tips

1. **Work on one page at a time** - Test thoroughly before moving to the next
2. **Keep backend running** - Make sure `npm run dev` is running in the backend folder
3. **Check browser console** - Look for errors and network requests
4. **Use React DevTools** - Inspect component state
5. **Test CRUD operations** - Create, read, update, delete for each entity
6. **Refresh data after mutations** - Call `fetchData()` after create/update/delete

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot read property of undefined"
**Solution:** Check if data is loaded before rendering: `{data && data.map(...)}`

### Issue: "Network Error" or "Failed to fetch"
**Solution:** Ensure backend is running on port 5000

### Issue: "CORS Error"
**Solution:** Backend already has CORS enabled, but check if the port is correct

### Issue: "Duplicate key" warning
**Solution:** Use `item._id` for React keys, not array index

### Issue: Data not updating after create/update
**Solution:** Call `fetchData()` after successful mutation
