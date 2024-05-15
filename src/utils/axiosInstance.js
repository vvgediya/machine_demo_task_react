import axios from 'axios';

// Create a custom Axios instance with a proxy
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

export default axiosInstance;