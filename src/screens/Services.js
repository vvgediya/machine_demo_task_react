// ServiceTable.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import * as XLSX from "xlsx";
const ServiceTable = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get("/api/services");
        console.log("Response:", response.data);
        setServices(response.data.data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };
    fetchServices();
  }, []);

  const handleAddServiceClick = () => {
    navigate("/createservice");
  };

  const handleEditServiceClick = (id) => {
    navigate(`/editservice/${id}`);
  };

  const handleRemoveServiceClick = async (id) => {
    try {
      await axiosInstance.delete(`/api/services/${id}`);
      const response = await axiosInstance.get("/api/services");
      setServices(response.data.data);
    } catch (error) {
      console.error("Failed to remove service:", error);
    }
  };
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      services.map((service) => ({
        Name: service.name,
        Status: service.status,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Services");
    XLSX.writeFile(wb, "services.xlsx");
  };
  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-semibold text-center mb-4">All Services</h1>
      <div className="flex justify-between mb-4">
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded shadow-md"
          onClick={handleAddServiceClick}
        >
          Add Service
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md"
          onClick={handleExportExcel}
        >
          Export to Excel
        </button>
      </div>
      {services.length === 0 ? (
        <p className="text-center">No data found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id} className="border-b border-gray-200">
                  <td className="py-2 px-4">{service.name}</td>
                  <td className="py-2 px-4">
                    {service.status &&
                      (service.status == "active"
                        ? "Active"
                        : service.status == "inActive"
                        ? "InActive"
                        : "")}
                  </td>
                  <td className="py-2 px-4">
                    {/* Edit button */}
                    <button
                      className="mr-2 text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditServiceClick(service._id)}
                    >
                      Edit
                    </button>
                    {/* Remove button */}
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleRemoveServiceClick(service._id)}
                    >
                      Remove
                    </button>
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

export default ServiceTable;
