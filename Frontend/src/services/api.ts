// src/services/api.ts

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
export const BASE_URL = API_BASE_URL.replace('/api/v1', '');


// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const authAPI = {
  register: async (data: { name: string; email: string; password: string; role: 'farmer' | 'company' | 'admin'; }) => {
    const response = await fetch(`${BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  login: async (data: { email: string; password: string }) => {
    const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (result.token) {
      // Store only the token - user data will be fetched via /api/v1/profile/me
      localStorage.setItem('token', result.token);
    }
    return result;
  },

  getMe: async () => {
    const response = await fetch(`${BASE_URL}/api/v1/auth/me`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

export const profileAPI = {
  getProfile: async () => {
    const response = await fetch(`${BASE_URL}/api/v1/profile/me`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  updateProfile: async (data: { name?: string; email?: string }) => {
    const response = await fetch(`${BASE_URL}/api/v1/profile/update`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  changePassword: async (data: { oldPassword: string; newPassword: string }) => {
    const response = await fetch(`${BASE_URL}/api/v1/profile/change-password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  updateStatus: async (status: 'active' | 'inactive') => {
    const response = await fetch(`${BASE_URL}/api/v1/profile/update-status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return response.json();
  }
};

export const farmlandAPI = {
  create: async (formData: FormData) => {
    const token = getAuthToken();
    const response = await fetch(`${BASE_URL}/api/v1/farmland/create`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData
    });
    return response.json();
  },

  getMyFarmlands: async () => {
    const response = await fetch(`${BASE_URL}/api/v1/farmland/my`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  searchFarmlands: async (query: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/farmland/?q=${query}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

export const adminAPI = {
  createAdmin: async (data: { name: string; email: string; password: string }) => {
    const response = await fetch(`${BASE_URL}/api/v1/admin/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  getPendingUsers: async () => {
    const response = await fetch(`${BASE_URL}/api/v1/admin/users/pending`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getUserDetails: async (userId: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/admin/users/${userId}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  approveUser: async (userId: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/admin/users/approve/${userId}`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  rejectUser: async (userId: string, reason: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/admin/users/reject/${userId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    });
    return response.json();
  },

  blockUser: async (userId: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/admin/users/block/${userId}`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getPendingFarmlands: async () => {
    const response = await fetch(`${BASE_URL}/api/v1/admin/farmlands/pending`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getFarmlandDetails: async (farmlandId: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/admin/farmlands/${farmlandId}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  approveFarmland: async (farmlandId: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/admin/farmlands/approve/${farmlandId}`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  rejectFarmland: async (farmlandId: string, reason: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/admin/farmlands/reject/${farmlandId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    });
    return response.json();
  },

  getDashboardStats: async () => {
    const response = await fetch(`${BASE_URL}/api/v1/dashboard/admin`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.msg || data.error || "Failed to fetch stats");
    }
    return response.json();
  },

  getAllUsers: async (page = 1, limit = 10, search = "", status = "") => {
    const response = await fetch(`${BASE_URL}/api/v1/admin/users?page=${page}&limit=${limit}&search=${search}&status=${status}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  toggleBlockUser: async (userId: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/admin/users/block/${userId}`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getAllFarmlands: async (page = 1, limit = 10, search = "", status = "") => {
    const response = await fetch(`${BASE_URL}/api/v1/admin/farmlands?page=${page}&limit=${limit}&search=${search}&status=${status}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getAllPayouts: async (page = 1, limit = 10, search = "") => {
    const response = await fetch(`${BASE_URL}/api/v1/admin/payouts?page=${page}&limit=${limit}&search=${search}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getPayoutDetails: async (payoutId: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/admin/payouts/${payoutId}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getFarmerPayoutSummary: async () => {
    const response = await fetch(`${BASE_URL}/api/v1/admin/payouts/summary`, {
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

export const healthCheck = async () => {
  const response = await fetch(`${BASE_URL}/health`);
  return response.json();
};

export default {
  authAPI,
  profileAPI,
  farmlandAPI,
  adminAPI,
  healthCheck
};
