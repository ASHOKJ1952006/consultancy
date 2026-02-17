import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Batch API
export const batchAPI = {
    getAll: (params) => api.get('/batches', { params }),
    getById: (id) => api.get(`/batches/${id}`),
    getStats: () => api.get('/batches/stats'),
    create: (data) => api.post('/batches', data),
    update: (id, data) => api.put(`/batches/${id}`, data),
    delete: (id) => api.delete(`/batches/${id}`)
};

// Schedule API
export const scheduleAPI = {
    getAll: (params) => api.get('/schedules', { params }),
    getById: (id) => api.get(`/schedules/${id}`),
    getWeek: (date) => api.get(`/schedules/week/${date}`),
    create: (data) => api.post('/schedules', data),
    update: (id, data) => api.put(`/schedules/${id}`, data),
    delete: (id) => api.delete(`/schedules/${id}`)
};

// Inventory API
export const inventoryAPI = {
    getAll: (params) => api.get('/inventory', { params }),
    getById: (id) => api.get(`/inventory/${id}`),
    getAlerts: () => api.get('/inventory/alerts'),
    create: (data) => api.post('/inventory', data),
    update: (id, data) => api.put(`/inventory/${id}`, data),
    recordUsage: (id, data) => api.post(`/inventory/${id}/usage`, data),
    delete: (id) => api.delete(`/inventory/${id}`)
};

// Machine API
export const machineAPI = {
    getAll: () => api.get('/machines'),
    getById: (id) => api.get(`/machines/${id}`),
    getStats: () => api.get('/machines/stats'),
    create: (data) => api.post('/machines', data),
    update: (id, data) => api.put(`/machines/${id}`, data),
    assignJob: (id, data) => api.post(`/machines/${id}/job`, data),
    completeJob: (id) => api.put(`/machines/${id}/complete`),
    delete: (id) => api.delete(`/machines/${id}`)
};

// Inspection API
export const inspectionAPI = {
    getAll: (params) => api.get('/inspections', { params }),
    getById: (id) => api.get(`/inspections/${id}`),
    getStats: () => api.get('/inspections/stats'),
    create: (data) => api.post('/inspections', data),
    update: (id, data) => api.put(`/inspections/${id}`, data),
    delete: (id) => api.delete(`/inspections/${id}`)
};

// Alert API
export const alertAPI = {
    getAll: (params) => api.get('/alerts', { params }),
    getById: (id) => api.get(`/alerts/${id}`),
    create: (data) => api.post('/alerts', data),
    markAsRead: (id) => api.put(`/alerts/${id}/read`),
    generateAlerts: () => api.post('/alerts/generate'),
    delete: (id) => api.delete(`/alerts/${id}`)
};

export default api;
