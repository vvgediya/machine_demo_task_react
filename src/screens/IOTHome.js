import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import ReactApexChart from "react-apexcharts";
import axiosInstance from "../utils/axiosInstance";

const IOTHome = () => {
  const [tcpData, setTcpData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axiosInstance.get("/api/iot")
    .then((response) => setTcpData(response.data.data))
    .catch((error) => console.error("Error fetching data:", error));

    // Connect to socket.io server
    const socket = io(process.env.REACT_APP_BACKEND_URL || "localhost:8383", { transports: ["websocket"] });

    // Listen for new TCP data from socket.io
    socket.on("tcpData", (newData) => {
      setTcpData((prevData) => [...prevData, newData]);
    });

    // // Cleanup function to disconnect socket
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  const totalItems = tcpData.length;
  const uniqueD4Values = [...new Set(tcpData.map((item) => item.D4))];
  const totalUniqueD4Values = uniqueD4Values.length;

  const averageD1Value =
    tcpData.reduce((sum, item) => sum + item.D1, 0) / tcpData.length;

  const uniqueD1Values = [...new Set(tcpData.map((item) => item.D1))];
  const totalUniqueD1Values = uniqueD1Values.length;

  const chartData = {
    series: [{ data: tcpData.map((item) => item.D1) }],
    options: {
      chart: {
        type: "line",
        height: 350,
        animations: {
          enabled: true, 
          easing: "easeinout", 
          speed: 1500,
          animateGradually: {
            enabled: true,
            delay: 100,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350, 
          },
        },
      },
      xaxis: {
        categories: tcpData.map((item, index) => index + 1),
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">IoT Data Visualization</h1>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">IoT Data Chart</h2>
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={350}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-500 rounded-lg p-6 text-white shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Total Items</h2>
          <p className="text-2xl">{totalItems}</p>
        </div>
        <div className="bg-green-500 rounded-lg p-6 text-white shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Unique D4 Values</h2>
          <p className="text-2xl">{totalUniqueD4Values}</p>
        </div>
        <div className="bg-yellow-500 rounded-lg p-6 text-white shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Average D1 Value</h2>
          <p className="text-2xl">{averageD1Value.toFixed(2)}</p>
        </div>
        <div className="bg-purple-500 rounded-lg p-6 text-white shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Total Unique D1 Values</h2>
          <p className="text-2xl">{totalUniqueD1Values}</p>
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Data Visualization (Table)</h2>
      {/* Data visualization section - Table */}
      <div className="mt-8 h-64 overflow-y-auto">
       
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">D1</th>
              <th className="border border-gray-300 px-4 py-2">D2</th>
              <th className="border border-gray-300 px-4 py-2">D3</th>
              <th className="border border-gray-300 px-4 py-2">D4</th>
              <th className="border border-gray-300 px-4 py-2">D5</th>
              <th className="border border-gray-300 px-4 py-2">D6</th>
              <th className="border border-gray-300 px-4 py-2">D7</th>
            </tr>
          </thead>
          <tbody>
            {tcpData.map((item, index) => (
              <tr key={index} className="border border-gray-300">
                <td className="border border-gray-300 px-4 py-2">{item.D1}</td>
                <td className="border border-gray-300 px-4 py-2">{item.D2}</td>
                <td className="border border-gray-300 px-4 py-2">{item.D3}</td>
                <td className="border border-gray-300 px-4 py-2">{item.D4}</td>
                <td className="border border-gray-300 px-4 py-2">{item.D5}</td>
                <td className="border border-gray-300 px-4 py-2">{item.D6}</td>
                <td className="border border-gray-300 px-4 py-2">{item.D7}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IOTHome;
