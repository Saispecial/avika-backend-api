import express from 'express';
import { authenticate } from '@/middleware/auth.js';
import { chatGeminiAdvancedHandler } from '@/controllers/chatGeminiAdvancedController.js';

export const chatGeminiAdvancedRouter = express.Router();

// Apply authentication middleware
chatGeminiAdvancedRouter.use(authenticate);

// Enhanced Gemini chat endpoint with advanced features
chatGeminiAdvancedRouter.post('/', chatGeminiAdvancedHandler);

export default chatGeminiAdvancedRouter;