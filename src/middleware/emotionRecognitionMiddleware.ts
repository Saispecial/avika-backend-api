import { RequestHandler, Request, Response, NextFunction } from "express";
import { classifyEmotion } from "@/utils/emotionMap";

/**
 * Middleware to handle emotion recognition and extract relevant information from user input.
 */
export const emotionRecognitionMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const text = req.body.text || req.query.text || req.rawBody; // Adjust based on your request structure
    if (!text) {
      return next(); // Skip if no text is provided
    }

    const emotion = classifyEmotion(text.toString());
    (req as any).emotion = emotion; // Attach emotion to request object

    next();
  } catch (error) {
    console.error("Emotion recognition middleware error:", error);
    next(error);
  }
};
