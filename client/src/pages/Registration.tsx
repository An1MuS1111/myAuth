import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

// import components
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
    confirmPassword: string;
    telephone: string;
};

export default function RegistrationPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const { registration } = useAuth();

    const schema: ZodType<FormType> = z
        .object({
            name: z
                .string()
                .min(3, { message: "Name must be at least 3 characters" }),
            email: z.string().email({ message: "Invalid email Format" }),
            password: z
                .string()
                .min(6, { message: "Password must be at least 6 characters" })
                .max(20, { message: "Password must be at most 20 characters" }),
            confirmPassword: z.string(),
            telephone: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        })
        .refine((data) => /^[\d+]+$/.test(data.telephone), {
            message: `Telephone can only contain numbers and plus '+' sign`,
            path: ["telephone"],
        });

    const handleFormSubmit = async (data: FormType) => {
        try {
            setIsLoading(true);
            await registration(data);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            navigate("/profile");
        } catch (error) {
            console.error("Registration failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormType>({
        resolver: zodResolver(schema),
    });

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
                    <form
                        onSubmit={handleSubmit(handleFormSubmit)}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                {...register("name")}
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your full name"
                                // value={formData.name}
                                // onChange={handleChange}
                                required
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                {...register("email")}
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                // value={formData.email}
                                // onChange={handleChange}
                                required
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    {...register("password")}
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    // value={formData.password}
                                    // onChange={handleChange}
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
                            {errors.password && (
                                <p className="text-sm text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Input
                                    {...register("confirmPassword")}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm password"
                                    // value={formData.confirmPassword}
                                    // onChange={handleChange}
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
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="telephone">Telephone</Label>
                            <Input
                                {...register("telephone")}
                                id="telephone"
                                name="telephone"
                                type="tel"
                                placeholder="Enter your phone number"
                                // value={formData.telephone}
                                // onChange={handleChange}
                                required
                            />
                            {errors.telephone && (
                                <p className="text-sm text-red-500">
                                    {errors.telephone.message}
                                </p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Registering...
                                </>
                            ) : (
                                "Register"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <p className="text-center w-full text-sm">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 hover:underline"
                        >
                            Login here
                        </Link>
                        {/* <a
                            href="/login"
                            className="text-blue-600 hover:underline"
                        >
                            Login here
                        </a> */}
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
