import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "mySecretKey";

type DecodedTokenType = {
    id: number;
};

//exec: Middleware to authenticate access token
const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; //Bearer <token>

    if (token == null) {
        res.status(401).json({ message: "Unauthorized, No token provided" });
        return;
    }

    try {
        const decodedToken = jwt.verify(
            token,
            JWT_ACCESS_SECRET
        ) as DecodedTokenType;

        req.user = { userId: decodedToken.id };
        console.log(req.user);
        next();
    } catch (error) {
        console.error("Token verification error:", error); // Log the error for debugging
        res.status(403).json({ message: "Invalid token" }); // Or just 403
        return;
    }

    return;
};

export default authenticateToken;
