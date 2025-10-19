import { Request, Response, NextFunction } from "express";
import { response } from "@/utils/response.js";
import { detectSelfHarmTerms } from "@/utils/safetyCheck.js";
import { classifyEmotion } from "@/utils/emotionMap.js";

export const wellnessUnifiedHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const action = String(req.query.action || "");
    const body = req.body || {};

    if (action === "analyze-session") {
      const history: string[] = Array.isArray(body.conversationHistory) ? body.conversationHistory : [];
      const joined = history.join("\n");
      const dominantEmotion = classifyEmotion(joined);
      const insight = dominantEmotion === "anxious"
        ? "You’ve been expressing uncertainty lately."
        : dominantEmotion === "sadness"
        ? "You may be processing some heavy feelings."
        : "Your mood appears relatively stable.";
      const activities = ["deep breathing", "mind reset video", "guided reflection"];
      return res.json(response({ dominantEmotion, insight, activities }));
    }

    if (action === "generate-recommendations") {
      const activities = [
        "5-minute breathing exercise",
        "write down three gratitudes",
        "take a brief walk",
        "listen to calming music",
        "stretch for two minutes",
      ];
      // simple random pick of 3
      const picks = activities.sort(() => 0.5 - Math.random()).slice(0, 3);
      return res.json(response({ activities: picks }));
    }

    if (action === "safety-check") {
      const message = String(body.message || "");
      const safety = detectSelfHarmTerms(message);
      const riskLevel = safety.selfHarmDetected ? "high" : "low";
      const helplines = [
        "If you're in immediate danger, call your local emergency number",
        "US: 988 Suicide & Crisis Lifeline",
        "UK & ROI: Samaritans 116 123",
      ];
      return res.json(response({ riskLevel, helplines }));
    }

    return res.status(400).json(response(null, new Error("Unsupported action")));
  } catch (err) {
    next(err);
  }
};




