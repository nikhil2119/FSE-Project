import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(api.isAuthenticated());
        
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await api.getProducts();
                
                // Make sure we're working with an array
                const productData = response && response.products 
                    ? response.products 
                    : Array.isArray(response) 
                        ? response 
                        : [];
                        
                setProducts(productData);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch products');
                setLoading(false);
                console.error('Error fetching products:', err);
            }
        };

        fetchProducts();
    }, []);

    const addToCart = async (productId) => {
        if (!isAuthenticated) {
            // Redirect to login if not authenticated
            window.location.href = '/login';
            return;
        }
        
        try {
            await api.addToCart(productId, 1);
            alert('Product added to cart!');
        } catch (err) {
            if (err.message.includes('401') || err.message.includes('unauthorized')) {
                alert('Please login to add items to your cart');
                window.location.href = '/login';
            } else {
                alert('Failed to add to cart. Please try again.');
            }
            console.error('Add to cart error:', err);
        }
    };

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
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-8">Our Products</h2>
            
            {products.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">No products available at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <div className="h-48 bg-gray-200 overflow-hidden">
                                <img
                                    src={product.image || 'https://placehold.co/300x300?text=Product'}
                                    alt={product.name}
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                    <button
                                        onClick={() => addToCart(product._id)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;
