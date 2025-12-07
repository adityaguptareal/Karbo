import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const transactionService = {
  // Get all transactions for logged-in company
  getCompanyTransactions: async (filters = {}) => {
    try {
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      
      const response = await axios.get(
        `${API_BASE_URL}/company/transactions?${params.toString()}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Transaction service error:', error);
      throw error;
    }
  },

  // Get single transaction details
  getTransactionById: async (transactionId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${API_BASE_URL}/company/transactions/${transactionId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Transaction details error:', error);
      throw error;
    }
  },

  // Download invoice
  downloadInvoice: async (transactionId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${API_BASE_URL}/company/transactions/${transactionId}/invoice`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          responseType: 'blob'
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Invoice download error:', error);
      throw error;
    }
  }
};
