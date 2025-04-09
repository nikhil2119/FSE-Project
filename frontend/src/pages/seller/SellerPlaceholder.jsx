import React from 'react';

const SellerPlaceholder = ({ title }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="bg-green-50 border-l-4 border-green-500 p-4 text-green-700">
        <p className="font-medium">Coming Soon</p>
        <p>This feature is currently under development and will be available soon.</p>
      </div>
    </div>
  );
};

export default SellerPlaceholder; 