// EditService.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import useToast from "../hooks/useToast";

const EditService = () => {
  const { id } = useParams();
  const [serviceName, setServiceName] = useState('');
  const [status, setStatus] = useState('');
  const [redirectTo, setRedirectTo] = useState(null);
  const { showToast } = useToast();
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await axiosInstance.get(`/api/services/${id}`);
        const { name, status } = response.data.data;
        setServiceName(name);
        setStatus(status);
      } catch (error) {
        console.error('Failed to fetch service:', error);
      }
    };

    fetchService();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/api/services/${id}`, { name: serviceName, status });
      console.log('Service updated:', response.data);
      showToast("Service updated successfully", "success");
      setRedirectTo('/services');
    } catch (error) {
      console.error('Failed to update service:', error);
      showToast("Failed to update service", "error");
    }
  };

  if (redirectTo) {
    return <Navigate to={redirectTo} />;
  }
  console.log("serviceName---",serviceName)

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">Edit Service</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700">
              Service Name
            </label>
            <input
              type="text"
              id="serviceName"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-3 py-2"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Enter Service Name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inActive">InActive</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"          >
            Update Service
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditService;
