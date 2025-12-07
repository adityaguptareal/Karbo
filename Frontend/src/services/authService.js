import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL || "https://karbo.onrender.com/api/v1";


export const authService = {
  // Register company
  register: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      ...userData,
      role: 'company'
    });
    return response.data;
  },

  // Login
  login: async (email, password) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { 
      email, 
      password 
    });
    
    // Store token and user data
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Check if user is company
  isCompany: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'company';
  }
};
