import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type AuthPayload = {
  userId: string;
  role: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is required"
    });
  }

  try {
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthPayload;

    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};
