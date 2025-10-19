import { encrypt, decrypt } from "@/utils/encryption.js";

export interface ChatRepository {
  saveConversationHistory: (userId: string, conversation: Conversation) => Promise<void>;
  getConversationHistory: (userId: string) => Promise<Conversation[]>;
}

export type Conversation = {
  userMessage: string;
  botResponse: string;
  stage: string;
  emotion: string;
};

export const createChatRepository = (): ChatRepository => {
  // In-memory storage for conversation history
  const conversationHistory: { [userId: string]: Conversation[] } = {};

  return {
    async saveConversationHistory(userId: string, conversation: Conversation): Promise<void> {
      const encryptedUserMessage = encrypt(conversation.userMessage);
      const encryptedBotResponse = encrypt(conversation.botResponse);

      if (!conversationHistory[userId]) {
        conversationHistory[userId] = [];
      }

      conversationHistory[userId].push({
        userMessage: encryptedUserMessage,
        botResponse: encryptedBotResponse,
        stage: conversation.stage,
        emotion: conversation.emotion,
      });
    },

    async getConversationHistory(userId: string): Promise<Conversation[]> {
      const history = conversationHistory[userId] || [];
      return history.map(conversation => ({
        userMessage: decrypt(conversation.userMessage),
        botResponse: decrypt(conversation.botResponse),
        stage: conversation.stage,
        emotion: conversation.emotion,
      }));
    },
  };
};


