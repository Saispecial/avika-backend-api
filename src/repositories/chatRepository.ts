import { encrypt, decrypt } from "@/utils/encryption.js";
import { ConversationState, createInitialConversationState } from "@/utils/flowManager.js";

export interface ChatRepository {
  saveConversationHistory: (userId: string, conversation: Conversation) => Promise<void>;
  getConversationHistory: (userId: string) => Promise<Conversation[]>;
  getConversationState: (userId: string) => Promise<ConversationState>;
  updateConversationState: (userId: string, state: ConversationState) => Promise<void>;
}

export type Conversation = {
  userMessage: string;
  botResponse: string;
  stage: string;
  emotion: string;
  exchangeCount?: number;
  emotionFollowUps?: number;
  actionType?: string;
  resources?: string[];
};

export const createChatRepository = (): ChatRepository => {
  // In-memory storage for conversation history and state
  const conversationHistory: { [userId: string]: Conversation[] } = {};
  const conversationStates: { [userId: string]: ConversationState } = {};

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
        exchangeCount: conversation.exchangeCount,
        emotionFollowUps: conversation.emotionFollowUps,
        actionType: conversation.actionType,
        resources: conversation.resources,
      });
    },

    async getConversationHistory(userId: string): Promise<Conversation[]> {
      const history = conversationHistory[userId] || [];
      return history.map(conversation => ({
        userMessage: decrypt(conversation.userMessage),
        botResponse: decrypt(conversation.botResponse),
        stage: conversation.stage,
        emotion: conversation.emotion,
        exchangeCount: conversation.exchangeCount,
        emotionFollowUps: conversation.emotionFollowUps,
        actionType: conversation.actionType,
        resources: conversation.resources,
      }));
    },

    async getConversationState(userId: string): Promise<ConversationState> {
      if (!conversationStates[userId]) {
        conversationStates[userId] = createInitialConversationState();
      }
      return { ...conversationStates[userId] };
    },

    async updateConversationState(userId: string, state: ConversationState): Promise<void> {
      conversationStates[userId] = { ...state };
    },
  };
};


