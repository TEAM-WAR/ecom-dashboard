import axios from 'axios';

// Create an Axios instance

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/api', // Fallback to default
});

// Debug log for API configuration
console.log('API Base URL:', import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/api');

apiClient.defaults.withCredentials = true; // Include credentials for cross-origin requests

// Add a request interceptor to include the API key in headers
apiClient.interceptors.request.use(
  (config) => {
    // Debug log for API requests
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.params || config.data);
    
    // Ensure the API key is available
    const apiKey = import.meta.env.VITE_APP_API_KEY;
    if (apiKey) {
      config.headers['x-api-key'] = apiKey; // Add the API key to the headers
   
    } else {
      console.warn('API key is missing from environment variables.');
    }
    return config;
  },
  (error) => {
    // Log the error and return it
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to log responses
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.method?.toUpperCase(), response.config.url, response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.method?.toUpperCase(), error.config?.url, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default apiClient;