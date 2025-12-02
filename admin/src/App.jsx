import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Donors from './pages/Donors';
import Hospitals from './pages/Hospitals';
import Requests from './pages/Requests';
import Donations from './pages/Donations';

const AdminLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <CssBaseline />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: '240px', mt: '72px' }}>
        <Navbar />
        {children}
      </Box>
    </Box>
  );
};

const isAdminLoggedIn = () => {
  return !!localStorage.getItem('adminToken');
};

const ProtectedAdminRoute = ({ children }) => {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/" replace />;
  }
  return <AdminLayout>{children}</AdminLayout>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedAdminRoute>
              <Dashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedAdminRoute>
              <Users />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/donors"
          element={
            <ProtectedAdminRoute>
              <Donors />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/hospitals"
          element={
            <ProtectedAdminRoute>
              <Hospitals />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedAdminRoute>
              <Requests />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/donations"
          element={
            <ProtectedAdminRoute>
              <Donations />
            </ProtectedAdminRoute>
          }
        />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
