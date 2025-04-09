import axios from 'axios';

// Set the base URL for all requests
axios.defaults.baseURL = 'http://localhost:5000/api';

// Simple API client
const api = {
  // Auth endpoints
  login: async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },
  
  register: async (email, password) => {
    try {
      const response = await axios.post('/auth/register', { email, password });
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },
  
  // Product endpoints
  getProducts: async () => {
    try {
      const response = await axios.get('/products');
      return response.data;
    } catch (error) {
      console.error('Get products error:', error);
      throw new Error('Failed to fetch products');
    }
  },
  
  // Category endpoints
  getCategories: async () => {
    try {
      const response = await axios.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Get categories error:', error);
      throw new Error('Failed to fetch categories');
    }
  },
  
  // Cart endpoints
  getCart: async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Get cart error:', error);
      throw new Error('Failed to fetch cart');
    }
  },
  
  addToCart: async (productId, quantity) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('/cart', 
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      return response.data;
    } catch (error) {
      console.error('Add to cart error:', error);
      throw new Error('Failed to add item to cart');
    }
  }
};

export default api; 