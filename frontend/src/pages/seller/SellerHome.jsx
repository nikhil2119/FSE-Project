import React, { useState, useEffect } from 'react';
import { FaBox, FaShoppingCart, FaDollarSign, FaPlus, FaTag, FaChartLine } from 'react-icons/fa';
import api from '../../services/api';

// Reusable stat card component
const StatCard = ({ icon, title, value, bgColor }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100 flex items-center">
      <div className={`p-3 rounded-full ${bgColor} text-white mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
};

const SellerHome = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the user data for the welcome message
        const userData = await api.getCurrentUser();
        setUser(userData);
        
        // In a real application, you would fetch actual statistics
        // This is a placeholder that simulates fetching data
        setTimeout(() => {
          setStats({
            products: 24,
            orders: 16,
            revenue: 2580
          });
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.name || 'Seller'}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={<FaBox size={20} />} 
          title="Total Products" 
          value={stats.products} 
          bgColor="bg-blue-500"
        />
        <StatCard 
          icon={<FaShoppingCart size={20} />} 
          title="Total Orders" 
          value={stats.orders} 
          bgColor="bg-green-500"
        />
        <StatCard 
          icon={<FaDollarSign size={20} />} 
          title="Revenue" 
          value={`$${stats.revenue}`} 
          bgColor="bg-purple-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <button 
            className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50"
            onClick={() => window.location.href = '/seller/products/new'}
          >
            <FaPlus className="text-blue-500 mr-3" />
            <span>Add New Product</span>
          </button>
          <button 
            className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50"
            onClick={() => window.location.href = '/seller/products'}
          >
            <FaTag className="text-green-500 mr-3" />
            <span>Manage Products</span>
          </button>
          <button 
            className="flex items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50"
            onClick={() => window.location.href = '/seller/analytics'}
          >
            <FaChartLine className="text-purple-500 mr-3" />
            <span>View Analytics</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Activity</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-center py-8">
            Your recent activity will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerHome; 