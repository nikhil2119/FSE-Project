import React from "react";
import { Link } from "react-router-dom";
import { FaShippingFast, FaLock, FaHeadset } from "react-icons/fa";

const Home = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 animate-fade-in">
              Discover Amazing Products
            </h1>
            <p className="text-xl mb-8">
              Experience shopping reimagined with curated collections and
              exclusive deals.
            </p>
            <div className="space-x-4">
              <Link to="/products" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block">
                Shop Now
              </Link>
              <Link to="/categories" className="bg-transparent border-2 border-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors inline-block">
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-10"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us?</h2>
            <p className="mt-4 text-xl text-gray-600">Experience the best online shopping with these amazing benefits</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md transform transition duration-300 hover:scale-105">
              <div className="text-blue-500 text-4xl mb-4">
                <FaShippingFast />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Get free delivery on orders above $50. No hidden fees or charges.</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md transform transition duration-300 hover:scale-105">
              <div className="text-blue-500 text-4xl mb-4">
                <FaLock />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">100% secure payment methods available. Shop with confidence.</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md transform transition duration-300 hover:scale-105">
              <div className="text-blue-500 text-4xl mb-4">
                <FaHeadset />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our team is available anytime to assist you with any questions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Featured Categories</h2>
            <p className="mt-4 text-xl text-gray-600">Explore our most popular product categories</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/categories/electronics" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 group-hover:opacity-90 transition-opacity">
                  <img src="https://placehold.co/400x300?text=Electronics" alt="Electronics" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-center">Electronics</h3>
                </div>
              </div>
            </Link>

            <Link to="/categories/fashion" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 group-hover:opacity-90 transition-opacity">
                  <img src="https://placehold.co/400x300?text=Fashion" alt="Fashion" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-center">Fashion</h3>
                </div>
              </div>
            </Link>

            <Link to="/categories/home" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 group-hover:opacity-90 transition-opacity">
                  <img src="https://placehold.co/400x300?text=Home" alt="Home" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-center">Home & Kitchen</h3>
                </div>
              </div>
            </Link>

            <Link to="/categories/beauty" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 group-hover:opacity-90 transition-opacity">
                  <img src="https://placehold.co/400x300?text=Beauty" alt="Beauty" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-center">Beauty</h3>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
