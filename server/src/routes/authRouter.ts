import { Router, Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { body, validationResult } from "express-validator";
import * as argon2 from "argon2";

// import { validateRequest } from "../middlewares";

const router = Router();

// Environment variables
// const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
// const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
// const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY; // Short-lived access token
// const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY; // Long-lived refresh token

// Middleware to validate request body
const validateRequest = (validations: any[]) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        await Promise.all(validations.map((validation) => validation.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next(); // Continue to the next middleware or request handler
    };
};

//*implementation to generate access and refresh token*//
const generateAccessToken = (user: any) =>
    jwt.sign({ id: user.id, name: user.name }, "mySecretKey", {
        expiresIn: "15m",
    });
const generateRefreshToken = (user: any) =>
    jwt.sign({ id: user.id, name: user.name }, "myRefreshSecretKey", {
        expiresIn: "1d",
    });

// register a new user
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

// login an existig user

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

export default router;
