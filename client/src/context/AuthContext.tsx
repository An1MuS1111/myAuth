import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";

import { setTokens, clearTokens } from "@/utils/tokenUtils";

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
    loading: boolean;
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
    const [loading, setLoading] = useState(true);

    // exec: to fetch user info each time the access token changes or page loads
    useEffect(() => {
        const initializeUser = async () => {
            setLoading(true); // Set loading to true *before* fetching
            if (accessToken) {
                try {
                    const userResponse = await api.get("/auth/profile");
                    setUser(userResponse.data);
                } catch (error) {
                    console.error("Error fetching user:", error);
                    clearTokens();
                    setAccessToken("");
                    setRefreshToken("");
                    setUser(null); // Important: Set user to null on error
                }
            }
            setLoading(false); // Set loading to false *after* fetch completes (or fails)
        };

        initializeUser();
    }, [accessToken]);

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
    // const refreshAccessToken = async () => {
    //     try {
    //         const response = await api.post("/auth/refresh-token", {
    //             refreshToken,
    //         });
    //         const { accessToken } = response.data;

    //         console.log("Refreshed access token:", accessToken);

    //         localStorage.setItem("accessToken", accessToken);
    //         setAccessToken(accessToken);
    //     } catch (error) {
    //         console.error("Failed to refresh token:", error);
    //         logout(); // Logout if refresh token is invalid
    //     }
    // };

    return (
        <AuthContext.Provider
            value={{ user, accessToken, login, registration, logout, loading }}
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
