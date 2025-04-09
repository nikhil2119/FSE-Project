import React, { useState, useEffect } from 'react';
import { FaSpinner, FaUpload, FaExclamationCircle } from 'react-icons/fa';
import api from '../services/api';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    prod_name: '',
    prod_desc: '',
    prod_price: '',
    compare_price: '',
    cate_id: '',
    sub_cate_id: '',
    stock: '',
    low_stock_threshold: 5,
    sku: '',
    image: null,
    is_featured: false,
    is_enabled: true
  });
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.getCategories();
        const allCategories = response.categories || [];
        
        // Filter out subcategories (those with parent_id)
        const mainCategories = allCategories.filter(cat => !cat.parent_id);
        setCategories(mainCategories);
        
        // If editing and we have a category ID, load its subcategories
        if (product?.cate_id) {
          const categorySubcategories = allCategories.filter(
            cat => cat.parent_id === parseInt(product.cate_id)
          );
          setSubcategories(categorySubcategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();

    // If editing, populate form with product data
    if (product) {
      setFormData({
        prod_name: product.prod_name || '',
        prod_desc: product.prod_desc || '',
        prod_price: product.prod_price || '',
        compare_price: product.compare_price || '',
        cate_id: product.cate_id || '',
        sub_cate_id: product.sub_cate_id || '',
        stock: product.stock || '',
        low_stock_threshold: product.low_stock_threshold || 5,
        sku: product.sku || '',
        image: product.image_path || null,
        is_featured: product.is_featured || false,
        is_enabled: product.is_enabled !== false
      });
      
      if (product.image_path) {
        setImagePreview(product.image_path);
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user makes changes
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      
      // Update formData with the file
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    
    setUploading(true);
    try {
      const response = await api.uploadProductImage(imageFile);
      setUploading(false);
      return response.imageUrl;
    } catch (error) {
      setErrors({ ...errors, image: 'Failed to upload image' });
      setUploading(false);
      return null;
    }
  };

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setFormData(prev => ({
      ...prev,
      cate_id: categoryId,
      sub_cate_id: '' // Reset subcategory when category changes
    }));

    try {
      setLoading(true);
      const response = await api.getCategories();
      const allCategories = response.categories || [];
      
      // Filter subcategories for the selected category
      const categorySubcategories = allCategories.filter(
        cat => cat.parent_id === parseInt(categoryId)
      );
      setSubcategories(categorySubcategories);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setError('Failed to load subcategories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.prod_name) {
      newErrors.prod_name = 'Product name is required';
    }
    
    if (!formData.prod_price) {
      newErrors.prod_price = 'Product price is required';
    } else if (isNaN(formData.prod_price) || parseFloat(formData.prod_price) <= 0) {
      newErrors.prod_price = 'Price must be a positive number';
    }
    
    if (formData.compare_price && (isNaN(formData.compare_price) || parseFloat(formData.compare_price) <= 0)) {
      newErrors.compare_price = 'Compare price must be a positive number';
    }
    
    if (!formData.cate_id) {
      newErrors.cate_id = 'Category is required';
    }
    
    if (!formData.sub_cate_id) {
      newErrors.sub_cate_id = 'Subcategory is required';
    }
    
    if (!formData.stock) {
      newErrors.stock = 'Stock quantity is required';
    } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }
    
    if (formData.low_stock_threshold && (isNaN(formData.low_stock_threshold) || parseInt(formData.low_stock_threshold) < 0)) {
      newErrors.low_stock_threshold = 'Low stock threshold must be a non-negative number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      let imageUrl = null;
      
      // Only upload image if a new one was selected
      if (imageFile) {
        imageUrl = await handleImageUpload();
        if (!imageUrl && !formData.image) {
          setLoading(false);
          return;
        }
      }
      
      // Prepare data for submission
      const productData = {
        ...formData
      };
      
      // Add image URL if one was uploaded
      if (imageUrl) {
        productData.image_path = imageUrl;
      }
      
      // Generate SKU if not provided
      if (!productData.sku) {
        productData.sku = `SKU-${Date.now()}`;
      }
      
      // Convert numeric fields to proper types
      productData.prod_price = parseFloat(productData.prod_price);
      productData.compare_price = productData.compare_price ? parseFloat(productData.compare_price) : null;
      productData.stock = parseInt(productData.stock);
      productData.low_stock_threshold = parseInt(productData.low_stock_threshold);
      
      await onSubmit(productData);
    } catch (error) {
      console.error('Form submission error:', error);
      setError(error.message || 'Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="prod_name"
              value={formData.prod_name}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.prod_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter product name"
            />
            {errors.prod_name && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <FaExclamationCircle className="mr-1" /> {errors.prod_name}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="prod_desc"
              value={formData.prod_desc}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
              placeholder="Enter product description"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="prod_price"
              value={formData.prod_price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.prod_price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter price"
            />
            {errors.prod_price && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <FaExclamationCircle className="mr-1" /> {errors.prod_price}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Compare Price
            </label>
            <input
              type="number"
              name="compare_price"
              value={formData.compare_price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.compare_price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter compare price (optional)"
            />
            {errors.compare_price && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <FaExclamationCircle className="mr-1" /> {errors.compare_price}
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="cate_id"
              value={formData.cate_id || ''}
              onChange={handleCategoryChange}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.cate_id ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.cate_name || category.name}
                </option>
              ))}
            </select>
            {errors.cate_id && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <FaExclamationCircle className="mr-1" /> {errors.cate_id}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subcategory <span className="text-red-500">*</span>
            </label>
            <select
              name="sub_cate_id"
              value={formData.sub_cate_id || ''}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.sub_cate_id ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={!formData.cate_id}
            >
              <option value="">Select a subcategory</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.cate_name || subcategory.name}
                </option>
              ))}
            </select>
            {errors.sub_cate_id && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <FaExclamationCircle className="mr-1" /> {errors.sub_cate_id}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.stock ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter stock quantity"
            />
            {errors.stock && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <FaExclamationCircle className="mr-1" /> {errors.stock}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Low Stock Threshold
            </label>
            <input
              type="number"
              name="low_stock_threshold"
              value={formData.low_stock_threshold}
              onChange={handleChange}
              min="0"
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.low_stock_threshold ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter low stock threshold"
            />
            {errors.low_stock_threshold && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <FaExclamationCircle className="mr-1" /> {errors.low_stock_threshold}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
              placeholder="Enter SKU (optional)"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto h-32 w-32 object-cover"
                  />
                ) : (
                  <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="image-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="image-upload"
                      name="image"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Featured Product</span>
            </label>
          </div>

          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="is_enabled"
                checked={formData.is_enabled}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Enabled</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || uploading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading || uploading ? (
            <FaSpinner className="animate-spin h-5 w-5" />
          ) : (
            'Save Product'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm; 