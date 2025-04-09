import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaTachometerAlt } from 'react-icons/fa';
import api from '../services/api';
import { updateUser } from '../features/auth/authSlice';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        user_name: '',
        user_email: '',
        phone: '',
        user_age: '',
        user_pwd: '',
        confirm_pwd: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                
                if (!isLoggedIn) {
                    navigate('/login');
                    return;
                }
                
                // Fetch full user profile from API
                const response = await api.get('/auth/me');
                const userData = response.data;
                
                setUser(userData);
                // Update Redux store with fresh user data
                dispatch(updateUser(userData));
                
                setFormData({
                    user_name: userData.user_name || '',
                    user_email: userData.user_email || '',
                    phone: userData.phone || '',
                    user_age: userData.user_age || '',
                    user_pwd: '',
                    confirm_pwd: ''
                });
            } catch (err) {
                setError('Failed to load profile. Please try again later.');
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate, isLoggedIn, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Validate passwords match if provided
        if (formData.user_pwd && formData.user_pwd !== formData.confirm_pwd) {
            setError('Passwords do not match');
            return;
        }

        try {
            // Create data object, excluding empty password fields
            const updateData = { ...formData };
            if (!updateData.user_pwd) {
                delete updateData.user_pwd;
                delete updateData.confirm_pwd;
            } else {
                delete updateData.confirm_pwd;
            }

            // Update profile
            await api.put('/auth/me', updateData);
            setMessage('Profile updated successfully');
            setEditing(false);
            
            // Refresh user data
            const response = await api.get('/auth/me');
            const updatedUser = response.data;
            setUser(updatedUser);
            
            // Update Redux store with new user data
            dispatch(updateUser(updatedUser));
        } catch (err) {
            setError(err.message || 'Failed to update profile');
            console.error('Error updating profile:', err);
        }
    };

    const goToDashboard = () => {
        if (user && user.role === 'admin') {
            navigate('/admin');
        } else if (user && user.role === 'seller') {
            navigate('/seller');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-blue-600 text-white">
                    <h1 className="text-2xl font-bold">My Profile</h1>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 mx-6 mt-4">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 mx-6 mt-4">
                        {message}
                    </div>
                )}

                {user && user.role !== 'user' && (
                    <div className="px-6 py-4 border-b border-gray-200">
                        <button 
                            onClick={goToDashboard}
                            className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                            <FaTachometerAlt className="mr-2" />
                            {user.role === 'admin' ? 'Go to Admin Dashboard' : 'Go to Seller Dashboard'}
                        </button>
                    </div>
                )}

                <div className="px-6 py-4">
                    {editing ? (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="user_name" className="block text-gray-700 text-sm font-bold mb-2">
                                    <FaUser className="inline mr-2" /> Name
                                </label>
                                <input
                                    type="text"
                                    id="user_name"
                                    name="user_name"
                                    value={formData.user_name}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="user_email" className="block text-gray-700 text-sm font-bold mb-2">
                                    <FaEnvelope className="inline mr-2" /> Email
                                </label>
                                <input
                                    type="email"
                                    id="user_email"
                                    name="user_email"
                                    value={formData.user_email}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                                    <FaPhone className="inline mr-2" /> Phone
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="user_age" className="block text-gray-700 text-sm font-bold mb-2">
                                    Age
                                </label>
                                <input
                                    type="number"
                                    id="user_age"
                                    name="user_age"
                                    value={formData.user_age}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    min="0"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="user_pwd" className="block text-gray-700 text-sm font-bold mb-2">
                                    <FaLock className="inline mr-2" /> New Password (leave blank to keep current)
                                </label>
                                <input
                                    type="password"
                                    id="user_pwd"
                                    name="user_pwd"
                                    value={formData.user_pwd}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="confirm_pwd" className="block text-gray-700 text-sm font-bold mb-2">
                                    <FaLock className="inline mr-2" /> Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    id="confirm_pwd"
                                    name="confirm_pwd"
                                    value={formData.confirm_pwd}
                                    onChange={handleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <div className="mb-4">
                                <p className="text-gray-700 text-sm font-bold mb-1">Role</p>
                                <p className="text-gray-700">
                                    <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2">
                                        {user?.role?.toUpperCase() || 'User'}
                                    </span>
                                </p>
                            </div>
                            <div className="mb-4">
                                <p className="text-gray-700 text-sm font-bold mb-1">
                                    <FaUser className="inline mr-2" /> Name
                                </p>
                                <p className="text-gray-700">{user?.user_name}</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-gray-700 text-sm font-bold mb-1">
                                    <FaEnvelope className="inline mr-2" /> Email
                                </p>
                                <p className="text-gray-700">{user?.user_email}</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-gray-700 text-sm font-bold mb-1">
                                    <FaPhone className="inline mr-2" /> Phone
                                </p>
                                <p className="text-gray-700">{user?.phone || 'Not provided'}</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-gray-700 text-sm font-bold mb-1">Age</p>
                                <p className="text-gray-700">{user?.user_age || 'Not provided'}</p>
                            </div>
                            <div className="mb-6">
                                <p className="text-gray-700 text-sm font-bold mb-1">Last Login</p>
                                <p className="text-gray-700">
                                    {user?.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <button
                                    onClick={() => setEditing(true)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile; 