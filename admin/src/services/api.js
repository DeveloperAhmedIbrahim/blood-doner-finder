import axios from 'axios';
import { API_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------
// AUTH APIs
// -------------------
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

// -------------------
// ADMIN APIs
// -------------------
export const adminAPI = {
  // Dashboard Stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Users
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  blockUser: async (userId, isActive) => {
    const response = await api.put(`/admin/users/${userId}/block`, {
      is_active: isActive,
    });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Donors
  getAllDonors: async () => {
    const response = await api.get('/admin/donors');
    return response.data;
  },

  getPendingDonors: async () => {
    const response = await api.get('/admin/donors/pending');
    return response.data;
  },

  verifyDonor: async (donorId, status, reason = null) => {
    const response = await api.put(`/admin/donors/${donorId}/verify`, {
      status,
      reason,
    });
    return response.data;
  },

  // Hospitals
  getAllHospitals: async () => {
    const response = await api.get('/admin/hospitals');
    return response.data;
  },

  updateHospitalStatus: async (hospitalId, isActive) => {
    const response = await api.put(`/admin/hospitals/${hospitalId}/status`, {
      is_active: isActive,
    });
    return response.data;
  },

  // Requests
  getAllRequests: async () => {
    const response = await api.get('/admin/requests');
    return response.data;
  },

  // Donations
  getAllDonations: async () => {
    const response = await api.get('/admin/donations');
    return response.data;
  },
};

export default api;
