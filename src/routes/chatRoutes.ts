import express from 'express';
import { createChatController } from "@/controllers/chatController.js";
import { authenticate } from "@/middleware/auth.js";

export const chatRouter = express.Router();
const chatController = createChatController();

chatRouter.use(authenticate);

chatRouter.post('/message/:userId', async (req, res, next) => {
  await chatController.handleUserMessage(req, res, next);
});


