import { Router, Request, Response } from "express";
import { User } from "../models/User";

const router = Router();

// auth route for login
router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, password } });
    if (user) {
        res.status(200).json({ message: "Login successful" });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

// auth route for register
router.post("/registration", async (req: Request, res: Response) => {
    const { email, password, name, telephone } = req.body;
    // const user = await User.findOne({ where: { email, password } });

    // if (user) {
    //     res.status(409).json({ message: "User already exists" });
    // } else {
    //     res.status(201).json({ message: "User created successfully" });
    // }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(409).json({ message: "User already exists" });
        } else {
            await User.create({
                email,
                password,
                name,
                telephone,
            });
            res.status(201).json({
                message: "User created successfully",
                newUser: { email, name, telephone },
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
