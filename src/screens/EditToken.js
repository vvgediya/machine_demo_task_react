// EditToken.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import useToast from "../hooks/useToast";

const EditToken = () => {
  const { id } = useParams();
  const [tokenNumber, setTokenNumber] = useState('');
  const [jobNumber, setJobNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [redirectTo, setRedirectTo] = useState(null);
  const { showToast } = useToast();
  
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axiosInstance.get(`/api/tokens/${id}`);
        const { tokenNumber, jobNumber, vehicleType } = response.data.data;
        setTokenNumber(tokenNumber);
        setJobNumber(jobNumber);
        setVehicleType(vehicleType);
      } catch (error) {
        console.error('Failed to fetch token:', error);
      }
    };

    fetchToken();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/api/tokens/${id}`, { tokenNumber, jobNumber, vehicleType });
      console.log('Token updated:', response.data);
      showToast("Token updated successfully", "success");
      setRedirectTo('/tokens');
    } catch (error) {
      console.error('Failed to update token:', error);
      showToast("Failed to update token", "error");
    }
  };

  if (redirectTo) {
    return <Navigate to={redirectTo} />;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">Edit Token</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="tokenNumber" className="block text-sm font-medium text-gray-700">
              Token Number
            </label>
            <input
              type="number"
              id="tokenNumber"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-3 py-2"
              value={tokenNumber}
              onChange={(e) => setTokenNumber(e.target.value)}
              placeholder="Enter Token Number"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="jobNumber" className="block text-sm font-medium text-gray-700">
              Job Number
            </label>
            <input
              type="number"
              id="jobNumber"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-3 py-2"
              value={jobNumber}
              onChange={(e) => setJobNumber(e.target.value)}
              placeholder="Enter Job Number"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
              Vehicle Type
            </label>
            <select
              id="vehicleType"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="car">Car</option>
              <option value="bus">Bus</option>
              <option value="truck">Truck</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"          >
            Update Token
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditToken;
