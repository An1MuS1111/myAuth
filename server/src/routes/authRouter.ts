import { Router, Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { body } from "express-validator";
import { validateRequest, authenticateToken } from "../middlewares";
import * as argon2 from "argon2";

const router = Router();

// Environment variables
// const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
// const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
// const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY; // Short-lived access token
// const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY; // Long-lived refresh token

//exec: to generate access and refresh token
const generateAccessToken = (user: any) =>
    jwt.sign({ id: user.id, name: user.name }, "mySecretKey", {
        expiresIn: "15m",
    });
const generateRefreshToken = (user: any) =>
    jwt.sign({ id: user.id, name: user.name }, "myRefreshSecretKey", {
        expiresIn: "1d",
    });

//exec: register a new

router.post(
    "/registration",
    validateRequest([
        body("email").isEmail().withMessage("Invalid email format"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
    ]),
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password, name, telephone } = req.body;

            // check if the user already exist
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                res.status(409).json({ message: "User already exists" });
                return;
            } else {
                // hash password
                const hashedPassword = await argon2.hash(password);

                // create a new user
                const newUser = await User.create({
                    email,
                    password: hashedPassword,
                    name,
                    telephone,
                });

                // generate access token and refresh token
                const accessToken = generateAccessToken(newUser);
                const refreshToken = generateRefreshToken(newUser);

                res.status(201).json({
                    message: "User created successfully",
                    newUser: { email, name, telephone },
                    accessToken,
                    refreshToken,
                });

                return;
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });

            return;
        }
    }
);

//exec: login an existig user

router.post(
    "/login",
    validateRequest([
        body("email").isEmail().withMessage("Invalid email format"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
    ]),
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            // check if the email exist

            const user = await User.findOne({ where: { email } });
            if (!user) {
                res.status(401).json({
                    message: "Invalid credensials, email not found",
                });
                return;
            } else {
                // check if the password is correct
                const isPasswordValid = await argon2.verify(
                    user.password,
                    password
                );
                if (isPasswordValid) {
                    // generate access token and refresh token
                    const accessToken = generateAccessToken(user);
                    const refreshToken = generateRefreshToken(user);

                    res.status(200).json({
                        message: "User logged in successfully",
                        user: {
                            email,
                            name: user.name,
                            telephone: user.telephone,
                        },
                        accessToken,
                        refreshToken,
                    });
                    return;
                } else {
                    res.status(401).json({ message: "Invalid password" });
                    return;
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    }
);

// todo: need to fix this
router.get(
    "/profile",
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            // Fetch the user from the database using Sequelize
            const user = await User.findByPk(req.user.userId, {
                attributes: { exclude: ["password"] }, // Exclude the password field
            });

            // If the user is not found, return a 404 error
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Return the user data
            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
);

export default router;
