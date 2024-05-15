// UserManagement.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useSelector } from 'react-redux';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const userProfile = useSelector(state => state.profile);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.get('/api/users');
        const filteredUsers = response.data.data.filter(user => user.email !== userProfile.email);
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleRemoveUserClick = async (id) => {
    try {
      await axiosInstance.delete(`/api/users/${id}`);
      const response = await axiosInstance.get('/api/users');
      const filteredUsers = response.data.data.filter(user => user.email !== userProfile.email);
        setUsers(filteredUsers);
    } catch (error) {
      console.error('Failed to remove user:', error);
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await axiosInstance.put(`/api/users/${id}`, { role });
      const updatedUsers = users.map(user => {
        if (user._id === id) {
          return { ...user, role };
        }
        return user;
      });
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-semibold text-center mb-4">Manage Users</h1>
      {users.length === 0 ? (
        <p className="text-center">No users found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b border-gray-200">
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="px-2 py-1 rounded"
                    >
                      <option value="user">User</option>
                      <option value="employee">Employee</option>
                      {/* Add other roles as options if needed */}
                    </select>
                  </td>
                  <td className="py-2 px-4">
                    <button className="text-red-600 hover:text-red-800" onClick={() => handleRemoveUserClick(user._id)}>Remove</button>
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

export default UserManagement;
