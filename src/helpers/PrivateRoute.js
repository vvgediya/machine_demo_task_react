import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch hooks
import { checkTokenExpiration } from '../utils/checkTokenExpiration';
import { setUserProfile } from '../redux/slices/profileSlice';

const PrivateRoute = ({ roles, children }) => {
  const [isLoading, setIsLoading] = useState(true); // State to track loading state
  const userRole = useSelector(state => state?.profile?.role);
  console.log("userRole----",userRole)
  const dispatch = useDispatch(); // Get dispatch function
  useEffect(() => {
    const fetchData = async () => {
      const token = await localStorage.getItem('token');

      if (!token || (await checkTokenExpiration(token))) {
        // Redirect to login if no token or token expired
        setIsLoading(false);
      } else {
        setIsLoading(false); // Set loading state to false once authentication check is done

        // If user role is not available in Redux store, try to get it from local storage
        if (!userRole) {
          const localStorageUser = JSON.parse(localStorage.getItem('user'));
          if (localStorageUser) {
            dispatch(setUserProfile(localStorageUser));
          }
        }
      }
    };

    fetchData(); // Call fetchData function when component mounts
  }, [dispatch, userRole]); // Add dispatch and userRole as dependencies

  if (isLoading) {
    // Render loading indicator while authentication check is in progress
    return <div>Loading...</div>;
  }

  if (!userRole || !roles.includes(userRole)) {
    // Redirect to login if user is not authenticated or does not have required roles
    return <Navigate to="/login" replace />;
  }

  // Render children if user is authenticated and has required roles
  return <>{children}</>;
};

export default PrivateRoute;
