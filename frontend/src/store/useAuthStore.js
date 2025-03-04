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
    onlineUsers: [],

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
        } catch  (error){
            console.log(error);
            console.log("test");
        } finally{
            set({isSigningUp: false})
        }
    },

    logout: async() => {
        try {
            await axiosInstance.post('/auth/logout');
            set({authUser: null});
            toast.success("Logged out Successfully");
        } catch  (error){
            console.log(error);
            toast.error(error.response.data.message);
        }
    },

    login: async(data) => {
        set({isLoggingIn: true});
        try {
            const res = await axiosInstance.post('/auth/login', data);
            set({authUser: res.data});
            toast.success("Login successful");
        } catch  (error){
            console.log(error);
            toast.error(error.response.data.message);
        }
        finally {
            set({isLoggingIn: false});
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await axiosInstance.put('/auth/update-profile', data);
          set({ authUser: res.data });
          toast.success("Profile updated successfully");
        } catch  {
          toast.error("Error");
        } finally {
          set({ isUpdatingProfile: false });
        }
      },
}));