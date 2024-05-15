import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import useTimer from "../hooks/useTimer";

const UserPanel = () => {
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const { time, start, stop, reset } = useTimer();
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const token = localStorage.getItem("token");
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axiosInstance.get("/api/tokens");
      const pendingTokens = response.data.data.filter(
        (token) => token.status !== "done"
      );
      setTokens(pendingTokens);
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
    }
  };

  const handleTokenClick = (token) => {
    setSelectedToken(token);
  };

  return (
    <div className="p-5">
      <div className="overflow-x-auto">
        <table className="w-full bg-white border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="text-left py-3 px-4">Token Number</th>
              <th className="text-left py-3 px-4">Job Number</th>
              <th className="text-left py-3 px-4">Vehicle Type</th>
              <th className="text-left py-3 px-4">Vehicle Number</th>
              <th className="text-left py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => (
              <tr
                key={token._id}
                className={`border-b border-gray-200 ${
                  selectedToken === token ? "bg-gray-300" : ""
                }`}
                onClick={() => handleTokenClick(token)}
              >
                <td className="py-2 px-4">{token?.tokenNumber}</td>
                <td className="py-2 px-4">{token?.jobNumber}</td>
                <td className="py-2 px-4">{token?.vehicleType}</td>
                <td className="py-2 px-4">{token?.vehicleNumber}</td>
                <td className="py-2 px-4">{token?.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserPanel;
