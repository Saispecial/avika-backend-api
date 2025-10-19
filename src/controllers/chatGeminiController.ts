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

    // Emotion + safety
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

    const riskLevel = safety.selfHarmDetected ? "high" : "low";

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
            "If you're in immediate danger, call your local emergency number",
            "Reach out to a trusted friend or family member",
            "Consider contacting a crisis hotline in your region",
          ]
        : [
            "Try a 5-minute grounding exercise",
            "Go for a short walk",
            "Write one small goal for tomorrow",
          ],
    };

    return res.json(response(payload));
  } catch (err) {
    next(err);
  }
};




