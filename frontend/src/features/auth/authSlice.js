import { createSlice } from '@reduxjs/toolkit';

// Check if token exists in localStorage for initial state
const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: !!token,
        user: user,
        token: token
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.user = null;
            state.token = null;
        },
        updateUser: (state, action) => {
            state.user = action.payload;
        }
    },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer; 