import axios from "axios";




const axiosInstance = axios.create({
    baseURL: "http://localhost:4444",
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance