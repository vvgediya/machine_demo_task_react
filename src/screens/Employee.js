import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import socketIOClient, { io } from "socket.io-client";

const Employee = () => {
  const [selectedService, setSelectedService] = useState(
    JSON.parse(localStorage.getItem("selectedService")) || null
  );
  const [tokens, setTokens] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedToken, setSelectedToken] = useState(
    JSON.parse(localStorage.getItem("selectedToken")) || null
  );
  const [selectedStation, setSelectedStation] = useState(
    localStorage.getItem("selectedStation") || null
  );
  const [isShowServiceDialog, setIsShowServiceDialog] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const [socket, setSocket] = useState(null);
  const [number, setNumber] = useState("0:00");
  useEffect(() => {
    const socket = socketIOClient(
      process.env.REACT_APP_BACKEND_URL || "http://localhost:8383",
      { transports: ["websocket"] }
    );
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    const storedSelectedToken = localStorage.getItem("selectedToken");
    if (storedSelectedToken) {
      setSelectedToken(JSON.parse(storedSelectedToken));
    }
    const storedSelectedStation = localStorage.getItem("selectedStation");
    if (storedSelectedStation) {
      setSelectedStation(storedSelectedStation);
    }
    const storedselectedService = localStorage.getItem("selectedService");
    if (storedselectedService) {
      setSelectedService(JSON.parse(storedselectedService));
    }
    if (selectedService) setIsShowServiceDialog(true);
  }, []);
  useEffect(() => {
    if (socket && isRunning) {
      socket.on("elapsedTime", (elapsedTime) => {
        console.log("Received elapsed time from server:", elapsedTime);
        setNumber(elapsedTime);
      });
    }
  }, [socket, isRunning]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get("/api/services");
        const activeServices = response.data.data.filter(
          (service) => service.status === "active"
        );

        setServices(activeServices);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };
    fetchServices();

    fetchTokens();
  }, []);
  const fetchTokens = async () => {
    try {
      const token = localStorage.getItem("token");
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      const response = await axiosInstance.get("/api/tokens");
      const pendingTokens = response.data.data.filter(
        (token) => token.status !== "done"
      );
      setTokens(pendingTokens);
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
    }
  };
  const handleStartService = async () => {
    setIsRunning(true);
    if (socket) {
      socket.emit("startTimer");
    }
    if (selectedToken) {
      try {
        const res = await axiosInstance.put(
          `/api/tokens/${selectedToken._id}`,
          {
            status: "inProgress",
          }
        );
        fetchTokens();
        setSelectedToken(res?.data?.data);
      } catch (error) {
        console.error("Failed to update token status:", error);
      }
    }
  };

  const handleStopService = async () => {
    if (selectedToken) {
      try {
        await axiosInstance.put(`/api/tokens/${selectedToken._id}`, {
          status: "done",
        });
        const updatedTokens = tokens.map((token) =>
          token._id === selectedToken._id ? { ...token, status: "done" } : token
        );
        fetchTokens();
      } catch (error) {
        console.error("Failed to update token status:", error);
      }
    }
    setIsRunning(false);
    setSelectedService(null);
    setSelectedToken(null);
    setSelectedStation(null);
    localStorage.removeItem("selectedService");
    localStorage.removeItem("selectedToken");
    localStorage.removeItem("selectedStation");
    if (socket) {
      socket.emit("stopTimer");
    }
  };

  const handleTokenClick = (token) => {
    setSelectedToken(token);
    localStorage.setItem("selectedToken", JSON.stringify(token));
  };
  const handleSelectStation = (station) => {
    setSelectedStation(station);
    localStorage.setItem("selectedStation", station);
  };

  return (
    <div className="">
      {!isShowServiceDialog && (
        <div className="select-service p-3">
          <h2 className="text-lg font-semibold mb-2">Select Service</h2>
          <div className="overflow-x-auto whitespace-nowrap">
            <div className="inline-block mr-2">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`py-2 px-4 rounded-md cursor-pointer inline-block m-2 ${
                    selectedService === service
                      ? "bg-gray-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                  onClick={() => {
                    setSelectedService(service);
                    localStorage.setItem(
                      "selectedService",
                      JSON.stringify(service)
                    );
                  }}
                >
                  {service.name}
                </div>
              ))}
            </div>
          </div>
          <button
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={() => selectedService && setIsShowServiceDialog(true)}
            disabled={!selectedService}
          >
            Start Service
          </button>
        </div>
      )}

      {/* Tokens Table */}
      {isShowServiceDialog && (
        <div className="flex justify-center items-center m-5 ">
          <div className="flex md:flex-row flex-col w-full h-full  rounded-2xl shadow-xl bg-gray-600">
            {/* 60% width for tokens table */}
            <div className="w-full md:w-[60%] bg-gray-600 p-5">
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
                        onClick={
                          !isRunning ? () => handleTokenClick(token) : null
                        }
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

            {/* 40% width for the other part */}
            <div className="flex flex-col space-y-3  md:block lg:w-[40%] w-full h-full  bg-gray-600 rounded-r-2xl shadow-xl p-5">
              <div className="bg-gray-200 p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Selected Token Details
                </h2>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Token Number:{" "}
                  <span className="font-normal">
                    {selectedToken?.tokenNumber || "-"}
                  </span>
                </p>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Job Number:{" "}
                  <span className="font-normal">
                    {selectedToken?.jobNumber || "-"}
                  </span>
                </p>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type:{" "}
                  <span className="font-normal">
                    {selectedToken?.vehicleType || "-"}
                  </span>
                </p>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Vehicle Number:{" "}
                  <span className="font-normal">
                    {selectedToken?.vehicleNumber || "-"}
                  </span>
                </p>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  User Mobile Number:{" "}
                  <span className="font-normal">
                    {selectedToken?.userMobileNumber || "-"}
                  </span>
                </p>
                <p className="text-sm font-medium text-gray-700">
                  Status:{" "}
                  <span className="font-semibold">
                    {selectedToken?.status || "-"}
                  </span>
                </p>
              </div>

              <div className="bg-gray-200 p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Select the Service Station
                </h2>
                <div className="flex">
                  <button
                    onClick={!isRunning ? () => handleSelectStation("A") : null}
                    className={`bg-blue-500 text-white w-10 h-10 rounded-full ${
                      !isRunning ? "hover:bg-blue-600" : "cursor-not-allowed"
                    } mb-2 mr-2 ${
                      selectedStation === "A" ? "bg-blue-700" : ""
                    }`}
                  >
                    A
                  </button>
                  <button
                    onClick={!isRunning ? () => handleSelectStation("B") : null}
                    className={`bg-green-500 text-white w-10 h-10 rounded-full ${
                      !isRunning ? "hover:bg-green-600" : "cursor-not-allowed"
                    } mb-2 mr-2 ${
                      selectedStation === "B" ? "bg-green-700" : ""
                    }`}
                  >
                    B
                  </button>
                  <button
                    onClick={!isRunning ? () => handleSelectStation("C") : null}
                    className={`bg-yellow-500 text-white w-10 h-10 rounded-full ${
                      !isRunning ? "hover:bg-yellow-600" : "cursor-not-allowed"
                    } mb-2 mr-2 ${
                      selectedStation === "C" ? "bg-yellow-700" : ""
                    }`}
                  >
                    C
                  </button>
                  <button
                    onClick={!isRunning ? () => handleSelectStation("D") : null}
                    className={`bg-red-500 text-white w-10 h-10 rounded-full ${
                      !isRunning ? "hover:bg-red-600" : "cursor-not-allowed"
                    } mb-2 mr-2 ${selectedStation === "D" ? "bg-red-700" : ""}`}
                  >
                    D
                  </button>
                </div>
              </div>
              <div>
                <div className="p-4 bg-white rounded-lg shadow-md">
                  <div className="text-center text-3xl font-semibold mb-4">
                    Timer
                  </div>
                  <div className="text-center text-5xl font-bold mb-4">
                    {number}
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      className={`px-6 py-2 bg-${
                        isRunning ? "red" : "green"
                      }-500 text-white rounded-md shadow-md ${
                        !selectedStation || !selectedToken
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                      onClick={() => {
                        if (isRunning) {
                          handleStopService(); // Call handleStopService when the button is clicked
                        } else {
                          handleStartService();
                        }
                      }}
                      disabled={!selectedStation || !selectedToken}
                    >
                      {isRunning ? "Stop Service" : "Start Service"}
                    </button>
                    {/* <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      onClick={handleStartService}
                    >
                      Start Timer
                    </button> */}
                    {/* <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={handleStopService}
                    >
                      Stop Timer
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
