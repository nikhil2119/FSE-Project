import axios from 'axios';

// Set the base URL for all requests
axios.defaults.baseURL = 'http://localhost:5000/api';

// Auth helper functions
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Initialize auth header from localStorage
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Simple API client
const api = {
  // HTTP methods
  get: async (url) => {
    try {
      const response = await axios.get(url);
      return response;
    } catch (error) {
      console.error(`GET ${url} error:`, error);
      throw new Error(error.response?.data?.message || `Failed to fetch data from ${url}`);
    }
  },
  
  post: async (url, data) => {
    try {
      const response = await axios.post(url, data);
      return response;
    } catch (error) {
      console.error(`POST ${url} error:`, error);
      throw new Error(error.response?.data?.message || `Failed to post data to ${url}`);
    }
  },
  
  put: async (url, data) => {
    try {
      const response = await axios.put(url, data);
      return response;
    } catch (error) {
      console.error(`PUT ${url} error:`, error);
      throw new Error(error.response?.data?.message || `Failed to update data at ${url}`);
    }
  },
  
  delete: async (url) => {
    try {
      const response = await axios.delete(url);
      return response;
    } catch (error) {
      console.error(`DELETE ${url} error:`, error);
      throw new Error(error.response?.data?.message || `Failed to delete data at ${url}`);
    }
  },
  
  // Auth endpoints
  login: async (user_email, user_pwd) => {
    try {
      const response = await axios.post('/auth/login', { user_email, user_pwd });
      const { token, user } = response.data;
      
      // Set token in localStorage and axios defaults
      setAuthToken(token);
      
      // Store user info
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },
  
  // Admin auth endpoints
  adminLogin: async (admin_email, admin_pwd) => {
    try {
      const response = await axios.post('/auth/admin/login', { email: admin_email, password: admin_pwd });
      const { token, admin } = response.data;
      
      // Set token in localStorage and axios defaults
      setAuthToken(token);
      
      // Store admin info
      if (admin) {
        localStorage.setItem('user', JSON.stringify({...admin, isAdmin: true, role: 'admin'}));
      }
      
      return response.data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw new Error(error.response?.data?.message || 'Admin login failed');
    }
  },
  
  // Seller auth endpoints
  sellerLogin: async (seller_email, seller_pwd) => {
    try {
      const response = await axios.post('/auth/seller/login', { email: seller_email, password: seller_pwd });
      const { token, seller } = response.data;
      
      // Set token in localStorage and axios defaults
      setAuthToken(token);
      
      // Store seller info
      if (seller) {
        localStorage.setItem('user', JSON.stringify({...seller, isSeller: true, role: 'seller'}));
      }
      
      return response.data;
    } catch (error) {
      console.error('Seller login error:', error);
      throw new Error(error.response?.data?.message || 'Seller login failed');
    }
  },
  
  logout: () => {
    // Clear auth token and user data
    setAuthToken(null);
    localStorage.removeItem('user');
  },
  
  register: async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },
  
  // Profile endpoints
  getProfile: async () => {
    try {
      const response = await axios.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  },
  
  updateProfile: async (profileData) => {
    try {
      const response = await axios.put('/auth/me', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },
  
  // Product endpoints
  getProducts: async () => {
    try {
      const response = await axios.get('/products');
      
      // Handle different response formats
      if (response.data && response.data.status === 'success') {
        // If response is in the format { status: 'success', data: { products: [...] } }
        return response.data;
      } else if (Array.isArray(response.data)) {
        // If response is already an array of products
        return { data: { products: response.data } };
      } else if (response.data && Array.isArray(response.data.products)) {
        // If response is in the format { products: [...] }
        return { data: { products: response.data.products } };
      } else {
        // Default case, ensure we return an object with an empty products array
        console.warn('Unexpected response format from products API:', response.data);
        return { data: { products: [] } };
      }
    } catch (error) {
      console.error('Get products error:', error);
      throw new Error('Failed to fetch products');
    }
  },
  
  // Category endpoints
  getCategories: async () => {
    try {
      const response = await axios.get('/categories');
      
      // Handle different response formats
      if (response.data && response.data.status === 'success') {
        // If response is in the format { status: 'success', categories: [...] }
        return {
          categories: response.data.categories || []
        };
      } else if (Array.isArray(response.data)) {
        // If response is already an array of categories
        return { categories: response.data };
      } else if (response.data && Array.isArray(response.data.categories)) {
        // If response is in the format { categories: [...] }
        return { categories: response.data.categories };
      } else {
        // Default case, ensure we return an object with an empty categories array
        console.warn('Unexpected response format from categories API:', response.data);
        return { categories: [] };
      }
    } catch (error) {
      console.error('Get categories error:', error);
      throw new Error('Failed to fetch categories');
    }
  },
  
  createCategory: async (categoryData) => {
    try {
      const response = await axios.post('/categories', {
        cate_name: categoryData.name,
        cate_desc: categoryData.description,
        image_path: categoryData.image,
        is_enabled: true
      });
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },
  
  updateCategory: async (id, categoryData) => {
    try {
      const response = await axios.put(`/categories/${id}`, {
        cate_name: categoryData.name,
        cate_desc: categoryData.description,
        image_path: categoryData.image,
        is_enabled: categoryData.is_enabled
      });
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },
  
  deleteCategory: async (id) => {
    try {
      const response = await axios.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
  
  // Cart endpoints
  getCart: async () => {
    try {
      const response = await axios.get('/cart');
      return response.data;
    } catch (error) {
      console.error('Get cart error:', error);
      throw new Error('Failed to fetch cart');
    }
  },
  
  addToCart: async (productId, quantity) => {
    try {
      const response = await axios.post('/cart', { productId, quantity });
      return response.data;
    } catch (error) {
      console.error('Add to cart error:', error);
      throw new Error('Failed to add item to cart');
    }
  },
  
  // Auth helper methods
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return null;
    }
    
    try {
      const user = JSON.parse(userStr);
      return user;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },
  
  getCurrentUserId: () => {
    const user = api.getCurrentUser();
    return user?.id || user?._id || null;
  },
  
  isAdmin: () => {
    const user = api.getCurrentUser();
    return user && (user.isAdmin || user.role === 'admin' || user.role === 'super_admin');
  },

  isSeller: () => {
    const user = api.getCurrentUser();
    return user && user.role === 'seller';
  },
  
  // Location data endpoints
  getStates: async () => {
    try {
      const response = await axios.get('/states');
      return response.data;
    } catch (error) {
      console.error('Get states error:', error);
      throw new Error('Failed to fetch states');
    }
  },
  
  getCitiesByState: async (stateId) => {
    try {
      const response = await axios.get(`/cities?state_id=${stateId}`);
      return response.data;
    } catch (error) {
      console.error('Get cities error:', error);
      throw new Error('Failed to fetch cities');
    }
  },
  
  // User address endpoints
  getUserAddresses: async () => {
    try {
      const response = await axios.get('/user/addresses');
      return response.data;
    } catch (error) {
      console.error('Get addresses error:', error);
      throw new Error('Failed to fetch addresses');
    }
  },
  
  addUserAddress: async (addressData) => {
    try {
      const response = await axios.post('/user/addresses', addressData);
      return response.data;
    } catch (error) {
      console.error('Add address error:', error);
      throw new Error('Failed to add address');
    }
  },
  
  updateUserAddress: async (addressId, addressData) => {
    try {
      const response = await axios.put(`/user/addresses/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      console.error('Update address error:', error);
      throw new Error('Failed to update address');
    }
  },
  
  deleteUserAddress: async (addressId) => {
    try {
      const response = await axios.delete(`/user/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      console.error('Delete address error:', error);
      throw new Error('Failed to delete address');
    }
  },
  
  // Product management endpoints
  createProduct: async (productData) => {
    try {
      // Map frontend field names to backend field names
      const categoryId = productData.category || productData.cate_id;
      const subCategoryId = productData.sub_category || productData.sub_cate_id;

      // Validate category and subcategory IDs
      if (categoryId) {
        // Check if category exists
        const categoriesResponse = await axios.get('/categories');
        const categories = categoriesResponse.data.categories || [];
        const categoryExists = categories.some(cat => 
          (cat.id === categoryId || cat._id === categoryId || cat.cate_id === categoryId)
        );
        
        if (!categoryExists) {
          throw new Error(`Category with ID ${categoryId} does not exist`);
        }
        
        // If subcategory is provided, check if it exists and belongs to the selected category
        if (subCategoryId) {
          const subcategoryExists = categories.some(
            cat => (cat.id === subCategoryId || cat._id === subCategoryId || cat.cate_id === subCategoryId) && 
                  (cat.parent_id === categoryId || cat.parent_category_id === categoryId)
          );
          
          if (!subcategoryExists) {
            throw new Error(`Subcategory with ID ${subCategoryId} does not exist or does not belong to the selected category`);
          }
        }
      }
      
      // Set auth token if available
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      // Generate slug from product name if not provided
      const slug = productData.slug || productData.prod_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Map the product data to the API expected fields
      const productPayload = {
        prod_name: productData.name || productData.prod_name,
        prod_desc: productData.description || productData.prod_desc,
        prod_price: productData.price || productData.prod_price,
        compare_price: productData.compare_price,
        cate_id: categoryId,
        sub_cate_id: subCategoryId,
        stock: productData.stock,
        low_stock_threshold: productData.low_stock_threshold || 5,
        sku: productData.sku || `SKU-${Date.now()}`,
        slug: slug,
        is_featured: productData.is_featured || false,
        is_enabled: productData.is_enabled !== false,
        seller_id: productData.seller_id
      };
      
      console.log('Sending product data to API:', productPayload);
      
      const response = await axios.post('/products', productPayload);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  
  updateProduct: async (id, productData) => {
    try {
      // Set auth token if available
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      // Map the product data to the API expected fields
      const productPayload = {
        prod_name: productData.prod_name || productData.name,
        prod_desc: productData.prod_desc || productData.description,
        prod_price: productData.prod_price || productData.price,
        compare_price: productData.compare_price,
        cate_id: productData.cate_id || productData.category,
        sub_cate_id: productData.sub_cate_id || productData.subCategory,
        stock: productData.stock,
        low_stock_threshold: productData.low_stock_threshold || productData.lowStockThreshold || 5,
        sku: productData.sku,
        is_featured: productData.is_featured || productData.isFeatured || false,
        is_enabled: productData.is_enabled !== false
      };
      
      // Add image_path if provided
      if (productData.image_path) {
        productPayload.image_path = productData.image_path;
      }
      
      console.log('Updating product with data:', productPayload);
      
      const response = await axios.put(`/products/${id}`, productPayload);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },
  
  deleteProduct: async (id) => {
    try {
      const response = await axios.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },
  
  getSellerProducts: async () => {
    try {
      const response = await axios.get('/products/seller', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching seller products:', error);
      throw error;
    }
  },
  
  // Product image endpoints
  uploadProductImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.post('/products/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Handle different response formats
      if (response.data && response.data.imageUrl) {
        return response.data;
      } else if (response.data && response.data.image_path) {
        return { imageUrl: response.data.image_path };
      } else if (response.data && response.data.url) {
        return { imageUrl: response.data.url };
      } else if (typeof response.data === 'string') {
        return { imageUrl: response.data };
      }
      
      console.warn('Unexpected image upload response format:', response.data);
      return { imageUrl: '' };
    } catch (error) {
      console.error('Upload product image error:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
  },
};

export default api; 