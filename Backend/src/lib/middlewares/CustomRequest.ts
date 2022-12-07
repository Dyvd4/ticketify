import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Request {
            /** UserId is not undefined if user is authenticated */
            UserId?: string
        }
    }
}

const CustomRequest = (req: Request, res: Response, next: NextFunction) => {
    next();
}

export default CustomRequest;