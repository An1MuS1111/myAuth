import axios from "axios";

// exec: create an axios instance
const api = axios.create({
    baseURL: "http://localhost:4444",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// exec: interceptor to attach the access token to the request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
