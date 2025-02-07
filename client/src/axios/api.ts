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

// Handle 401 errors and refresh the access token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        //* if the token expires it send the 403 code
        // todo: need to fix the conflict between 403 and 401

        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refreshToken");

                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }
                const response = await api.post("/auth/refresh-token", {
                    refreshToken,
                });
                const { accessToken } = response.data;

                localStorage.setItem("accessToken", accessToken);
                originalRequest.headers[
                    "Authorization"
                ] = `Bearer ${accessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
