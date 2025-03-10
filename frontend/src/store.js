import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice'; // Create this file if it doesn't exist

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export default store; 