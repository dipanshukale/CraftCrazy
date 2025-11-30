import { Request, Response, NextFunction } from "express";

// Custom Error Interface
interface CustomError extends Error {
  statusCode?: number;
}

// Global Error Handler Middleware
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};
