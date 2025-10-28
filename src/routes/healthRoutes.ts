import express from 'express';
import { response } from '@/utils/response.js';

export const healthRouter = express.Router();

// Health check endpoint - no auth required
healthRouter.get('/', (req, res) => {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    features: {
      geminiIntegration: !!process.env.GEMINI_API_KEY,
      supabaseConnection: !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY),
      jwtAuth: !!process.env.JWT_SECRET,
      encryption: !!process.env.DB_ENCRYPTION_KEY
    },
    endpoints: {
      conversation: '/api/conversation/*',
      basicChat: '/api/v1/chat/*',
      wellness: '/api/v1/wellness/*',
      geminiBasic: '/api/chat-gemini',
      geminiAdvanced: '/api/chat-gemini-advanced',
      wellnessUnified: '/api/wellness'
    }
  };

  res.json(response(healthStatus));
});

// Detailed system check
healthRouter.get('/detailed', (req, res) => {
  const detailedHealth = {
    server: {
      status: 'running',
      port: process.env.PORT || 3000,
      nodeVersion: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    },
    configuration: {
      geminiApiKey: process.env.GEMINI_API_KEY ? 'configured' : 'missing',
      supabaseUrl: process.env.SUPABASE_URL ? 'configured' : 'missing',
      supabaseKey: process.env.SUPABASE_SERVICE_KEY ? 'configured' : 'missing',
      jwtSecret: process.env.JWT_SECRET ? 'configured' : 'missing',
      encryptionKey: process.env.DB_ENCRYPTION_KEY ? 'configured' : 'missing'
    },
    features: {
      emotionDetection: 'enabled',
      safetyDetection: 'enabled',
      conversationFlow: 'enabled',
      encryptedStorage: 'enabled',
      jwtAuthentication: 'enabled',
      geminiIntegration: process.env.GEMINI_API_KEY ? 'enabled' : 'disabled',
      supabaseIntegration: (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) ? 'enabled' : 'disabled'
    }
  };

  res.json(response(detailedHealth));
});

export default healthRouter;