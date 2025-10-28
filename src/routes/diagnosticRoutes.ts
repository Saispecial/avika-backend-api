import express from 'express';
import { response } from '@/utils/response.js';

export const diagnosticRouter = express.Router();

// Simple test endpoint
diagnosticRouter.get('/test', (req, res) => {
  res.json(response({
    message: "Diagnostic endpoint working",
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    headers: req.headers
  }));
});

// Test POST endpoint
diagnosticRouter.post('/test', (req, res) => {
  res.json(response({
    message: "POST diagnostic endpoint working",
    body: req.body,
    timestamp: new Date().toISOString()
  }));
});

// List all available endpoints
diagnosticRouter.get('/endpoints', (req, res) => {
  const endpoints = {
    root: "GET /",
    health: "GET /health",
    diagnostic: {
      test: "GET|POST /diagnostic/test",
      endpoints: "GET /diagnostic/endpoints"
    },
    conversation: {
      start: "POST /api/conversation/start",
      emotion: "POST /api/conversation/emotion",
      engage: "POST /api/conversation/engage", 
      final: "POST /api/conversation/final"
    },
    chat: {
      message: "POST /api/v1/chat/message/:userId (JWT required)"
    },
    wellness: {
      analyze: "GET /api/v1/wellness/analyze/:userId (JWT required)",
      recommendations: "GET /api/v1/wellness/recommendations/:userId (JWT required)",
      safety: "GET /api/v1/wellness/safety/:userId (JWT required)"
    },
    gemini: {
      basic: "POST /api/chat-gemini (JWT required)",
      advanced: "POST /api/chat-gemini-advanced (JWT required)"
    },
    wellnessUnified: {
      analyzeSession: "POST /api/wellness?action=analyze-session (JWT required)",
      generateRecommendations: "POST /api/wellness?action=generate-recommendations (JWT required)",
      safetyCheck: "POST /api/wellness?action=safety-check (JWT required)"
    }
  };

  res.json(response({
    message: "Available API endpoints",
    endpoints
  }));
});

export default diagnosticRouter;