import { Request, Response, NextFunction } from "express";
import fetch from "node-fetch";
import { response } from "@/utils/response.js";
import { classifyEmotion } from "@/utils/emotionMap.js";
import { detectSelfHarmTerms } from "@/utils/safetyCheck.js";
import { createMessageRepository } from "@/repositories/messageRepository.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export const chatGeminiHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, sessionId, conversationHistory } = req.body || {};
    if (!message || !sessionId) {
      return res.status(400).json(response(null, new Error("message and sessionId are required")));
    }

    // Enhanced emotion + safety detection
    const emotion = classifyEmotion(String(message));
    const safety = detectSelfHarmTerms(String(message));

    // Call Gemini (basic placeholder HTTP call)
    let modelResponse = "";
    try {
      if (GEMINI_API_KEY) {
        // Placeholder: adjust to actual Gemini REST once finalized
        // Using a fake endpoint to illustrate structure; replace with real Google Generative Language API
        const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `You are a supportive assistant. Prior emotion: ${emotion}. Message: ${message}` },
                ],
              },
            ],
          }),
        });
        const j = await r.json();
        modelResponse = j?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here for you. Would you like to share more?";
      } else {
        modelResponse = "I'm here for you. Would you like to share more?";
      }
    } catch (_e) {
      // Timeout/failed → graceful fallback
      modelResponse = "I'm here for you. Let's take a deep breath together. What happened?";
    }

    const riskLevel = safety.riskLevel;

    // Store user message encrypted
    try {
      const messageRepo = createMessageRepository();
      await messageRepo.storeMessage({
        conversationId: sessionId,
        senderId: (req as any).user?.userId || "anonymous",
        text: String(message),
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Failed to store message:', error);
      // Continue without failing the request
    }

    const payload = {
      response: modelResponse,
      emotion,
      riskLevel,
      recommendations: riskLevel === "high"
        ? [
            "🚨 IMMEDIATE: Call 988 (Suicide & Crisis Lifeline) or 911",
            "📞 Crisis Text Line: Text HOME to 741741",
            "🏥 Go to your nearest emergency room if in immediate danger",
            "🤝 Reach out to a trusted friend, family member, or counselor",
            "💙 Remember: You matter, and this feeling is temporary"
          ]
        : riskLevel === "medium"
        ? [
            "📞 Consider calling 988 for support and guidance",
            "🗣️ Talk to a trusted friend, family member, or counselor",
            "📝 Write down your feelings in a journal",
            "🧘 Try a grounding exercise: 5 things you see, 4 you hear, 3 you feel",
            "🌱 Remember: Seeking help is a sign of strength"
          ]
        : [
            "🧘 Try a 5-minute mindfulness or breathing exercise",
            "🚶 Take a gentle walk outside if possible",
            "📝 Write down one small, achievable goal for today",
            "🎵 Listen to calming music or sounds",
            "☕ Make yourself a warm drink and take a moment to pause"
          ],
    };

    return res.json(response(payload));
  } catch (err) {
    next(err);
  }
};




