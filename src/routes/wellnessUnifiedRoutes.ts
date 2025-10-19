import express from 'express';
import { authenticate } from '@/middleware/auth.js';
import { wellnessUnifiedHandler } from '@/controllers/wellnessUnifiedController.js';

export const wellnessUnifiedRouter = express.Router();

wellnessUnifiedRouter.use(authenticate);

wellnessUnifiedRouter.post('/', wellnessUnifiedHandler);




