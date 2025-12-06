// src/services/api.ts

const BASE_URL = 'https://karbo.onrender.com';

// Helper to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper to set auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': token } : {})
  };
};

// Auth APIs
export const authAPI = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    role: 'farmer' | 'company' | 'admin';
  }) => {
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
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('userRole', result.user?.role || '');
      localStorage.setItem('userId', result.user?._id || '');
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

// Profile APIs
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

// Farmland APIs
export const farmlandAPI = {
  create: async (formData: FormData) => {
    const token = getAuthToken();
    const response = await fetch(`${BASE_URL}/api/v1/farmland/create`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': token } : {})
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

// Admin APIs
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

  rejectFarmland: async (farmlandId: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/admin/farmlands/reject/${farmlandId}`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Health check
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