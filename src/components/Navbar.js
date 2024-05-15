import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileSection from './ProfileSection';
import { Navigate } from 'react-router-dom';
const Navbar = () => {
  // Get user profile data from Redux store
  const userProfile = useSelector(state => state.profile);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [redirectTo, setRedirectTo] = useState(null);
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    // Remove token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect user to login page
    setRedirectTo('/login'); 
  };
  // Redirect if redirectTo is set
  if (redirectTo) {
    return <Navigate to={redirectTo} />;
  }

  return (
    <nav>
      <div className="px-4 bg-gray-100">
        <div className="flex justify-between items-center lg:p-0 p-3">
          <div className="flex space-x-4">
            <ProfileSection data={userProfile}/>
          </div>
          <div className="hidden md:flex items-center space-x-1">
          {(userProfile?.role === 'admin') && (
              <>
                <Link to="/user-management" className="px-3 py-5">Users Management</Link>
                <Link to="/iot-data" className="px-3 py-5">IOT Data</Link>
                <Link to="/services" className="px-3 py-5">Services</Link>
                <Link to="/tokens" className="px-3 py-5">Tokens</Link>
              </>
            )}
            <button onClick={handleLogout} className="px-3 py-5">Logout</button>
          </div>
          <div className="flex md:hidden items-center">
            <button className="mobile-menu-button" onClick={toggleCollapse}>
              <svg className={`w-6 h-6 ${isCollapsed ? 'block' : 'hidden'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
              <svg className={`w-6 h-6 ${isCollapsed ? 'hidden' : 'block'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className={`text-center mobile-menu md:hidden ${isCollapsed ? 'hidden' : ''} bg-gray-100`}>
      {(userProfile?.role === 'admin') && (
          <>
            <Link to="/user-management" className="px-3 py-5">Users Management</Link>
            <Link to="/iot-data" className="block px-4 py-2 text-sm hover:bg-gray-200">IOT Data</Link>
            <Link to="/services" className="block px-4 py-2 text-sm hover:bg-gray-200">Services</Link>
            <Link to="/tokens" className="block px-4 py-2 text-sm hover:bg-gray-200">Tokens</Link>
          </>
        )}
        <button onClick={handleLogout} className="block w-full px-4 py-2 text-sm   hover:bg-gray-200">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
