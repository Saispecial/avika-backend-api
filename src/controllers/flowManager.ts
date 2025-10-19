import { Request, Response, NextFunction } from 'express';

enum ConversationStage {
  START = 'START',
  EMOTION = 'EMOTION',
  ENGAGE = 'ENGAGE',
  FINAL = 'FINAL',
}

// Session data structure
interface SessionData {
  stage: ConversationStage;
}

// In-memory session store (replace with a database in production)
const sessionStore: { [sessionId: string]: SessionData } = {};

interface FlowManagerController {
  handleConversationFlow: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

/**
 * Creates a flow manager controller.
 */
export const createFlowManagerController = (): FlowManagerController => {
  return {
    async handleConversationFlow(req: Request, res: Response, next: NextFunction) {
      const sessionId = req.headers['session-id'] as string; // Assuming session ID is passed in the header

      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
      }

      // Initialize session if it doesn't exist
      if (!sessionStore[sessionId]) {
        sessionStore[sessionId] = { stage: ConversationStage.START };
      }

      const currentStage = sessionStore[sessionId].stage;

      try {
        switch (currentStage) {
          case ConversationStage.START:
            sessionStore[sessionId].stage = ConversationStage.EMOTION;
            break;
          case ConversationStage.EMOTION:
            sessionStore[sessionId].stage = ConversationStage.ENGAGE;
            break;
          case ConversationStage.ENGAGE:
            sessionStore[sessionId].stage = ConversationStage.FINAL;
            break;
          case ConversationStage.FINAL:
            break;
          default:
            console.warn('Unexpected conversation stage:', currentStage);
            break;
        }

        (req as any).conversationStage = currentStage; // Attach the current stage to the request

        next(); // Proceed to the next middleware or route handler
      } catch (error) {
        console.error('Error handling conversation flow:', error);
        next(error);
      }
    },
  };
};

export { ConversationStage };
