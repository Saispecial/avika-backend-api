import { Request, Response, NextFunction } from "express";
import { response } from "@/utils/response";
import { progressConversation } from "@/utils/flowManager";
import { mapEmotion } from "@/utils/emotionMap";
import { createChatRepository, ChatRepository } from "@/repositories/chatRepository";
import { z } from "zod";

// Zod schema for message validation
const messageSchema = z.object({
  message: z.string().min(1, { message: "Message must not be empty" }),
});

export class ChatController {
  private chatRepository: ChatRepository;

  constructor(chatRepository: ChatRepository) {
    this.chatRepository = chatRepository;
  }

  async handleUserMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const validatedData = messageSchema.parse(req.body);
      const message = validatedData.message;

      // 1. Get current conversation stage
      const conversationHistory = await this.chatRepository.getConversationHistory(userId);
      const currentStage = conversationHistory.length === 0 ? "greeting" : conversationHistory[conversationHistory.length - 1].stage;

      // 2. Progress conversation
      const nextStage = progressConversation(message, currentStage);

      // 3. Detect emotion if needed
      let emotion = "neutral";
      if (nextStage === "emotion_assessment") {
        emotion = mapEmotion(message);
      }

      // 4. Generate response (replace with actual logic)
      let botResponse = `You said: ${message}. Current stage: ${currentStage}, Next stage: ${nextStage}, Emotion: ${emotion}`;
      if (nextStage === "greeting") {
        botResponse = "Hello! How can I help you today?";
      } else if (nextStage === "initial_question") {
        botResponse = "Are you feeling stressed or anxious?";
      } else if (nextStage === "elaboration") {
        botResponse = "Can you tell me more about what's going on?";
      } else if (nextStage === "recommendation") {
        botResponse = "Based on your input, I recommend you try some relaxation techniques.";
      } else if (nextStage === "farewell") {
        botResponse = "Goodbye! Have a great day.";
      }

      // 5. Save conversation history
      await this.chatRepository.saveConversationHistory(userId, {
        userMessage: message,
        botResponse: botResponse,
        stage: nextStage,
        emotion: emotion,
      });

      res.json(response({ message: botResponse }));
    } catch (error) {
      next(error);
    }
  }
}

export const createChatController = () => {
  const chatRepository = createChatRepository();
  return new ChatController(chatRepository);
};


