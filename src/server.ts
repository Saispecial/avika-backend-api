import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";

import {
  endpointNotImplemented,
  globalErrorHandler,
} from "@/middleware/errors.js";
import conversationRoutes from "@/routes/conversationRoutes"; // Import conversation routes
import { chatRouter } from "@/routes/chatRoutes.js";
import { wellnessRouter } from "@/routes/wellnessRoutes.js";
import { chatGeminiRouter } from "@/routes/chatGeminiRoutes.js";
import { wellnessUnifiedRouter } from "@/routes/wellnessUnifiedRoutes.js";

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

/**
 * Example endpoint definition:
 *
 * app.use("/api/user", userRouter);
 */

// Use conversation routes
app.use("/api/conversation", conversationRoutes);

// Use chat and wellness routes
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/wellness", wellnessRouter);
// Spec-matching endpoints
app.use("/api/chat-gemini", chatGeminiRouter);
app.use("/api/wellness", wellnessUnifiedRouter);

/*------------- Error middleware -------------*/
app.use(endpointNotImplemented);
app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`Service listening on port ${PORT}...`));
