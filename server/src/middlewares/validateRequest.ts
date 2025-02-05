import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

//exec: Middleware to validate request body
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

export default validateRequest;
