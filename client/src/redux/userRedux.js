// redux/userRedux.js - FIXED VERSION
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: null,
        isFetching: false,
        error: null,
        success: false,
        otpSent: false,
        requiresOTP: false,
    },
    reducers: {
        // Login reducers
        loginStart: (state) => {
            state.isFetching = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.isFetching = false;
            state.error = null;
            
            // If requires OTP, don't set as fully logged in yet
            if (action.payload.requiresOTP) {
                state.currentUser = null; // Don't set user until OTP verified
                state.otpSent = true;
                state.requiresOTP = true;
            } else {
                // Fully authenticated user (registration or OTP verification)
                state.currentUser = action.payload;
                state.otpSent = false;
                state.requiresOTP = false;
            }
        },
        loginFailure: (state, action) => {
            state.isFetching = false;
            state.error = action.payload;
            state.currentUser = null;
            state.otpSent = false;
            state.requiresOTP = false;
        },
        
        // Register reducers
        registerStart: (state) => {
            state.isFetching = true;
            state.error = null;
            state.success = false;
        },
        registerSuccess: (state, action) => {
            state.isFetching = false;
            state.currentUser = null; //ensures no login
            state.success = true;
            state.error = null;
            state.otpSent = false;
            state.requiresOTP = false;
        },
        registerFailure: (state, action) => {
            state.isFetching = false;
            state.error = action.payload;
            state.success = false;
            state.currentUser = null;
        },
        
        // OTP verification reducers
        otpVerificationStart: (state) => {
            state.isFetching = true;
            state.error = null;
        },
        otpVerificationSuccess: (state, action) => {
            state.isFetching = false;
            state.currentUser = action.payload; // User is now fully authenticated
            state.error = null;
            state.otpSent = false;
            state.requiresOTP = false;
        },
        otpVerificationFailure: (state, action) => {
            state.isFetching = false;
            state.error = action.payload;
        },
        
        // Logout
        logout: (state) => {
            state.isFetching = false;
            state.currentUser = null;
            state.error = null;
            state.success = false;
            state.otpSent = false;
            state.requiresOTP = false;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    registerStart,
    registerSuccess,
    registerFailure,
    otpVerificationStart,
    otpVerificationSuccess,
    otpVerificationFailure,
    logout
} = userSlice.actions;

export default userSlice.reducer;