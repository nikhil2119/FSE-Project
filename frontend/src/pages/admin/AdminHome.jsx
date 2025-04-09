import React, { useState, useEffect } from 'react';
import { FaUsers, FaBox, FaShoppingCart, FaDollarSign, FaSpinner } from 'react-icons/fa';
import api from '../../services/api';

const StatCard = ({ icon, title, value, color }) => {
  const Icon = icon;
  return (
    <div className={`bg-white rounded-lg shadow p-6 border-t-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`text-${color.replace('border-', '')} text-2xl`}>
          <Icon />
        </div>
      </div>
    </div>
  );
};

const AdminHome = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    productCount: 0,
    orderCount: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get admin profile
        const userData = await api.getCurrentUser();
        setUser(userData);

        // In a real app, you would fetch actual stats from backend
        // For now, we'll simulate with setTimeout
        setTimeout(() => {
          setStats({
            userCount: 56,
            productCount: 120,
            orderCount: 243,
            revenue: 25750.75
          });
          setLoading(false);
        }, 800);

        // Actual API calls would look like:
        // const statsData = await api.getAdminStats();
        // setStats(statsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name || 'Admin'}!</h1>
        <p className="text-gray-600">
          Here's an overview of your platform performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FaUsers}
          title="Total Users"
          value={stats.userCount}
          color="border-blue-500"
        />
        <StatCard
          icon={FaBox}
          title="Total Products"
          value={stats.productCount}
          color="border-green-500"
        />
        <StatCard
          icon={FaShoppingCart}
          title="Orders"
          value={stats.orderCount}
          color="border-orange-500"
        />
        <StatCard
          icon={FaDollarSign}
          title="Revenue"
          value={`$${stats.revenue.toFixed(2)}`}
          color="border-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => window.location.href = '/admin/users'} 
              className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Manage Users
            </button>
            <button 
              onClick={() => window.location.href = '/admin/products'} 
              className="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              Manage Products
            </button>
            <button 
              className="p-4 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
            >
              Manage Orders
            </button>
            <button 
              className="p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            >
              View Reports
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Server Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Database</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Healthy</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Last Backup</span>
              <span className="text-sm text-gray-600">Today at 03:00 AM</span>
            </div>
            <div className="flex justify-between items-center">
              <span>System Load</span>
              <div className="w-32 bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="border border-gray-200 rounded-lg p-4 text-center text-gray-500">
          <p>Activity feed will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHome; 