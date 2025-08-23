import apiClient from './apiClient';

const authService = {
  // Login admin
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/admin/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Logout admin
  logout: async () => {
    try {
      const response = await apiClient.post('/admin/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Logout failed' };
    }
  },

  // Verify authentication
  verifyAuth: async () => {
    try {
      const response = await apiClient.get('/admin/verify');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Authentication verification failed' };
    }
  },

  // Get admin profile
  getProfile: async () => {
    try {
      const response = await apiClient.get('/admin/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get profile' };
    }
  },

  // Update admin profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/admin/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.put('/admin/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to change password' };
    }
  }
};

export default authService;
