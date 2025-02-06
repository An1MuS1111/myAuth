import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";

import { useAuth } from "@/context/AuthContext";

type FormType = {
    name: string;
    email: string;
    password: string;
    telephone: string;
};

export default function RegistrationPage() {
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormType>({
        name: "",
        email: "",
        password: "",
        telephone: "",
    });

    const { registration } = useAuth();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        // Here you would typically handle the registration logic
        // console.log(formData);
        try {
            await registration(formData);
            navigate("/profile");
        } catch (error) {
            // alert("Registration failed");
            console.error("Registration failed:", error);
        }

        // try {
        //     const response = await api.post("/auth/registration", formData, {
        //         withCredentials: true,
        //     });
        //     console.log("Registration successful", response.data);
        // } catch (error: any) {
        //     console.error(
        //         "Registration error:",
        //         error.response?.data || error.message
        //     );
        // }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Register
                    </CardTitle>
                    <CardDescription className="text-center">
                        Create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="telephone">Telephone</Label>
                            <Input
                                id="telephone"
                                name="telephone"
                                type="tel"
                                placeholder="Enter your phone number"
                                value={formData.telephone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Register
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <p className="text-center w-full text-sm">
                        Already have an account?{" "}
                        {/* <Link
                            href="/login"
                            className="text-blue-600 hover:underline"
                        >
                            Login here
                        </Link> */}
                        <a
                            href="/login"
                            className="text-blue-600 hover:underline"
                        >
                            Login here
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
