import { Request, Response, NextFunction } from "express";
import { response } from "@/utils/response";
import { classifyEmotion } from "@/utils/emotionMap";
import { detectSelfHarmTerms } from "@/utils/safetyCheck";
import { z } from "zod";
import { createMessageRepository } from "@/repositories/messageRepository";

interface ConversationController {
  startConversationHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  processEmotionHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  engageConversationHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  finalStageHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

// Zod schema for message validation
const messageSchema = z.object({
  text: z.string().min(1, { message: "Message must not be empty" }),
});

// Placeholder Gemini API integration
const getGeminiResponse = async (prompt: string): Promise<string> => {
  // In a real application, this would call the Gemini API
  return `Gemini response to: ${prompt}`;
};

export const createConversationController = (): ConversationController => {
  return {
    async startConversationHandler(req: Request, res: Response, next: NextFunction) {
      try {
        const geminiResponse = await getGeminiResponse("Start conversation");
        res.json(response({ message: geminiResponse }));
      } catch (error) {
        next(error);
      }
    },

    async processEmotionHandler(req: Request, res: Response, next: NextFunction) {
      try {
        // Validate the message using Zod
        const validatedData = messageSchema.parse(req.body);
        const text = validatedData.text;

        // Extract emotion and safety info
        const emotion = classifyEmotion(text);
        const safetyResult = detectSelfHarmTerms(text);

        // Call Gemini API with the processed information
        const geminiResponse = await getGeminiResponse(`Process emotion: ${emotion}, safety: ${safetyResult.selfHarmDetected}`);

        // Respond with the Gemini response
        res.json(response({ message: geminiResponse }));
      } catch (error) {
        next(error);
      }
    },

    async engageConversationHandler(req: Request, res: Response, next: NextFunction) {
      try {
        // Validate the message using Zod
        const validatedData = messageSchema.parse(req.body);
        const text = validatedData.text;

        const safetyResult = detectSelfHarmTerms(text); // Access safety result from middleware
        const geminiResponse = await getGeminiResponse("Engage conversation");

        if (safetyResult?.selfHarmDetected) {
          // Modify the response based on safety detection
          res.json(response({
            message: "I'm sorry to hear that. It's important to seek help. Here are some resources...",
            geminiResponse
          }));
        } else {
          res.json(response({ message: geminiResponse }));
        }
      } catch (error) {
        next(error);
      }
    },

    async finalStageHandler(req: Request, res: Response, next: NextFunction) {
      try {
        const geminiResponse = await getGeminiResponse("Final stage");
        res.json(response({ message: geminiResponse }));
      } catch (error) {
        next(error);
      }
    },
  };
};

const conversationController = createConversationController();

export const {
  startConversationHandler,
  processEmotionHandler,
  engageConversationHandler,
  finalStageHandler,
} = conversationController;
