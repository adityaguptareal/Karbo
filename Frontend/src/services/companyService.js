import api from './api';

export const companyService = {
  // Upload company documents
  uploadDocuments: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('documents', file);
    });

    const response = await api.post('/company/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get company profile
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  // Update company profile
  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  }
};
