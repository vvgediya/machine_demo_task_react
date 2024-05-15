// hooks/useToast.js
import { toast } from 'react-hot-toast';

const useToast = () => {
  const showToast = (message, options = {}) => {
    toast(message, options);
  };

  return {
    showToast,
  };
};

export default useToast;
