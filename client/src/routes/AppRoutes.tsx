import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import Registration from "../pages/Registration";
import Profile from "@/pages/Profile";
import Blank from "@/pages/Blank";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoutes from "./ProtectedRoutes";
export default function AppRoutes() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route element={<ProtectedRoutes />}>
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/blank" element={<Blank />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}
