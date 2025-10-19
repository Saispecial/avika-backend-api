import { supabase } from '@/db/client.js';
import { encrypt } from '@/utils/encryption.js';
import crypto from 'crypto';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

/**
 * Repository to handle encrypted message storage.
 */
export const createMessageRepository = () => {
  return {
    /**
     * Stores a new message in the database.
     * @param message The message to store.
     */
    async storeMessage(message: Omit<Message, 'id'>): Promise<Message> {
      try {
        const encryptedText = encrypt(message.text);

        // Prefer Supabase if configured
        if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
          // Generate proper UUIDs if the IDs are not valid UUIDs
          const sessionId = message.conversationId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) 
            ? message.conversationId 
            : crypto.randomUUID();
          
          const userId = message.senderId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) 
            ? message.senderId 
            : crypto.randomUUID();
          
          const { data, error } = await supabase
            .from('messages')
            .insert({
              session_id: sessionId,
              user_id: userId,
              role: 'user',
              encrypted_message: encryptedText,
              emotion_tag: null,
              risk_flag: null,
              created_at: message.timestamp.toISOString(),
            })
            .select()
            .single();

          if (error) throw error;

          return {
            id: data.id,
            conversationId: data.session_id,
            senderId: data.user_id,
            text: encryptedText,
            timestamp: new Date(data.created_at),
          };
        }

        // Fallback to simple return if Supabase is not configured
        return {
          id: 'temp-id',
          conversationId: message.conversationId,
          senderId: message.senderId,
          text: encryptedText,
          timestamp: message.timestamp,
        };
      } catch (error) {
        console.error('Failed to store message:', error);
        throw error;
      }
    },

    /**
     * Retrieves messages for a given conversation ID.
     * @param conversationId The ID of the conversation.
     */
    async getMessagesByConversationId(conversationId: string): Promise<Message[]> {
      try {
        // Prefer Supabase if configured
        if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
          const { data, error } = await supabase
            .from('messages')
            .select('id, session_id, user_id, encrypted_message, created_at')
            .eq('session_id', conversationId);

          if (error) throw error;

          return (data || []).map(row => ({
            id: row.id,
            conversationId: row.session_id,
            senderId: row.user_id,
            text: row.encrypted_message,
            timestamp: new Date(row.created_at),
          }));
        }

        // Fallback to empty array if Supabase is not configured
        return [];
      } catch (error) {
        console.error('Failed to get messages by conversation ID:', error);
        throw error;
      }
    },
  };
};

// Example usage:
const messageRepository = createMessageRepository();

// messageRepository.storeMessage({
//   conversationId: '123',
//   senderId: 'user1',
//   text: 'Hello!',
//   timestamp: new Date(),
// });

// messageRepository.getMessagesByConversationId('123');
