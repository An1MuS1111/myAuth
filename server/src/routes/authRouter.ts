import { Router, Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { body } from "express-validator";
import { validateRequest, authenticateToken } from "../middlewares";
import * as argon2 from "argon2";

const router = Router();

type DecodedTokenType = {
    userId?: number;
};

declare global {
    namespace Express {
        interface Request {
            user?: DecodedTokenType; // Make 'user' optional, as it might not always be there
        }
    }
}

// Environment variables
const JWT_ACCESS_SECRET: string = process.env.JWT_ACCESS_SECRET!;
const JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET!;

//exec: to generate access and refresh token
const generateAccessToken = (user: any) =>
    jwt.sign({ id: user.id, name: user.name }, JWT_ACCESS_SECRET, {
        expiresIn: "1m",
    });
const generateRefreshToken = (user: any) =>
    jwt.sign({ id: user.id, name: user.name }, JWT_REFRESH_SECRET, {
        expiresIn: "7d",
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

                console.log(newUser.get({ plain: true }));

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
                    console.log(user);

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

// exec: get user profile
router.get(
    "/profile",
    authenticateToken,
    async (req: Request, res: Response): Promise<void> => {
        // No need for the extra type here
        try {
            if (!req.user) {
                // Check if req.user exists (important!)
                res.status(401).json({ message: "Unauthorized" }); // or 403
                return;
            }

            const user = await User.findByPk(req.user.userId, {
                attributes: { exclude: ["password"] },
            });

            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
);

// exec: refresh token
router.post("/refresh-token", async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(401).json({ message: "Refresh token not provided" });
            return;
        }

        // verify refresh token
        const decodedToken = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
            id: number;
        };

        // Find the user and validate the refresh token

        const user = await User.findByPk(decodedToken.id);
        if (!user) {
            res.status(403).json({ message: "Invalid refresh token" });
            return;
        }

        // generate new access token and refresh token
        const accessToken = generateAccessToken(user);
        // const newRefreshToken = generateRefreshToken(user);

        res.status(200).json({
            accessToken,
            // refreshToken: newRefreshToken,
        });
    } catch (error) {
        console.error(error);
        res.status(403).json({ message: "Invalid or expired refresh token" });
    }
});

export default router;
