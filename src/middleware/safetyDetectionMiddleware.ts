import { RequestHandler, Request, Response, NextFunction } from "express";
import { detectSelfHarmTerms } from "@/utils/safetyCheck";

/**
 * Middleware to detect self-harm terms in user input and trigger appropriate responses.
 */
export const safetyDetectionMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const text = req.body.text || req.query.text || req.rawBody; // Adjust based on your request structure
    if (!text) {
      return next(); // Skip if no text is provided
    }

    const safetyResult = detectSelfHarmTerms(text.toString());
    (req as any).safetyResult = safetyResult; // Attach result to request object

    if (safetyResult.selfHarmDetected) {
      // Handle the case where self-harm is detected
      console.warn("Self-harm detected:", safetyResult);
      // You might want to log this, send an alert, or modify the response
    }

    next();
  } catch (error) {
    console.error("Safety detection middleware error:", error);
    next(error);
  }
};
