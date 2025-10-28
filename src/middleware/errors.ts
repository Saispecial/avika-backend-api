import { Request, Response, NextFunction } from "express";

/**
 * Middleware to handle endpoints that are not implemented
 */
export const endpointNotImplemented = (req: Request, res: Response, next: NextFunction) => {
  // Only handle if no response has been sent yet
  if (!res.headersSent) {
    res.status(404).json({
      success: false,
      error: {
        code: "ENDPOINT_NOT_FOUND",
        message: `Endpoint ${req.method} ${req.path} not found`,
        timestamp: new Date().toISOString()
      }
    });
  }
};

/**
 * Global error handler middleware
 */
export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Global Error Handler:", {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    error: error.message,
    stack: error.stack
  });

  // Don't send response if headers already sent
  if (res.headersSent) {
    return next(error);
  }

  // Determine status code
  const statusCode = error.status || error.statusCode || 500;

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      code: error.code || "INTERNAL_SERVER_ERROR",
      message: error.message || "An unexpected error occurred",
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === "development" && { stack: error.stack })
    }
  });
};