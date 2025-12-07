import api from './api';

export const paymentService = {
  // Create Razorpay order
  createOrder: async (amount, listingId) => {
    const response = await api.post('/payment/create-order', {
      amount,
      listingId
    });
    return response.data;
  },

  // Verify payment after Razorpay success
  verifyPayment: async (paymentData) => {
    const response = await api.post('/payment/verify-payment', paymentData);
    return response.data;
  },

  // Initialize Razorpay checkout
  initializeRazorpay: () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },

  // Open Razorpay payment modal
  openRazorpay: async (orderData, listingId, onSuccess, onError) => {
    const res = await paymentService.initializeRazorpay();
    
    if (!res) {
      alert('Razorpay SDK failed to load');
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Add to .env
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: 'Karbo - Carbon Credits',
      description: 'Carbon Credit Purchase',
      order_id: orderData.order.id,
      handler: async function (response) {
        try {
          // Verify payment on backend
          const verifyData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            listingId: listingId
          };
          
          const result = await paymentService.verifyPayment(verifyData);
          onSuccess(result);
        } catch (error) {
          onError(error);
        }
      },
      prefill: {
        name: '',
        email: '',
        contact: ''
      },
      theme: {
        color: '#10b981' // Emerald color
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }
};
