// TokenTable.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import * as XLSX from "xlsx";

const TokenTable = () => {
  const [tokens, setTokens] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const token = localStorage.getItem("token");
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        const response = await axiosInstance.get("/api/tokens");
        console.log("Response:", response.data.data);
        setTokens(response.data.data);
      } catch (error) {
        console.error("Failed to fetch tokens:", error);
      }
    };
    fetchTokens();
  }, []);

  const handleAddTokenClick = () => {
    navigate("/createtoken");
  };

  const handleEditTokenClick = (id) => {
    navigate(`/edittoken/${id}`);
  };

  const handleRemoveTokenClick = async (id) => {
    try {
      await axiosInstance.delete(`/api/tokens/${id}`);
      const response = await axiosInstance.get("/api/tokens");
      const sortedTokens = response.data.data.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setTokens(sortedTokens);
    } catch (error) {
      console.error("Failed to remove token:", error);
    }
  };
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      tokens.map((token) => ({
        "Token Number": token.tokenNumber,
        "Job Number": token.jobNumber,
        "Vehicle Type": token.vehicleType,
        "Vehicle Number": token.vehicleNumber,
        "User Mobile Number": token.userMobileNumber,
        Status: token.status,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tokens");
    XLSX.writeFile(wb, "tokens.xlsx");
  };
  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-semibold text-center mb-4">All Tokens</h1>
      <div className="flex justify-between mb-4">
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded shadow-md"
          onClick={handleAddTokenClick}
        >
          Add Token
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md"
          onClick={handleExportExcel}
        >
          Export to Excel
        </button>
      </div>
      {tokens.length === 0 ? (
        <p className="text-center">No data found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="text-left py-3 px-4">Token Number</th>
                <th className="text-left py-3 px-4">Job Number</th>
                <th className="text-left py-3 px-4">Vehicle Type</th>
                <th className="text-left py-3 px-4">Vehicle Number</th>
                <th className="text-left py-3 px-4">User Mobile Number</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token) => (
                <tr key={token._id} className="border-b border-gray-200">
                  <td className="py-2 px-4">{token.tokenNumber}</td>
                  <td className="py-2 px-4">{token.jobNumber}</td>
                  <td className="py-2 px-4">{token.vehicleType}</td>
                  <td className="py-2 px-4">{token.vehicleNumber}</td>
                  <td className="py-2 px-4">{token.userMobileNumber}</td>
                  <td className="py-2 px-4">{token.status}</td>
                  <td className="py-2 px-4">
                    <button
                      className="mr-2 text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditTokenClick(token._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleRemoveTokenClick(token._id)}
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

export default TokenTable;
