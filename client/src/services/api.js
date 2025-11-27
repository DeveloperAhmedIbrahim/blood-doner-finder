import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/constants';


// Axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  },

  // Get profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Network error' };
    }
  },
};

export const donorAPI = {
  // Get donor profile
  getProfile: async () => {
    try {
      const response = await api.get('/donor/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  // Get verification status
  getVerificationStatus: async () => {
    try {
      const response = await api.get('/donor/verification-status');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch status' };
    }
  },

  // Complete profile
  completeProfile: async (profileData) => {
    try {
      const response = await api.post('/donor/complete-profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Profile update failed' };
    }
  },

  // Upload CNIC (multipart/form-data)
  uploadCNIC: async (formData) => {
    try {
      const response = await api.post('/donor/upload-cnic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Upload failed' };
    }
  },
};

export const hospitalAPI = {
  // Get pending verifications count + list
  getPendingVerifications: async () => {
    try {
      const response = await api.get('/hospital/pending-verifications');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch pending verifications' };
    }
  },

  // Verify donor (approve/reject)
  verifyDonor: async (donorId, status, reason = null) => {
    try {
      const response = await api.post(`/hospital/verify-donor/${donorId}`, {
        status,
        reason,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Verification failed' };
    }
  },
};

export const requestAPI = {
  // Create new blood request (Patient)
  createRequest: async (requestData) => {
    try {
      const response = await api.post('/requests/create', requestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create request' };
    }
  },

  // Get active requests (for Donor)
  getActiveRequests: async () => {
    try {
      const response = await api.get('/requests/active');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch requests' };
    }
  },

  // Get my requests (Patient)
  getMyRequests: async () => {
    try {
      const response = await api.get('/requests/my-requests');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch my requests' };
    }
  },

  // Cancel request
  cancelRequest: async (requestId) => {
    try {
      const response = await api.post(`/requests/cancel/${requestId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to cancel request' };
    }
  },

  // Respond to request (Donor)
  respondToRequest: async (requestId, response, message = '') => {
    try {
      const res = await api.post(`/requests/${requestId}/respond`, {
        response,
        message,
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to respond' };
    }
  },
};

export default api;
