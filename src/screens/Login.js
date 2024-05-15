import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import useToast from "../hooks/useToast";
import { useDispatch } from "react-redux"; // Import useDispatch hook
import { Navigate } from "react-router-dom";
import { setUserProfile } from "../redux/slices/profileSlice";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirectTo, setRedirectTo] = useState(null); // State to manage navigation

  const dispatch = useDispatch(); // Get dispatch function from Redux
  const { showToast } = useToast();

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });
      const { token, user } = response.data.data;
      localStorage.setItem("token", token);
      showToast("Login successful");
      console.log("LoginUser---", user);
      dispatch(setUserProfile(user));

      if (user?.role === "admin") {
        setRedirectTo("/iot-data");
      } else if (user?.role === "user") {
        setRedirectTo("/user");
      }else if (user?.role === "employee") {
        setRedirectTo("/employee");
      }
    } catch (error) {
      console.error("Login failed", error);
      showToast("Login failed");
    }
  };

  if (redirectTo) {
    return <Navigate to={redirectTo} />;
  }
  const handleAdminLogin = () => {
    setEmail("admin@gmail.com");
    setPassword("123");
  };

  const handleEmployeeLogin = () => {
    setEmail("employee@gmail.com");
    setPassword("123");
  };

  const handleUserLogin = () => {
    setEmail("user@gmail.com");
    setPassword("123");
  };

  return (
    <div className="flex justify-center items-center min-h-screen flex-col bg-sky-100">
      <div className="w-full max-w-md rounded-xl box-on-hover hover:bg-gray-400 border ease-in-out duration-100 transform hover:-translate-y-3 hover:-translate-x-3 px-4 py-14">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-sm text-gray-800 mt-1">Please login to continue</p>
        </div>
        <div className="flex flex-col justify-center items-end my-8 px-10">
          <input
            type="text"
            placeholder="Email"
            className="border-2 border-black rounded-lg py-2.5 px-4 w-full outline-none input-on-hover ease-in-out duration-100 transform hover:-translate-y-0.5 hover:-translate-x-0.5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border-2 border-black rounded-lg py-2.5 px-4 mt-4 w-full outline-none input-on-hover ease-in-out duration-100 transform hover:-translate-y-0.5 hover:-translate-x-0.5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-black text-white rounded-lg px-4 py-2.5 mt-4 hover:bg-gray-800 input-on-hover ease-in-out duration-100 transform hover:-translate-y-0.5 hover:-translate-x-0.5"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
        <div className="flex space-x-3 mt-4 w-full">
          <button
            className="bg-gray-700 text-white rounded-lg px-2 py-1 text-sm  hover:bg-gray-800 hover:text-white transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:-translate-x-0.5"
            onClick={handleAdminLogin}
          >
            Admin
          </button>
          <button
            className="bg-gray-700 text-white rounded-lg px-2 py-1 text-sm  hover:bg-gray-800 hover:text-white transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:-translate-x-0.5"
            onClick={handleEmployeeLogin}
          >
            Employee
          </button>
          <button
            className="bg-gray-700 text-white rounded-lg px-2 py-1 text-sm hover:bg-gray-800 hover:text-white transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:-translate-x-0.5"
            onClick={handleUserLogin}
          >
            User
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
