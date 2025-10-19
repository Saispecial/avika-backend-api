import express from "express";
import {
  startConversationHandler,
  processEmotionHandler,
  engageConversationHandler,
  finalStageHandler,
} from "@/controllers/conversationController";
import { safetyDetectionMiddleware } from "@/middleware/safetyDetectionMiddleware";
import { emotionRecognitionMiddleware } from "@/middleware/emotionRecognitionMiddleware";

const router = express.Router();

// Route for starting the conversation
router.post("/start", startConversationHandler);

// Route for processing emotion
router.post(
  "/emotion",
  processEmotionHandler
);

// Route for engaging in the conversation
router.post("/engage", safetyDetectionMiddleware, engageConversationHandler);

// Route for the final stage of the conversation
router.post("/final", finalStageHandler);

export default router;
