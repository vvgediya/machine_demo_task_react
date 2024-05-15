// userProfileSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: null,
  reducers: {
    setUserProfile: (state, action) => {
      console.log('Action payload:', action.payload);
      localStorage.setItem('user', JSON.stringify(action.payload));
      return action.payload;
    },
    clearUserProfile: (state) => null,
  },
});

export const { setUserProfile, clearUserProfile } = userProfileSlice.actions;

export default userProfileSlice.reducer;


