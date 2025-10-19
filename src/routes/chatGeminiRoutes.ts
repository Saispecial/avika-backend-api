import express from 'express';
import { authenticate } from '@/middleware/auth.js';
import { chatGeminiHandler } from '@/controllers/chatGeminiController.js';

export const chatGeminiRouter = express.Router();

chatGeminiRouter.use(authenticate);

chatGeminiRouter.post('/', chatGeminiHandler);




