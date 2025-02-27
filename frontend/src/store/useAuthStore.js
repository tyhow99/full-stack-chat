//saves different states and functions for components
import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
export const useAuthStore = create((set) => ({
    authUser: null,
    //loading states
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,


    isCheckingAuth: true,

    checkAuth: async() =>
    {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({authUser:res.data});
        } catch (error) {
            set({authUser: null});
            console.log("Error in check Auth:", error)
        } finally{
            set({isCheckingAuth:false});
        }
    },

    signup: async (data) => {
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post('/auth/signup',data);
            set({authUser:res.data});
            toast.success("Account created successfully");
        } catch  {
            toast.error("Account not created");
        } finally{
            set({isSigningUp: false})
        }
    },

    logout: async() => {
        try {
            await axiosInstance('/auth/logout');
            set({authUser: null});
            toast.success("Logged out Successfully");
        } catch  {
            toast.error("Logout failed");
        }
    }
}));