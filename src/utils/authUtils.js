// authUtils.js

// Function to retrieve user role from localStorage or authentication context
export const getUserRole = () => {
    // Assuming you have a user object stored in localStorage or authentication context
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Check if user is logged in and has a role
    if (user && user.role) {
      return user.role;
    } else {
      // If user is not logged in or does not have a role, return a default role (e.g., 'guest')
      return 'guest';
    }
  };
  