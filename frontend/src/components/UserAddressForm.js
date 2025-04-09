import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FaHome, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';

const UserAddressForm = ({ onSubmit, existingAddress = null }) => {
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        address_type: existingAddress?.address_type || 'Home',
        primary_addr: existingAddress?.primary_addr || '',
        landmark: existingAddress?.landmark || '',
        pin_code: existingAddress?.pin_code || '',
        state_id: existingAddress?.state_id || '',
        city_id: existingAddress?.city_id || '',
        is_default: existingAddress?.is_default || false
    });

    // Fetch states on component mount
    useEffect(() => {
        const fetchStates = async () => {
            try {
                setLoading(true);
                // Implement this API endpoint in your backend
                const response = await api.getStates();
                setStates(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching states:', error);
                setLoading(false);
            }
        };

        fetchStates();
    }, []);

    // Fetch cities when state changes
    useEffect(() => {
        const fetchCities = async () => {
            if (!formData.state_id) return;
            
            try {
                setLoading(true);
                // Implement this API endpoint in your backend
                const response = await api.getCitiesByState(formData.state_id);
                setCities(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cities:', error);
                setLoading(false);
            }
        };

        fetchCities();
    }, [formData.state_id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate pin code (6 digits)
        if (!/^\d{6}$/.test(formData.pin_code)) {
            alert('PIN code must be 6 digits');
            return;
        }
        
        // Call the onSubmit callback with the form data
        onSubmit(formData);
    };

    return (
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Address Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Address Type
                    </label>
                    <div className="mt-2 flex space-x-4">
                        <div className="flex items-center">
                            <input
                                id="address-type-home"
                                name="address_type"
                                type="radio"
                                value="Home"
                                checked={formData.address_type === 'Home'}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label htmlFor="address-type-home" className="ml-2 block text-sm text-gray-700">
                                <FaHome className="inline mr-1" /> Home
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="address-type-office"
                                name="address_type"
                                type="radio"
                                value="Office"
                                checked={formData.address_type === 'Office'}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label htmlFor="address-type-office" className="ml-2 block text-sm text-gray-700">
                                <FaBuilding className="inline mr-1" /> Office
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="address-type-other"
                                name="address_type"
                                type="radio"
                                value="Other"
                                checked={formData.address_type === 'Other'}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label htmlFor="address-type-other" className="ml-2 block text-sm text-gray-700">
                                <FaMapMarkerAlt className="inline mr-1" /> Other
                            </label>
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div>
                    <label htmlFor="primary_addr" className="block text-sm font-medium text-gray-700">
                        Address
                    </label>
                    <div className="mt-1">
                        <textarea
                            id="primary_addr"
                            name="primary_addr"
                            rows={3}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Enter your full address"
                            value={formData.primary_addr}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Landmark */}
                <div>
                    <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">
                        Landmark (Optional)
                    </label>
                    <div className="mt-1">
                        <input
                            id="landmark"
                            name="landmark"
                            type="text"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Any nearby landmark"
                            value={formData.landmark}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* State & City Selection */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="state_id" className="block text-sm font-medium text-gray-700">
                            State
                        </label>
                        <div className="mt-1">
                            <select
                                id="state_id"
                                name="state_id"
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={formData.state_id}
                                onChange={handleChange}
                            >
                                <option value="">Select State</option>
                                {states.map(state => (
                                    <option key={state.id} value={state.id}>
                                        {state.state_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="city_id" className="block text-sm font-medium text-gray-700">
                            City
                        </label>
                        <div className="mt-1">
                            <select
                                id="city_id"
                                name="city_id"
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={formData.city_id}
                                onChange={handleChange}
                                disabled={!formData.state_id}
                            >
                                <option value="">Select City</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.id}>
                                        {city.city}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Pin Code */}
                <div>
                    <label htmlFor="pin_code" className="block text-sm font-medium text-gray-700">
                        PIN Code
                    </label>
                    <div className="mt-1">
                        <input
                            id="pin_code"
                            name="pin_code"
                            type="text"
                            required
                            pattern="[0-9]{6}"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="6-digit PIN code"
                            value={formData.pin_code}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Is Default Address */}
                <div className="flex items-center">
                    <input
                        id="is_default"
                        name="is_default"
                        type="checkbox"
                        checked={formData.is_default}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_default" className="ml-2 block text-sm text-gray-700">
                        Make this my default address
                    </label>
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : existingAddress ? 'Update Address' : 'Save Address'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserAddressForm; 