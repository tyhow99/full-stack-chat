import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:"http://localhost:5001/api",
    withCredentials: true, //sends cookies in every request
});