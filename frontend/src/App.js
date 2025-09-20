import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Batches from './pages/Batches';
import BatchDetail from './pages/BatchDetail';
import CreateBatch from './pages/CreateBatch';
import QRScanner from './pages/QRScanner';
import IoTDashboard from './pages/IoTDashboard';
import RegulatorDashboard from './pages/RegulatorDashboard';
import Profile from './pages/Profile';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/batches" element={<Batches />} />
        <Route path="/batches/:id" element={<BatchDetail />} />
        <Route path="/create-batch" element={<CreateBatch />} />
        <Route path="/scan" element={<QRScanner />} />
        <Route path="/scan/:batchId" element={<QRScanner />} />
        <Route path="/iot" element={<IoTDashboard />} />
        <Route path="/regulator" element={<RegulatorDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;