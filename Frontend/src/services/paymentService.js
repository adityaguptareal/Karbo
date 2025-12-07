import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const paymentService = {
  // Create Razorpay order
  createOrder: async (amount, listingId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_BASE_URL}/payment/create-order`,
        {
          amount,
          listingId
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_BASE_URL}/payment/verify`,
        paymentData,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Verify payment error:', error);
      throw error;
    }
  }
};
