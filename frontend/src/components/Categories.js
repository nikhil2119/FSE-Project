import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
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
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch categories');
                setLoading(false);
                console.error('Error fetching categories:', err);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-3xl font-bold text-center mb-12">Product Categories</h2>
            
            {categories.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">No categories available at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category) => (
                        <Link 
                            key={category._id} 
                            to={`/products?category=${category._id}`}
                            className="group block"
                        >
                            <div className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 transform hover:shadow-xl hover:-translate-y-1">
                                <div className="h-48 bg-gray-200 overflow-hidden">
                                    <img
                                        src={category.image || `https://placehold.co/400x300?text=${category.name}`}
                                        alt={category.name}
                                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {category.description || `Browse our collection of ${category.name}`}
                                    </p>
                                    <div className="flex justify-end">
                                        <span className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md group-hover:bg-blue-600 transition-colors">
                                            View Products
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Categories;
