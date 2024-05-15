import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import IOTHome from "./screens/IOTHome";
import AdminPanel from "./screens/AdminPanel";
import UserPanel from "./screens/UserPanel";
import Unauthorized from "./screens/Unauthorized";
import PrivateRoute from "./helpers/PrivateRoute";
import Login from "./screens/Login";
import Navbar from "./components/Navbar"; 
import { Toaster } from 'react-hot-toast';
import Service from "./screens/Services"; 
import CreateService from "./screens/CreateService";
import EditService from "./screens/EditService";
import Tokens from "./screens/Tokens";
import CreateToken from "./screens/CreateToken";
import EditToken from "./screens/EditToken";
import Employee from "./screens/Employee";
import UserManagement from "./screens/UserManagement";

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();

  // Define an array of routes where Navbar should not be shown
  const notshowNavbarRoutes = ["/login"];

  // Check if the current route is in the notshowNavbarRoutes array
  const shouldNotShowNavbar = notshowNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldNotShowNavbar && <Navbar />} {/* Render Navbar only on specified routes */}
      <Toaster />
      <Routes>
        <Route path="*" element={<PrivateRoute roles={["admin"]}><IOTHome /></PrivateRoute>} />
        <Route path="/iot-data" element={<PrivateRoute roles={["admin"]}><IOTHome /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute roles={["admin"]}><AdminPanel /></PrivateRoute>} />
        <Route path="/user-management" element={<PrivateRoute roles={["admin"]}><UserManagement /></PrivateRoute>} />
        <Route path="/user" element={<PrivateRoute roles={[ "user"]}><UserPanel /></PrivateRoute>} />
        <Route path="/createservice" element={<PrivateRoute roles={[ "admin"]}><CreateService /></PrivateRoute>} />
        <Route path="/editservice/:id" element={<PrivateRoute roles={[ "admin"]}><EditService /></PrivateRoute>} />
        <Route path="/services" element={<PrivateRoute roles={["admin"]}><Service /></PrivateRoute>} />
        <Route path="/tokens" element={<PrivateRoute roles={["admin"]}><Tokens /></PrivateRoute>} />
        <Route path="/createtoken" element={<PrivateRoute roles={["admin"]}><CreateToken /></PrivateRoute>} />
        <Route path="/employee" element={<PrivateRoute roles={["employee"]}><Employee /></PrivateRoute>} />
        <Route path="/edittoken/:id" element={<PrivateRoute roles={["admin"]}><EditToken /></PrivateRoute>} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;


