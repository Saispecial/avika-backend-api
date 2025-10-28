import { Request, Response, NextFunction } from "express";
import fetch from "node-fetch";
import { response } from "@/utils/response.js";
import { classifyEmotion } from "@/utils/emotionMap.js";
import { detectSelfHarmTerms } from "@/utils/safetyCheck.js";
import { createMessageRepository } from "@/repositories/messageRepository.js";
import { 
  progressConversationAdvanced, 
  generateEmotionFollowUp, 
  generateCallToAction,
  ConversationState,
  ConversationResponse,
  createInitialConversationState
} from "@/utils/flowManager.js";
import { createChatRepository } from "@/repositories/chatRepository.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

export class ChatGeminiAdvancedController {
  private chatRepository = createChatRepository();
  private messageRepository = createMessageRepository();

  async handleAdvancedGeminiChat(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, sessionId, conversationHistory } = req.body || {};
      if (!message || !sessionId) {
        return res.status(400).json(response(null, new Error("message and sessionId are required")));
      }

      const userId = sessionId; // Use sessionId as userId for this implementation

      // 1. Get current conversation state
      const currentState = await this.chatRepository.getConversationState(userId);
      
      // 2. Enhanced emotion + safety detection
      const emotion = classifyEmotion(String(message));
      const safety = detectSelfHarmTerms(String(message));

      // 3. Safety check first - immediate intervention
      if (safety.selfHarmDetected && safety.riskLevel === "high") {
        const safetyResponse = this.generateSafetyResponse();
        
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
          response: safetyResponse.message,
          emotion: "crisis",
          riskLevel: "high",
          actionType: "safety",
          recommendations: safetyResponse.resources
        }));
      }

      // 4. Progress conversation with advanced logic
      const newState = progressConversationAdvanced(message, currentState);

      // 5. Generate response based on conversation stage
      let finalResponse: string;
      let actionType: string = "regular";
      let resources: string[] = [];

      if (newState.stage === "emotion_followup") {
        // Use our advanced follow-up system
        finalResponse = generateEmotionFollowUp(newState.dominantEmotion, newState.emotionFollowUps);
        actionType = "followup";
      } else if (newState.stage === "call_to_action" || newState.stage === "ongoing_support") {
        // Use our call-to-action system
        const callToAction = generateCallToAction(newState.dominantEmotion, newState.exchangeCount, newState.lastActionType);
        finalResponse = callToAction.message;
        actionType = callToAction.actionType || "action";
        resources = callToAction.resources || [];
        newState.lastActionType = callToAction.actionType;
      } else {
        // Use Gemini for regular conversation with enhanced context
        finalResponse = await this.getGeminiResponse(message, newState, conversationHistory);
      }

      // 6. Store user message encrypted
      try {
        await this.messageRepository.storeMessage({
          conversationId: sessionId,
          senderId: (req as any).user?.userId || "anonymous",
          text: String(message),
          timestamp: new Date(),
        });
      } catch (error) {
        console.error('Failed to store message:', error);
      }

      // 7. Update conversation state
      await this.chatRepository.updateConversationState(userId, newState);

      // 8. Save conversation history
      await this.chatRepository.saveConversationHistory(userId, {
        userMessage: message,
        botResponse: finalResponse,
        stage: newState.stage,
        emotion: newState.dominantEmotion,
        exchangeCount: newState.exchangeCount,
        emotionFollowUps: newState.emotionFollowUps,
        actionType,
        resources,
      });

      // 9. Prepare enhanced response
      const payload = {
        response: finalResponse,
        emotion: newState.dominantEmotion,
        riskLevel: safety.riskLevel,
        stage: newState.stage,
        exchangeCount: newState.exchangeCount,
        actionType,
        recommendations: resources.length > 0 ? resources : this.getBasicRecommendations(safety.riskLevel)
      };

      return res.json(response(payload));
    } catch (err) {
      next(err);
    }
  }

  private async getGeminiResponse(message: string, state: ConversationState, conversationHistory?: string[]): Promise<string> {
    try {
      if (!GEMINI_API_KEY) {
        return this.getFallbackResponse(state);
      }

      // Build enhanced context for Gemini
      const context = this.buildGeminiContext(message, state, conversationHistory);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: context }]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            }
          }),
        }
      );

      const data = await response.json() as GeminiResponse;
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || this.getFallbackResponse(state);
    } catch (error) {
      console.error("Gemini API error:", error);
      return this.getFallbackResponse(state);
    }
  }

  private buildGeminiContext(message: string, state: ConversationState, conversationHistory?: string[]): string {
    const historyContext = conversationHistory ? 
      `Previous conversation: ${conversationHistory.slice(-5).join(" | ")}` : "";

    return `You are Avika, an empathetic AI assistant focused on emotional wellness and mental health support.

Context:
- Current emotion detected: ${state.dominantEmotion}
- Conversation stage: ${state.stage}
- Exchange count: ${state.exchangeCount}
- Emotion follow-ups done: ${state.emotionFollowUps}
${historyContext}

Guidelines:
- Be warm, empathetic, and supportive
- Validate the user's feelings
- Ask thoughtful follow-up questions when appropriate
- Provide gentle guidance without being prescriptive
- Keep responses concise but meaningful (2-3 sentences)
- Focus on emotional support and understanding

User's current message: "${message}"

Respond as Avika with empathy and emotional intelligence:`;
  }

  private getFallbackResponse(state: ConversationState): string {
    const fallbacks = {
      greeting: "Hello! I'm Avika, and I'm here to listen and support you. How are you feeling today?",
      initial_question: "Thank you for sharing with me. I'd like to understand better - what's been on your mind lately?",
      emotion_exploration: "I can hear that you're going through something important. Can you tell me more about what you're experiencing?",
      deeper_understanding: `It sounds like you're feeling ${state.dominantEmotion}. That's completely valid. How long have you been experiencing this?`,
      supportive_response: "I'm here with you. Your feelings are valid, and it's okay to take things one step at a time. What feels most important to you right now?"
    };

    return fallbacks[state.stage as keyof typeof fallbacks] || 
           "I'm here to listen and support you. What would you like to talk about?";
  }

  private generateSafetyResponse(): ConversationResponse {
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

  private getBasicRecommendations(riskLevel: string): string[] {
    switch (riskLevel) {
      case "high":
        return [
          "🚨 IMMEDIATE: Call 988 (Suicide & Crisis Lifeline) or 911",
          "📞 Crisis Text Line: Text HOME to 741741",
          "🏥 Go to your nearest emergency room if in immediate danger",
          "🤝 Reach out to a trusted friend, family member, or counselor",
          "💙 Remember: You matter, and this feeling is temporary"
        ];
      case "medium":
        return [
          "📞 Consider calling 988 for support and guidance",
          "🗣️ Talk to a trusted friend, family member, or counselor",
          "📝 Write down your feelings in a journal",
          "🧘 Try a grounding exercise: 5 things you see, 4 you hear, 3 you feel",
          "🌱 Remember: Seeking help is a sign of strength"
        ];
      default:
        return [
          "🧘 Try a 5-minute mindfulness or breathing exercise",
          "🚶 Take a gentle walk outside if possible",
          "📝 Write down one small, achievable goal for today",
          "🎵 Listen to calming music or sounds",
          "☕ Make yourself a warm drink and take a moment to pause"
        ];
    }
  }
}

export const chatGeminiAdvancedHandler = async (req: Request, res: Response, next: NextFunction) => {
  const controller = new ChatGeminiAdvancedController();
  return controller.handleAdvancedGeminiChat(req, res, next);
};