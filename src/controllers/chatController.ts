import { Request, Response, NextFunction } from "express";
import { response } from "@/utils/response.js";
import {
  progressConversationAdvanced,
  generateEmotionFollowUp,
  generateCallToAction,
  ConversationState,
  ConversationResponse
} from "@/utils/flowManager.js";
import { mapEmotion, classifyEmotion } from "@/utils/emotionMap.js";
import { detectSelfHarmTerms } from "@/utils/safetyCheck.js";
import { createChatRepository, ChatRepository } from "@/repositories/chatRepository.js";
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

      // 1. Get current conversation state
      const currentState = await this.chatRepository.getConversationState(userId);

      // 2. Safety check first
      const safetyResult = detectSelfHarmTerms(message);
      if (safetyResult.selfHarmDetected) {
        const safetyResponse = this.generateSafetyResponse(safetyResult);

        // Save safety interaction
        await this.chatRepository.saveConversationHistory(userId, {
          userMessage: message,
          botResponse: safetyResponse.message,
          stage: "safety_intervention",
          emotion: "crisis",
          exchangeCount: currentState.exchangeCount + 1,
          actionType: "safety",
          resources: safetyResponse.resources,
        });

        return res.json(response({
          message: safetyResponse.message,
          actionType: "safety",
          resources: safetyResponse.resources,
          riskLevel: "high"
        }));
      }

      // 3. Progress conversation with advanced logic
      const newState = progressConversationAdvanced(message, currentState);

      // 4. Generate appropriate response based on stage
      const conversationResponse = await this.generateResponse(message, newState);

      // 5. Update conversation state
      await this.chatRepository.updateConversationState(userId, newState);

      // 6. Save conversation history
      await this.chatRepository.saveConversationHistory(userId, {
        userMessage: message,
        botResponse: conversationResponse.message,
        stage: newState.stage,
        emotion: newState.dominantEmotion,
        exchangeCount: newState.exchangeCount,
        emotionFollowUps: newState.emotionFollowUps,
        actionType: conversationResponse.actionType,
        resources: conversationResponse.resources,
      });

      // 7. Prepare response
      const responseData: any = {
        message: conversationResponse.message,
        stage: newState.stage,
        exchangeCount: newState.exchangeCount,
        emotion: newState.dominantEmotion
      };

      if (conversationResponse.actionType) {
        responseData.actionType = conversationResponse.actionType;
      }

      if (conversationResponse.resources) {
        responseData.resources = conversationResponse.resources;
      }

      res.json(response(responseData));
    } catch (error) {
      next(error);
    }
  }

  private async generateResponse(message: string, state: ConversationState): Promise<ConversationResponse> {
    switch (state.stage) {
      case "greeting":
        return {
          message: "Hello! I'm here to listen and support you. How are you feeling today?",
          actionType: "regular"
        };

      case "initial_question":
        return {
          message: "Thank you for sharing. I'd like to understand better - what's been on your mind lately?",
          actionType: "regular"
        };

      case "emotion_exploration":
        return {
          message: "I can hear that you're going through something. Can you tell me more about what you're experiencing?",
          actionType: "regular"
        };

      case "emotion_followup":
        const followUpMessage = generateEmotionFollowUp(state.dominantEmotion, state.emotionFollowUps);
        return {
          message: followUpMessage,
          actionType: "followup"
        };

      case "deeper_understanding":
        return {
          message: `It sounds like you're feeling ${state.dominantEmotion}. That's completely valid. How long have you been experiencing this?`,
          actionType: "regular"
        };

      case "call_to_action":
        const callToAction = generateCallToAction(state.dominantEmotion, state.exchangeCount, state.lastActionType);
        // Update state with the action type used
        state.lastActionType = callToAction.actionType;
        return callToAction;

      case "ongoing_support":
        const ongoingSupport = generateCallToAction(state.dominantEmotion, state.exchangeCount, state.lastActionType);
        state.lastActionType = ongoingSupport.actionType;
        return ongoingSupport;

      case "supportive_response":
        return {
          message: "I'm here with you. Your feelings are valid, and it's okay to take things one step at a time. What feels most important to you right now?",
          actionType: "regular"
        };

      default:
        return {
          message: "I'm here to listen and support you. What would you like to talk about?",
          actionType: "regular"
        };
    }
  }

  private generateSafetyResponse(safetyResult: { selfHarmDetected: boolean; terms: string[] }): ConversationResponse {
    return {
      message: "I'm really concerned about what you've shared. Your life has value, and there are people who want to help. Please reach out to someone right now - you don't have to go through this alone.",
      actionType: "safety",
      resources: [
        "🚨 IMMEDIATE HELP: If you're in immediate danger, call 911 or go to your nearest emergency room",
        "📞 National Suicide Prevention Lifeline: 988 (available 24/7)",
        "💬 Crisis Text Line: Text HOME to 741741",
        "🌐 International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/",
        "🤝 SAMHSA National Helpline: 1-800-662-4357 (free, confidential, 24/7)",
        "💙 Remember: This feeling is temporary, but suicide is permanent. You matter."
      ]
    };
  }
}

export const createChatController = () => {
  const chatRepository = createChatRepository();
  return new ChatController(chatRepository);
};


