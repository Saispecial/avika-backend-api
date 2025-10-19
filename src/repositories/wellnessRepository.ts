export interface WellnessRepository {
  saveConversationHistory: (userId: string, message: string) => Promise<void>;
  getConversationHistory: (userId: string) => Promise<string[]>;
  saveEmotionalState: (userId: string, emotionalState: string) => Promise<void>;
  getEmotionalState: (userId: string) => Promise<string | null>;
}

export const createWellnessRepository = (): WellnessRepository => {
  // In-memory storage for conversation history and emotional state
  const conversationHistory: { [userId: string]: string[] } = {};
  const emotionalState: { [userId: string]: string } = {};

  return {
    async saveConversationHistory(userId: string, message: string): Promise<void> {
      if (!conversationHistory[userId]) {
        conversationHistory[userId] = [];
      }
      conversationHistory[userId].push(message);
    },

    async getConversationHistory(userId: string): Promise<string[]> {
      return conversationHistory[userId] || [];
    },

    async saveEmotionalState(userId: string, state: string): Promise<void> {
      emotionalState[userId] = state;
    },

    async getEmotionalState(userId: string): Promise<string | null> {
      return emotionalState[userId] || null;
    },
  };
};


