import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, FaBoxOpen, FaShoppingCart, 
  FaClipboardList, FaSignOutAlt, FaBars, 
  FaTimes, FaPercentage 
} from 'react-icons/fa';
import api from '../services/api';
import SellerProducts from './seller/SellerProducts';
import SellerPlaceholder from './seller/SellerPlaceholder';

// Seller Dashboard Home component
const SellerHome = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">Welcome to your Seller Dashboard</h2>
    <p className="text-gray-700 mb-4">
      Here you can manage your products, track orders, and view your sales performance.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {/* Quick stats cards would go here */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-medium text-blue-800">Products</h3>
        <p className="text-2xl font-bold">0</p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
        <h3 className="font-medium text-green-800">Orders</h3>
        <p className="text-2xl font-bold">0</p>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
        <h3 className="font-medium text-purple-800">Revenue</h3>
        <p className="text-2xl font-bold">$0.00</p>
      </div>
    </div>
  </div>
);

const SellerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSellerAccess = async () => {
      try {
        const currentUser = api.getCurrentUser();
        
        if (!currentUser || currentUser.role !== 'seller') {
          // Redirect to login if not authenticated or not a seller
          navigate('/login');
          return;
        }
        
        setSeller(currentUser);
        setLoading(false);
      } catch (error) {
        console.error('Seller access check error:', error);
        navigate('/login');
      }
    };

    checkSellerAccess();
  }, [navigate]);

  const handleLogout = () => {
    api.logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className={`bg-green-800 text-white ${isSidebarOpen ? 'w-64' : 'w-20'} 
        transition-all duration-300 ease-in-out flex-shrink-0`}
      >
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen ? (
            <h2 className="text-xl font-semibold">Seller Dashboard</h2>
          ) : (
            <span className="text-xl font-semibold">SD</span>
          )}
          <button 
            onClick={toggleSidebar} 
            className="p-1 rounded-full hover:bg-green-700 focus:outline-none"
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        
        <nav className="mt-8">
          <NavItem 
            to="/seller" 
            exact={true}
            icon={<FaHome />} 
            text="Dashboard" 
            isCollapsed={!isSidebarOpen}
            isActive={location.pathname === '/seller'}
          />
          <NavItem 
            to="/seller/products" 
            icon={<FaBoxOpen />} 
            text="My Products" 
            isCollapsed={!isSidebarOpen}
            isActive={location.pathname.includes('/seller/products')}
          />
          <NavItem 
            to="/seller/discounts" 
            icon={<FaPercentage />} 
            text="Discounts" 
            isCollapsed={!isSidebarOpen}
            isActive={location.pathname.includes('/seller/discounts')}
          />
          <NavItem 
            to="/seller/orders" 
            icon={<FaShoppingCart />} 
            text="Orders" 
            isCollapsed={!isSidebarOpen}
            isActive={location.pathname.includes('/seller/orders')}
          />
          <NavItem 
            to="/seller/reports" 
            icon={<FaClipboardList />} 
            text="Sales Reports" 
            isCollapsed={!isSidebarOpen}
            isActive={location.pathname.includes('/seller/reports')}
          />
          
          <div className="mt-auto px-4 py-2">
            <button
              onClick={handleLogout}
              className={`flex items-center ${isSidebarOpen ? 'w-full' : 'justify-center'} 
              px-4 py-2 rounded text-white hover:bg-green-700`}
            >
              <FaSignOutAlt />
              {isSidebarOpen && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">
              {getPageTitle(location.pathname)}
            </h1>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">
                Welcome, {seller?.user_name || 'Seller'}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route path="/" element={<SellerHome />} />
            <Route path="/products" element={<SellerProducts />} />
            <Route path="/discounts" element={<SellerPlaceholder title="Discounts Management" />} />
            <Route path="/orders" element={<SellerPlaceholder title="Orders Management" />} />
            <Route path="/reports" element={<SellerPlaceholder title="Sales Reports" />} />
            <Route path="*" element={<div className="bg-red-50 p-6 rounded-lg shadow border-l-4 border-red-500">
              <h2 className="text-xl font-semibold text-red-700 mb-2">Page Not Found</h2>
              <p className="text-red-600">The page you are looking for does not exist or has been moved.</p>
            </div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Navigation Item Component
const NavItem = ({ to, icon, text, isCollapsed, isActive, exact }) => {
  return (
    <Link
      to={to}
      end={exact ? "true" : undefined}
      className={`flex items-center ${isCollapsed ? 'justify-center' : ''} 
      px-4 py-3 ${isActive ? 'bg-green-600' : 'hover:bg-green-700'}`}
    >
      <span className="text-lg">{icon}</span>
      {!isCollapsed && <span className="ml-3">{text}</span>}
    </Link>
  );
};

// Helper function to get page title from path
const getPageTitle = (path) => {
  if (path === '/seller') return 'Dashboard';
  
  const parts = path.split('/');
  if (parts.length >= 3) {
    const section = parts[2].charAt(0).toUpperCase() + parts[2].slice(1);
    return section;
  }
  
  return 'Seller Dashboard';
};

export default SellerDashboard; 