import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-lg font-semibold mb-4">E-Shop</h3>
                        <p className="text-gray-400 text-sm">
                            Your one-stop shop for all your online shopping needs.
                        </p>
                    </div>
                    
                    {/* Quick Links */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/cart" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Cart
                                </Link>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Info */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-semibold mb-4">Information</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Terms & Conditions
                                </Link>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Contact */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            123 E-Commerce Street<br />
                            Shopping District, SH 12345<br />
                            Email: support@eshop.com
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                                <FaFacebook />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                                <FaTwitter />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                                <FaInstagram />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                                <FaGithub />
                            </a>
                        </div>
                    </div>
                </div>
                
                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} E-Shop. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
