import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaSpinner } from 'react-icons/fa';
import api from '../../services/api';

const AdminSubcategories = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    parent_id: ''
  });

  // Fetch all categories and subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.getCategories();
        
        // Make sure we're working with an array
        const categoryData = response && response.categories 
          ? response.categories 
          : Array.isArray(response) 
            ? response 
            : [];
        
        setCategories(categoryData);
        
        // Filter to get only subcategories (categories with parent_id)
        const subcategoryData = categoryData.filter(category => category.parent_id);
        setSubcategories(subcategoryData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching subcategories:', err);
        setError('Failed to load subcategories. Please try again.');
        setSubcategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter subcategories by search term
  const filteredSubcategories = subcategories.filter(subcategory =>
    subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subcategory.description && subcategory.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubcategory = async () => {
    try {
      // Prepare subcategory data for API
      const subcategoryData = {
        name: formData.name,
        description: formData.description,
        image: formData.image,
        parent_id: formData.parent_id
      };
      
      // Call the API to add a new subcategory
      const response = await api.createCategory(subcategoryData);
      
      // Add the new subcategory to the local state
      const newSubcategory = response.data || response.category || response;
      setSubcategories([...subcategories, newSubcategory]);
      
      // Reset form and close modal
      setFormData({ name: '', description: '', image: '', parent_id: '' });
      setIsAddModalOpen(false);
      
      // Show success message
      alert('Subcategory added successfully');
    } catch (err) {
      console.error('Error adding subcategory:', err);
      setError('Failed to add subcategory. Please try again.');
    }
  };

  const handleUpdateSubcategory = async () => {
    try {
      // Prepare subcategory data for API
      const subcategoryData = {
        name: formData.name,
        description: formData.description,
        image: formData.image,
        parent_id: formData.parent_id
      };
      
      // Call the API to update the subcategory
      const response = await api.updateCategory(
        selectedSubcategory._id || selectedSubcategory.id,
        subcategoryData
      );
      
      // Update the subcategory in the local state
      const updatedSubcategory = response.data || response.category || response;
      setSubcategories(subcategories.map(subcategory => 
        (subcategory._id === updatedSubcategory._id || subcategory.id === updatedSubcategory.id)
          ? updatedSubcategory
          : subcategory
      ));
      
      // Reset form and close modal
      setFormData({ name: '', description: '', image: '', parent_id: '' });
      setIsEditModalOpen(false);
      setSelectedSubcategory(null);
      
      // Show success message
      alert('Subcategory updated successfully');
    } catch (err) {
      console.error('Error updating subcategory:', err);
      setError('Failed to update subcategory. Please try again.');
    }
  };

  const handleDeleteSubcategory = async () => {
    try {
      // Call the API to delete the subcategory
      await api.deleteCategory(selectedSubcategory._id || selectedSubcategory.id);
      
      // Remove the subcategory from the local state
      setSubcategories(subcategories.filter(subcategory => 
        subcategory._id !== selectedSubcategory._id && subcategory.id !== selectedSubcategory.id
      ));
      
      // Close modal and reset selected subcategory
      setIsDeleteModalOpen(false);
      setSelectedSubcategory(null);
      
      // Show success message
      alert('Subcategory deleted successfully');
    } catch (err) {
      console.error('Error deleting subcategory:', err);
      setError('Failed to delete subcategory. Please try again.');
    }
  };

  const openEditModal = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setFormData({
      name: subcategory.name || '',
      description: subcategory.description || '',
      image: subcategory.image || '',
      parent_id: subcategory.parent_id || ''
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setIsDeleteModalOpen(true);
  };

  // Get parent category name
  const getParentCategoryName = (parentId) => {
    const parentCategory = categories.find(category => 
      category._id === parentId || category.id === parentId
    );
    return parentCategory ? parentCategory.name : 'Unknown Category';
  };

  if (loading && subcategories.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Subcategory Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" /> Add New Subcategory
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative mb-4">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search subcategories..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredSubcategories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No subcategories found. Add your first subcategory by clicking the "Add New Subcategory" button.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subcategory
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubcategories.map((subcategory) => (
                  <tr key={subcategory._id || subcategory.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {subcategory.image ? (
                          <img className="h-10 w-10 rounded-full mr-3 object-cover" src={subcategory.image} alt={subcategory.name} />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-gray-500">
                            No img
                          </div>
                        )}
                        <div className="font-medium text-gray-900">{subcategory.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {getParentCategoryName(subcategory.parent_id)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {subcategory.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(subcategory)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => openDeleteModal(subcategory)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Subcategory Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Subcategory</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleAddSubcategory(); }}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="parent_id" className="block text-gray-700 text-sm font-bold mb-2">
                  Parent Category*
                </label>
                <select
                  id="parent_id"
                  name="parent_id"
                  value={formData.parent_id}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select a parent category</option>
                  {categories.filter(category => !category.parent_id).map(category => (
                    <option key={category._id || category.id} value={category._id || category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Subcategory Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Subcategory</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateSubcategory(); }}>
              <div className="mb-4">
                <label htmlFor="edit-name" className="block text-gray-700 text-sm font-bold mb-2">
                  Name*
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-parent_id" className="block text-gray-700 text-sm font-bold mb-2">
                  Parent Category*
                </label>
                <select
                  id="edit-parent_id"
                  name="parent_id"
                  value={formData.parent_id}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select a parent category</option>
                  {categories.filter(category => !category.parent_id).map(category => (
                    <option key={category._id || category.id} value={category._id || category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-description" className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-image" className="block text-gray-700 text-sm font-bold mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  id="edit-image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedSubcategory(null);
                  }}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Delete Subcategory</h2>
            <p className="mb-6">
              Are you sure you want to delete "{selectedSubcategory?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedSubcategory(null);
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteSubcategory}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubcategories; 