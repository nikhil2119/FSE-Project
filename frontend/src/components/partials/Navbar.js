import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaTachometerAlt } from "react-icons/fa";
import api from "../../services/api";
import { logout } from "../../features/auth/authSlice";

const Navbar = () => {
    const cartItems = useSelector((state) => state.cart?.items?.length || 0);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.profile-dropdown')) {
                setDropdownOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        api.logout();
        dispatch(logout());
        window.location.href = '/';
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-xl font-bold text-blue-600">
                            E-Shop
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                        <Link to="/" 
                            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition duration-150"
                        >
                            Home
                        </Link>
                        <Link to="/products" 
                            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition duration-150"
                        >
                            Products
                        </Link>
                        
                        {/* Profile Dropdown */}
                        <div className="ml-3 relative profile-dropdown">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDropdownOpen(!dropdownOpen);
                                }}
                                className="p-2 rounded-full text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FaUser className="h-5 w-5" />
                            </button>
                            
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                                    {isLoggedIn ? (
                                        <>
                                            <Link to="/profile" 
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                Profile
                                            </Link>
                                            <Link to="/orders" 
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                My Orders
                                            </Link>
                                            
                                            {user && user.role === 'admin' && (
                                                <Link to="/admin" 
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    <div className="flex items-center">
                                                        <FaTachometerAlt className="mr-2" />
                                                        Admin Dashboard
                                                    </div>
                                                </Link>
                                            )}
                                            
                                            {user && user.role === 'seller' && (
                                                <Link to="/seller" 
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    <div className="flex items-center">
                                                        <FaTachometerAlt className="mr-2" />
                                                        Seller Dashboard
                                                    </div>
                                                </Link>
                                            )}
                                            
                                            <div className="border-t border-gray-100 my-1"></div>
                                            
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => {
                                                    handleLogout();
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <Link to="/login" 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Login
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {/* Cart Icon */}
                        <Link to="/cart" 
                            className="group p-2 rounded-full text-gray-600 hover:text-blue-600 relative"
                        >
                            <FaShoppingCart className="h-5 w-5" />
                            {cartItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    {cartItems}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button 
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        >
                            {menuOpen ? (
                                <FaTimes className="block h-6 w-6" />
                            ) : (
                                <FaBars className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden ${menuOpen ? 'block' : 'hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link to="/" 
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link to="/products" 
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        onClick={() => setMenuOpen(false)}
                    >
                        Products
                    </Link>
                    <Link to="/cart" 
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        onClick={() => setMenuOpen(false)}
                    >
                        Cart {cartItems > 0 && `(${cartItems})`}
                    </Link>
                    {isLoggedIn ? (
                        <>
                            <Link to="/profile" 
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                onClick={() => setMenuOpen(false)}
                            >
                                My Profile
                            </Link>
                            <Link to="/orders" 
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                onClick={() => setMenuOpen(false)}
                            >
                                My Orders
                            </Link>
                            
                            {user && user.role === 'admin' && (
                                <Link to="/admin" 
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Admin Dashboard
                                </Link>
                            )}
                            
                            {user && user.role === 'seller' && (
                                <Link to="/seller" 
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Seller Dashboard
                                </Link>
                            )}
                            
                            <button
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                                onClick={() => {
                                    handleLogout();
                                    setMenuOpen(false);
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" 
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                            onClick={() => setMenuOpen(false)}
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
