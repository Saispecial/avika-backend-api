import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";

import {
  endpointNotImplemented,
  globalErrorHandler,
} from "@/middleware/errors.js";
import conversationRoutes from "@/routes/conversationRoutes.js"; // Import conversation routes
import { chatRouter } from "@/routes/chatRoutes.js";
import { wellnessRouter } from "@/routes/wellnessRoutes.js";
import { chatGeminiRouter } from "@/routes/chatGeminiRoutes.js";
import { wellnessUnifiedRouter } from "@/routes/wellnessUnifiedRoutes.js";
import chatGeminiAdvancedRouter from "@/routes/chatGeminiAdvancedRoutes.js";
import healthRouter from "@/routes/healthRoutes.js";
import diagnosticRouter from "@/routes/diagnosticRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

declare module "http" {
  interface IncomingMessage {
    rawBody: string;
  }
}

app.use(cors());
app.use(
  express.json({
    verify: (req, _, buf) => {
      // Provide access to the request raw body
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.urlencoded({ extended: false }));

/*------------- Security Config -------------*/
app.use(helmet());

/*------------- Endpoints -------------*/

// Root endpoint
app.get("/", (_req, res) => {
  res.json({
    success: true,
    data: {
      message: "🌟 Avika Backend API - Mental Health Support System",
      version: "1.0.0",
      status: "running",
      endpoints: {
        health: "/health",
        conversation: "/api/conversation/*",
        chat: "/api/v1/chat/*",
        wellness: "/api/v1/wellness/*",
        geminiBasic: "/api/chat-gemini",
        geminiAdvanced: "/api/chat-gemini-advanced",
        wellnessUnified: "/api/wellness"
      },
      documentation: {
        testing: "See API_TESTING_GUIDE.md",
        features: "See ADVANCED_FEATURES.md",
        gemini: "See GEMINI_INTEGRATION.md"
      }
    }
  });
});

// Health check endpoint (no auth required)
app.use("/health", healthRouter);

// Diagnostic endpoints (no auth required)
app.use("/diagnostic", diagnosticRouter);

// Use conversation routes
app.use("/api/conversation", conversationRoutes);

// Use chat and wellness routes
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/wellness", wellnessRouter);
// Spec-matching endpoints
app.use("/api/chat-gemini", chatGeminiRouter);
app.use("/api/chat-gemini-advanced", chatGeminiAdvancedRouter);
app.use("/api/wellness", wellnessUnifiedRouter);

/*------------- Error middleware -------------*/
app.use(endpointNotImplemented);
app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`Service listening on port ${PORT}...`));
