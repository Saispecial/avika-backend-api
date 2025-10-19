import { response } from "@/utils/response.js";
import { notImplementedError, internalServerError } from "@/utils/errors/common.js";
import { HttpError } from "@/utils/errors/HttpError.js";
import { NextFunction, Request, RequestHandler, Response } from "express";

// Global Error Handler Middleware
export const globalErrorHandler = (
  err: HttpError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(`Timestamp: ${new Date().toISOString()}`);
  console.error("Error:", err);

  let responseStatus = 500;
  let errorResponse = internalServerError(); // Default to internal server error

  if (err instanceof HttpError) {
    responseStatus = err.status;
    errorResponse = err;
  }
  
  res.status(responseStatus).send(response(undefined, errorResponse));
};

// Middleware for handling requests that don't match any available router
export const endpointNotImplemented: RequestHandler = (_req, _res, next) => {
  next(notImplementedError());
};
