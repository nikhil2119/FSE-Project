import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaSearch } from 'react-icons/fa';
import api from '../../services/api';
import ProductForm from '../../components/ProductForm';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all products (admin can see all products)
                const response = await api.getProducts();
                // Extract products array from the response
                const productsData = response.data ? response.data.products || [] : [];
                setProducts(productsData);
                
                // Get categories for the filter
                const categoriesData = await api.getCategories();
                // Extract categories from the response if it's nested
                const categories = categoriesData.categories || categoriesData || [];
                setCategories(categories);
            } catch (err) {
                setError('Failed to load products. Please try again later.');
                console.error('Error fetching products:', err);
                // Initialize with empty array to prevent filter errors
                setProducts([]);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    // Ensure products is always an array before filtering
    const filteredProducts = Array.isArray(products) ? products.filter(product => {
        const prod_name = product.prod_name || product.name || '';
        const prod_desc = product.prod_desc || product.description || '';
        const categoryId = product.cate_id || (product.category && (product.category._id || product.category.id)) || '';
        
        const matchesSearch = searchTerm === '' || 
            prod_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prod_desc.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = categoryFilter === '' || categoryId === categoryFilter;
        
        return matchesSearch && matchesCategory;
    }) : [];

    const handleAddProduct = async (productData) => {
        setLoading(true);
        try {
            // Get the current user/admin ID to use as seller_id
            const userId = api.getCurrentUserId();
            
            // Add seller_id to the product data
            const productWithSellerId = {
                ...productData,
                seller_id: userId // Add the seller_id field
            };
            
            console.log('Submitting product data:', productWithSellerId);
            
            const newProduct = await api.createProduct(productWithSellerId);
            setProducts([...products, newProduct]);
            setIsAddModalOpen(false);
            setMessage('Product added successfully');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError('Failed to add product: ' + (err.message || 'Unknown error'));
            console.error('Error adding product:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditProduct = async (productData) => {
        setLoading(true);
        try {
            // Get the current user/admin ID to use as seller_id if not already present
            const userId = api.getCurrentUserId();
            
            // Add seller_id to the product data if not already present
            const productWithSellerId = {
                ...productData,
                seller_id: productData.seller_id || selectedProduct.seller_id || userId
            };
            
            const updatedProduct = await api.updateProduct(selectedProduct._id || selectedProduct.id, productWithSellerId);
            setProducts(products.map(p => (p._id === updatedProduct._id || p.id === updatedProduct.id) ? updatedProduct : p));
            setIsEditModalOpen(false);
            setSelectedProduct(null);
            alert('Product updated successfully');
        } catch (err) {
            setError('Failed to update product. Please try again.');
            console.error('Error updating product:', err);
        }
        setLoading(false);
    };

    const handleDeleteProduct = async () => {
        setLoading(true);
        try {
            await api.deleteProduct(selectedProduct._id);
            setProducts(products.filter(p => p._id !== selectedProduct._id));
            setIsDeleteModalOpen(false);
            setSelectedProduct(null);
            alert('Product deleted successfully');
        } catch (err) {
            setError('Failed to delete product. Please try again.');
            console.error('Error deleting product:', err);
        }
        setLoading(false);
    };

    const openEditModal = (product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (product) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    if (loading && products.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-blue-500 text-4xl" />
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">Product Management</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <FaPlus className="mr-2" /> Add New Product
                </button>
            </div>

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="relative flex-grow">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category._id || category.id} value={category._id || category.id}>
                                    {category.name || category.cate_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No products found. Add your first product by clicking the "Add New Product" button.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Seller
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id || product._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {product.image ? (
                                                    <img className="h-10 w-10 rounded-full mr-3 object-cover" src={product.image} alt={product.prod_name || product.name} />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-gray-500">
                                                        No img
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900">{product.prod_name || product.name}</div>
                                                    <div className="text-sm text-gray-500 truncate max-w-xs">{product.prod_desc || product.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                                {(product.category && (product.category.name || product.category.cate_name)) || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.seller?.user_name || 'Admin'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                            ${(product.prod_price || product.price || 0).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                            {product.stock}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {product.inStock || product.is_enabled ? (
                                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                                    In Stock
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                                    Out of Stock
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => openEditModal(product)}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(product)}
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

            {/* Add Product Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                        <h2 className="text-xl font-bold mb-4">Add New Product</h2>
                        <ProductForm 
                            onSubmit={handleAddProduct}
                            onCancel={() => setIsAddModalOpen(false)}
                        />
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                        <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                        <ProductForm 
                            product={selectedProduct}
                            onSubmit={handleEditProduct}
                            onCancel={() => setIsEditModalOpen(false)}
                        />
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Delete Product</h2>
                        <p className="mb-6">
                            Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button 
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeleteProduct}
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

export default AdminProducts; 