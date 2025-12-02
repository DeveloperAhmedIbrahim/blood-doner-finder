import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import { Box, CssBaseline } from '@mui/material';

import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Donors from './pages/Donors';
import Hospitals from './pages/Hospitals';
import Requests from './pages/Requests';
import Donations from './pages/Donations';
import Login from './pages/Login'; // your existing login

const AdminLayout = ({ children }) => (
  <Box sx={{ display: 'flex' }}>
    <Sidebar />
    <CssBaseline />
    <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '72px' }}>
      <Topbar />
      {children}
    </Box>
  </Box>
);

const isAdminLoggedIn = () => !!localStorage.getItem('adminToken');

const ProtectedAdminRoute = ({ children }) => {
  if (!isAdminLoggedIn()) return <Navigate to="/" replace />;
  return <AdminLayout>{children}</AdminLayout>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedAdminRoute><Dashboard /></ProtectedAdminRoute>} />
        <Route path="/users" element={<ProtectedAdminRoute><Users /></ProtectedAdminRoute>} />
        <Route path="/donors" element={<ProtectedAdminRoute><Donors /></ProtectedAdminRoute>} />
        <Route path="/hospitals" element={<ProtectedAdminRoute><Hospitals /></ProtectedAdminRoute>} />
        <Route path="/requests" element={<ProtectedAdminRoute><Requests /></ProtectedAdminRoute>} />
        <Route path="/donations" element={<ProtectedAdminRoute><Donations /></ProtectedAdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
