import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if user is authenticated
        const authenticated = api.isAuthenticated();
        setIsAuthenticated(authenticated);

        const fetchCart = async () => {
            try {
                if (!authenticated) {
                    setLoading(false);
                    return; // Don't try to fetch cart if not authenticated
                }
                
                setLoading(true);
                const data = await api.getCart();
                setCart(data);
                setLoading(false);
            } catch (err) {
                if (err.message.includes('401') || err.message.includes('unauthorized')) {
                    setError('Please login to view your cart');
                } else {
                    setError('Failed to fetch cart');
                }
                setLoading(false);
                console.error('Error fetching cart:', err);
            }
        };

        fetchCart();
    }, []);

    const updateQuantity = async (productId, action) => {
        try {
            const currentItem = cart.items.find(item => item.product._id === productId);
            if (!currentItem) return;

            let newQuantity;
            if (action === 'increase') {
                newQuantity = currentItem.quantity + 1;
            } else if (action === 'decrease') {
                newQuantity = Math.max(1, currentItem.quantity - 1);
            }

            await api.addToCart(productId, newQuantity);
            
            // Update local state to reflect changes immediately
            const updatedItems = cart.items.map(item => {
                if (item.product._id === productId) {
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
            
            setCart({
                ...cart,
                items: updatedItems,
                totalPrice: updatedItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
            });
        } catch (err) {
            alert('Failed to update cart. Please try again.');
            console.error('Update cart error:', err);
        }
    };

    const removeItem = async (productId) => {
        try {
            // Implement remove item API call
            await api.addToCart(productId, 0);
            
            // Update local state
            const updatedItems = cart.items.filter(item => item.product._id !== productId);
            setCart({
                ...cart,
                items: updatedItems,
                totalPrice: updatedItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
            });
        } catch (err) {
            alert('Failed to remove item. Please try again.');
            console.error('Remove item error:', err);
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

    if (!isAuthenticated) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center py-16">
                    <div className="text-blue-500 text-5xl mb-6">
                        <FaShoppingCart className="mx-auto" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Please Log In</h2>
                    <p className="text-gray-600 mb-8">You need to be logged in to view your cart</p>
                    <Link to="/login" className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors">
                        Login to Continue
                    </Link>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center py-16">
                    <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
                    <Link to="/products" className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors">
                        <FaArrowLeft className="mr-2" /> Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-8">Your Shopping Cart</h2>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subtotal
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {cart.items.map((item) => (
                                <tr key={item.product._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-16 w-16 flex-shrink-0 mr-4">
                                                <img 
                                                    className="h-16 w-16 object-cover rounded" 
                                                    src={item.product.image || 'https://via.placeholder.com/150'} 
                                                    alt={item.product.name} 
                                                />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {item.product.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">${item.product.price.toFixed(2)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <button 
                                                onClick={() => updateQuantity(item.product._id, 'decrease')}
                                                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                                            >
                                                <FaMinus className="text-gray-600" size={10} />
                                            </button>
                                            <span className="text-gray-900 w-8 text-center">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.product._id, 'increase')}
                                                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                                            >
                                                <FaPlus className="text-gray-600" size={10} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 font-medium">
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => removeItem(item.product._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="border-t border-gray-200 px-6 py-4">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>${cart.totalPrice.toFixed(2)}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                    <div className="mt-6">
                        <Link
                            to="/checkout"
                            className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 w-full"
                        >
                            Checkout
                        </Link>
                    </div>
                    <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                        <p>
                            or{' '}
                            <Link to="/products" className="text-blue-600 hover:text-blue-500">
                                Continue Shopping
                                <span aria-hidden="true"> &rarr;</span>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
