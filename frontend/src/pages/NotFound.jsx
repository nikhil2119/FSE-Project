import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-500">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-4 mb-8">Sorry, the page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
