// redux/apiCall.js - FIXED VERSION
import { publicRequest } from "../requestMethod";
import { 
    loginFailure, 
    loginStart, 
    loginSuccess, 
    registerFailure, 
    registerStart, 
    registerSuccess,
    otpVerificationStart,
    otpVerificationSuccess,
    otpVerificationFailure
} from "./userRedux";

export const login = (user) => async (dispatch) => {
    dispatch(loginStart());
    try {
        const res = await publicRequest.post("/auth/login", user);
        console.log("Login Response", res.data);
        
        if (res.data.message && res.data.message.includes("can't log you in")) {
            dispatch(loginFailure(res.data.message));
            return { payload: { message: res.data.message } };
        }
        
        // If login successful and requires OTP
        if (res.data.requiresOTP) {
            dispatch(loginSuccess({ 
                email: res.data.email,
                name: res.data.name,
                requiresOTP: true,
                otpSent: true
            }));
            return { 
                payload: { 
                    ...res.data, 
                    requiresOTP: true 
                } 
            };
        }
        
        // If login successful without OTP (shouldn't happen in current flow)
        dispatch(loginSuccess(res.data));
        return { payload: res.data };
        
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Sorry, we can't log you in.";
        dispatch(loginFailure(errorMessage));
        return { payload: { message: errorMessage } };
    }
};

export const register = (userData) => async (dispatch) => {
    dispatch(registerStart());
    try {
        const res = await publicRequest.post("/auth/register", userData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        dispatch(registerSuccess(null));  // indicating success
        return { payload: res.data };
        
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Registration failed";
        dispatch(registerFailure(errorMessage));
        return { payload: { message: errorMessage } };
    }
};

export const verifyOTP = (otpData) => async (dispatch) => {
    dispatch(otpVerificationStart());
    try {
        const res = await publicRequest.post("/auth/verify-otp", otpData);
        
        // OTP verification successful - user is now fully authenticated
        dispatch(otpVerificationSuccess(res.data));
        return { payload: res.data };
        
    } catch (error) {
        const errorMessage = error.response?.data?.message || "OTP verification failed";
        dispatch(otpVerificationFailure(errorMessage));
        return { payload: { message: errorMessage } };
    }
};