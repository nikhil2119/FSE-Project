import React from 'react';

const AdminPlaceholder = ({ title }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700">
        <p className="font-medium">Coming Soon</p>
        <p>This feature is currently under development and will be available soon.</p>
      </div>
    </div>
  );
};

export default AdminPlaceholder; 