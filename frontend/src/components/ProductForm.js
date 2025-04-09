import React, { useState, useEffect } from 'react';
import { FaImage, FaTag, FaDollarSign, FaBoxes } from 'react-icons/fa';
import api from '../services/api';

const ProductForm = ({ initialData, onSubmit, buttonText = 'Save Product' }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        compare_price: '',
        stock: '',
        category: '',
        sub_category: '',
        sku: '',
        slug: '',
        image: '',
        low_stock_threshold: '5',
        is_featured: false
    });
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // If initialData is provided, use it to populate the form
        if (initialData) {
            setFormData({
                name: initialData.name || initialData.prod_name || '',
                description: initialData.description || initialData.prod_desc || '',
                price: initialData.price || initialData.prod_price || '',
                compare_price: initialData.compare_price || '',
                stock: initialData.stock || initialData.quantity || '',
                category: initialData.category?._id || initialData.cate_id || '',
                sub_category: initialData.sub_category?._id || initialData.sub_cate_id || '',
                sku: initialData.sku || '',
                slug: initialData.slug || '',
                image: initialData.image || initialData.image_path || '',
                low_stock_threshold: initialData.low_stock_threshold ? initialData.low_stock_threshold.toString() : '5',
                is_featured: initialData.is_featured || false
            });
        }

        // Fetch categories
        const fetchCategories = async () => {
            try {
                const response = await api.getCategories();
                const categoryData = response && response.categories 
                    ? response.categories 
                    : Array.isArray(response) 
                        ? response 
                        : [];
                setCategories(categoryData);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setCategories([]);
                setError('Failed to load categories.');
            }
        };

        fetchCategories();
    }, [initialData]);

    // Generate a slug from the product name
    const generateSlug = (name) => {
        return name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    // Generate a SKU from the product name and category
    const generateSku = (name, categoryId) => {
        const date = new Date();
        const timestamp = date.getTime().toString().substr(-6);
        const namePrefix = name.replace(/[^a-zA-Z0-9]/g, '').substr(0, 3).toUpperCase();
        const catPrefix = categoryId ? categoryId.substr(-3) : 'CAT';
        return `${namePrefix}-${catPrefix}-${timestamp}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => {
            const newData = { ...prevData, [name]: value };
            
            // Auto-generate slug when name changes
            if (name === 'name') {
                newData.slug = generateSlug(value);
                
                // Auto-generate SKU when name changes
                if (prevData.category) {
                    newData.sku = generateSku(value, prevData.category);
                }
            }
            
            // Update SKU when category changes
            if (name === 'category' && prevData.name) {
                newData.sku = generateSku(prevData.name, value);
            }
            
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate required fields
            if (!formData.name || !formData.price || !formData.category) {
                setError('Please fill in all required fields');
                return;
            }

            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
                stock: parseInt(formData.stock, 10),
                category: formData.category,
                sub_category: formData.sub_category || null,
                sku: formData.sku || generateSku(formData.name, formData.category),
                slug: formData.slug || generateSlug(formData.name),
                image: formData.image,
                is_enabled: true,
                low_stock_threshold: formData.low_stock_threshold ? parseInt(formData.low_stock_threshold, 10) : 5,
                is_featured: formData.is_featured || false
            };

            // Call the passed onSubmit function with formatted data
            await onSubmit(productData);
            
            // Reset form if it's for adding a new product (no initialData)
            if (!initialData) {
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    compare_price: '',
                    stock: '',
                    category: '',
                    sub_category: '',
                    sku: '',
                    slug: '',
                    image: '',
                    low_stock_threshold: '5',
                    is_featured: false
                });
            }
        } catch (err) {
            setError(err.message || 'Failed to save product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-600 text-white">
                <h2 className="text-xl font-bold">{initialData ? 'Edit Product' : 'Add New Product'}</h2>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 mx-6 mt-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="px-6 py-4">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                        <FaTag className="inline mr-2" />
                        Product Name*
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
                            <FaDollarSign className="inline mr-2" />
                            Price*
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="stock" className="block text-gray-700 text-sm font-bold mb-2">
                            <FaBoxes className="inline mr-2" />
                            Stock*
                        </label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            min="0"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                            Category*
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map(category => (
                                <option key={category._id || category.id} value={category._id || category.id}>
                                    {category.name || category.cate_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="sub_category" className="block text-gray-700 text-sm font-bold mb-2">
                            Sub Category*
                        </label>
                        <select
                            id="sub_category"
                            name="sub_category"
                            value={formData.sub_category}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="">Select a sub category</option>
                            {/* For now, use same categories as sub-categories */}
                            {categories.map(category => (
                                <option key={category._id || category.id} value={category._id || category.id}>
                                    {category.name || category.cate_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="sku" className="block text-gray-700 text-sm font-bold mb-2">
                            SKU*
                        </label>
                        <input
                            type="text"
                            id="sku"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                            readOnly
                            placeholder="Auto-generated from product name"
                        />
                    </div>
                    <div>
                        <label htmlFor="slug" className="block text-gray-700 text-sm font-bold mb-2">
                            Slug*
                        </label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                            readOnly
                            placeholder="Auto-generated from product name"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
                        <FaImage className="inline mr-2" />
                        Image URL
                    </label>
                    <input
                        type="text"
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : buttonText}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm; 