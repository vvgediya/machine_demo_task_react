// store.js
import { configureStore } from '@reduxjs/toolkit';
import userProfileReducer from '../slices/profileSlice';

export default configureStore({
  reducer: {
    profile: userProfileReducer,
  },
});
