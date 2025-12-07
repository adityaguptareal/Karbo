import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const dashboardService = {
  // Get company dashboard stats
  getCompanyDashboard: async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_BASE_URL}/dashboard/company`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      return response.data;
    } catch (error) {
      console.error('Dashboard service error:', error);
      throw error;
    }
  },

  // Get recent transactions for company
  getRecentTransactions: async (limit = 5) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${API_BASE_URL}/transactions?limit=${limit}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      return response.data;
    } catch (error) {
      console.error('Transactions service error:', error);
      throw error;
    }
  }
};
