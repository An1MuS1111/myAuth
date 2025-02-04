import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "../pages/Login";
import Registration from "../pages/Registration";
import ProfilePage from "@/pages/Profile";

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </Router>
    );
}
