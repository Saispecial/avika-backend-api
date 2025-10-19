import express from 'express';
import { createWellnessController } from "@/controllers/wellnessController.js";
import { authenticate } from "@/middleware/auth.js";

export const wellnessRouter = express.Router();
const wellnessController = createWellnessController();

wellnessRouter.use(authenticate);

wellnessRouter.get('/analyze/:userId', async (req, res, next) => {
  await wellnessController.analyzeConversationHistory(req, res, next);
});

wellnessRouter.get('/recommendations/:userId', async (req, res, next) => {
  await wellnessController.generateRecommendations(req, res, next);
});

wellnessRouter.get('/safety/:userId', async (req, res, next) => {
  await wellnessController.performSafetyCheck(req, res, next);
});


