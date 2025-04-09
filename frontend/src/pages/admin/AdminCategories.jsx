import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import api from '../../services/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [formData, setFormData] = useState({
    cate_name: '',
    cate_desc: '',
    image_path: '',
    parent_id: null,
    is_enabled: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.getCategories();
      setCategories(response.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditingCategory) {
      await handleUpdateCategory();
    } else {
      await handleAddCategory();
    }
  };

  const handleAddCategory = async () => {
    try {
      // Prepare category data for API
      const categoryData = {
        cate_name: formData.cate_name,
        cate_desc: formData.cate_desc,
        image_path: formData.image_path,
        parent_id: formData.parent_id || null,
        is_enabled: formData.is_enabled
      };
      
      // Call the API to add a new category
      const response = await api.createCategory(categoryData);
      
      // Add the new category to the local state
      setCategories([...categories, response.data || response.category || response]);
      setFormData({ cate_name: '', cate_desc: '', image_path: '', parent_id: null, is_enabled: true });
      setIsAddingCategory(false);
      setMessage('Category added successfully');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      // Extract the error message from the error object
      const errorMessage = err.message || 'Failed to add category';
      
      // Check if it's a duplicate entry error
      if (errorMessage.includes('already exists')) {
        setError('A category with this name already exists. Please use a different name.');
      } else {
        setError(`Failed to add category: ${errorMessage}`);
      }
      
      console.error('Error adding category:', err);
    }
  };

  const handleUpdateCategory = async () => {
    try {
      const response = await api.updateCategory(formData.id, {
        cate_name: formData.cate_name,
        cate_desc: formData.cate_desc,
        image_path: formData.image_path,
        parent_id: formData.parent_id,
        is_enabled: formData.is_enabled
      });
      
      // Update the category in the local state
      setCategories(categories.map(cat => 
        cat.id === formData.id ? response.data || response.category || response : cat
      ));
      
      setFormData({ cate_name: '', cate_desc: '', image_path: '', parent_id: null, is_enabled: true });
      setIsEditingCategory(false);
      setMessage('Category updated successfully');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err.message || 'Failed to update category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }
    
    try {
      await api.deleteCategory(id);
      setCategories(categories.filter(cat => cat.id !== id));
      setMessage('Category deleted successfully');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting category:', err);
      setError(err.message || 'Failed to delete category');
    }
  };

  const handleEditClick = (category) => {
    setFormData({
      id: category.id,
      cate_name: category.cate_name || category.name,
      cate_desc: category.cate_desc || category.description,
      image_path: category.image_path || category.image,
      parent_id: category.parent_id,
      is_enabled: category.is_enabled
    });
    setIsEditingCategory(true);
    setIsAddingCategory(true);
  };

  const toggleExpand = (categoryId) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Get parent categories (categories without parent_id)
  const parentCategories = categories.filter(category => 
    !category.parent_id
  );

  // Get subcategories for a given parent category
  const getSubcategories = (parentId) => {
    return categories.filter(category => 
      category.parent_id === parentId
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => {
            setIsAddingCategory(true);
            setIsEditingCategory(false);
            setFormData({
              cate_name: '',
              cate_desc: '',
              image_path: '',
              parent_id: null,
              is_enabled: true
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FaPlus className="inline-block mr-2" />
          Add Category
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}

      {isAddingCategory && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {isEditingCategory ? 'Edit Category' : 'Add New Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="cate_name"
                value={formData.cate_name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="cate_desc"
                value={formData.cate_desc}
                onChange={handleInputChange}
                rows="3"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Category
              </label>
              <select
                name="parent_id"
                value={formData.parent_id || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">None (Top Level Category)</option>
                {parentCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.cate_name || category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                name="image_path"
                value={formData.image_path}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter image URL"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_enabled"
                checked={formData.is_enabled}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Enabled
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsAddingCategory(false);
                  setFormData({
                    cate_name: '',
                    cate_desc: '',
                    image_path: '',
                    parent_id: null,
                    is_enabled: true
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isEditingCategory ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {parentCategories.map(category => (
            <CategoryItem
              key={category.id}
              category={category}
              subcategories={getSubcategories(category.id)}
              onEdit={handleEditClick}
              onDelete={handleDeleteCategory}
              isExpanded={expandedCategories.has(category.id)}
              onToggleExpand={() => toggleExpand(category.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const CategoryItem = ({ category, subcategories, onEdit, onDelete, isExpanded, onToggleExpand }) => {
  const hasSubcategories = subcategories.length > 0;
  const level = 0;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {hasSubcategories && (
            <button
              onClick={onToggleExpand}
              className="text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          )}
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {category.cate_name || category.name}
            </h3>
            <p className="text-sm text-gray-500">
              {category.cate_desc || category.description || 'No description'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(category)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="text-red-600 hover:text-red-800"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {isExpanded && hasSubcategories && (
        <div className="mt-4 ml-8 space-y-4">
          {subcategories.map(subcategory => (
            <CategoryItem
              key={subcategory.id}
              category={subcategory}
              subcategories={[]}
              onEdit={onEdit}
              onDelete={onDelete}
              isExpanded={false}
              onToggleExpand={() => {}}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategories; 