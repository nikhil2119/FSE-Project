import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaCheck, FaTimes, FaUserPlus } from 'react-icons/fa';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  // Mock user data since we don't have actual API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // For now, we'll use mock data
        const mockUsers = [
          {
            id: 1,
            user_name: 'John Doe',
            user_email: 'john@example.com',
            role: 'admin',
            is_enabled: true,
            created_on: '2023-01-15'
          },
          {
            id: 2,
            user_name: 'Jane Smith',
            user_email: 'jane@example.com',
            role: 'customer',
            is_enabled: true,
            created_on: '2023-02-20'
          },
          {
            id: 3,
            user_name: 'Bob Johnson',
            user_email: 'bob@example.com',
            role: 'seller',
            is_enabled: true,
            created_on: '2023-03-10'
          },
          {
            id: 4,
            user_name: 'Sarah Williams',
            user_email: 'sarah@example.com',
            role: 'customer',
            is_enabled: false,
            created_on: '2023-04-05'
          },
          {
            id: 5,
            user_name: 'Mike Brown',
            user_email: 'mike@example.com',
            role: 'seller',
            is_enabled: true,
            created_on: '2023-05-12'
          }
        ];
        
        setUsers(mockUsers);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole ? user.role === selectedRole : true;
    
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = (userId) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return { ...user, is_enabled: !user.is_enabled };
      }
      return user;
    }));
    
    setMessage('User status updated successfully (mock)');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
      setMessage('User deleted successfully (mock)');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'seller':
        return 'bg-green-100 text-green-800';
      case 'customer':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search box */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-3 py-2 border rounded-md w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Role filter */}
          <select
            className="border rounded-md py-2 px-3"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="seller">Seller</option>
            <option value="customer">Customer</option>
          </select>
          
          {/* Add user button */}
          <button
            onClick={() => alert('User creation form would appear here')}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaUserPlus /> Add User
          </button>
        </div>
      </div>

      {/* Status messages */}
      {message && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
          {message}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          {error}
        </div>
      )}

      {/* Users table */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">
            {searchTerm || selectedRole ? 'No users found matching your search.' : 'No users found.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">User</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Joined</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{user.user_name}</div>
                  </td>
                  <td className="py-4 px-4">{user.user_email}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeClass(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-4">{new Date(user.created_on).toLocaleDateString()}</td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`px-2 py-1 rounded-full ${user.is_enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      title={user.is_enabled ? 'Disable User' : 'Enable User'}
                    >
                      {user.is_enabled ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => alert(`Edit user: ${user.user_name}`)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit User"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete User"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers; 