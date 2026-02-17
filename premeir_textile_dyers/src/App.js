import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MachineData from './pages/MachineData';
import DyesChemicals from './pages/DyesChemicals';
import ColorInspection from './pages/ColorInspection';
import ProductionSchedule from './pages/ProductionSchedule';
import Alerts from './pages/Alerts';
import BatchHistory from './pages/BatchHistory';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/machine-data" element={<MachineData />} />
          <Route path="/dyes-chemicals" element={<DyesChemicals />} />
          <Route path="/color-inspection" element={<ColorInspection />} />
          <Route path="/production-schedule" element={<ProductionSchedule />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/batch-history" element={<BatchHistory />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
