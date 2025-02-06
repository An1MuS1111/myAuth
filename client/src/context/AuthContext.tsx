import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import axios from "axios";
import {
    setTokens,
    clearTokens,
    getAccessToken,
    getRefreshToken,
} from "@/utils/tokenUtils";

import api from "@/axios/api";
// Define types
type User = {
    email: string;
    name: string;

    // Add other user properties as needed
};

type LoginFormType = {
    email: string;
    password: string;
};

type RegistrationFormType = {
    email: string;
    password: string;
    name: string;
    telephone: string;
};
type AuthContextType = {
    user: User | null;
    accessToken: string;
    login: (formData: LoginFormType) => Promise<void>;
    registration: (formData: RegistrationFormType) => Promise<void>;
    logout: () => void;
};

type AuthProviderProps = {
    children: ReactNode;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string>(
        localStorage.getItem("accessToken") || ""
    );
    const [refreshToken, setRefreshToken] = useState<string>(
        localStorage.getItem("refreshToken") || ""
    );

    //exec: Function to log in the user

    const login = async (formData: LoginFormType) => {
        try {
            console.log("hit");
            const response = await api.post("/auth/login", formData);
            const { accessToken, refreshToken } = response.data;

            // Store tokens in localStorage
            setTokens(accessToken, refreshToken);
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);

            // Fetch user details
            const userResponse = await api.get("/auth/profile");
            setUser(userResponse.data);
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    //exec: Function to register a new user

    const registration = async (formData: RegistrationFormType) => {
        try {
            const response = await api.post("/auth/registration", formData);
            const { accessToken, refreshToken } = response.data;

            console.log("Registration successful", response.data);
            // Store tokens in localStorage
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            setAccessToken(accessToken);
            setRefreshToken(refreshToken);

            // Fetch user details
            const userResponse = await api.get("/auth/profile");
            setUser(userResponse.data);
            console.log(userResponse.data);
        } catch (error) {
            console.error("Registration failedf:", error);
            throw error;
        }
    };

    // Function to log out the user
    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAccessToken("");
        setRefreshToken("");
        setUser(null);
    };

    // Function to refresh the access token
    const refreshAccessToken = async () => {
        try {
            const response = await axios.post(
                "http://localhost:5000/auth/refresh-token",
                {
                    refreshToken,
                }
            );
            const { accessToken } = response.data;

            localStorage.setItem("accessToken", accessToken);
            setAccessToken(accessToken);
        } catch (error) {
            console.error("Failed to refresh token:", error);
            logout(); // Logout if refresh token is invalid
        }
    };

    // Intercept requests to refresh the access token if expired
    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                if (!config.headers["Authorization"]) {
                    config.headers["Authorization"] = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    await refreshAccessToken();
                    return axios(originalRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [accessToken, refreshToken]);

    return (
        <AuthContext.Provider
            value={{ user, accessToken, login, registration, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
