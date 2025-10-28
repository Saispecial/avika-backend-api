/**
 * Example conversation flows demonstrating the enhanced features:
 * - 2-4 emotion follow-ups
 * - Call to action after 8-10 exchanges
 * - Specific AI actions based on emotion
 */

import { 
  progressConversationAdvanced, 
  createInitialConversationState,
  generateEmotionFollowUp,
  generateCallToAction,
  ConversationState 
} from "../utils/flowManager.js";
import { classifyEmotion } from "../utils/emotionMap.js";
import { detectSelfHarmTerms } from "../utils/safetyCheck.js";

// Example conversation demonstrating anxiety follow-ups and call to action
export const exampleAnxietyConversation = () => {
  console.log("=== ANXIETY CONVERSATION FLOW EXAMPLE ===\n");
  
  let state = createInitialConversationState();
  const messages = [
    "Hi there",
    "I've been feeling really anxious lately",
    "It's about work and everything feels overwhelming",
    "I can't sleep and my heart races all the time",
    "I keep thinking about worst case scenarios",
    "I don't know how to make it stop",
    "It's affecting my relationships too",
    "I feel like I'm losing control",
    "Maybe I should get help but I'm scared",
    "What if therapy doesn't work?"
  ];

  messages.forEach((message, index) => {
    console.log(`--- Exchange ${index + 1} ---`);
    console.log(`User: "${message}"`);
    
    // Check safety first
    const safety = detectSelfHarmTerms(message);
    if (safety.selfHarmDetected) {
      console.log(`🚨 SAFETY ALERT: Risk Level ${safety.riskLevel}`);
      console.log(`Bot: I'm concerned about what you've shared. Please reach out for help immediately.`);
      return;
    }

    // Progress conversation
    state = progressConversationAdvanced(message, state);
    
    console.log(`Stage: ${state.stage}`);
    console.log(`Exchange Count: ${state.exchangeCount}`);
    console.log(`Emotion: ${state.dominantEmotion}`);
    console.log(`Follow-ups: ${state.emotionFollowUps}`);
    
    // Generate response
    let botResponse = "";
    
    if (state.stage === "emotion_followup") {
      botResponse = generateEmotionFollowUp(state.dominantEmotion, state.emotionFollowUps);
      console.log(`Bot (Follow-up): "${botResponse}"`);
    } else if (state.stage === "call_to_action" || state.stage === "ongoing_support") {
      const callToAction = generateCallToAction(state.dominantEmotion, state.exchangeCount, state.lastActionType);
      console.log(`Bot (${callToAction.actionType}): "${callToAction.message}"`);
      if (callToAction.resources) {
        console.log(`Resources:`);
        callToAction.resources.forEach(resource => console.log(`  - ${resource}`));
      }
      state.lastActionType = callToAction.actionType;
    } else {
      botResponse = getRegularResponse(state.stage);
      console.log(`Bot: "${botResponse}"`);
    }
    
    console.log("");
  });
};

// Example conversation demonstrating sadness follow-ups
export const exampleSadnessConversation = () => {
  console.log("=== SADNESS CONVERSATION FLOW EXAMPLE ===\n");
  
  let state = createInitialConversationState();
  const messages = [
    "Hello",
    "I've been feeling really down lately",
    "Everything just feels pointless",
    "I lost my job last month and I feel like a failure",
    "I don't have energy for anything anymore",
    "My friends don't understand what I'm going through",
    "I just want to stay in bed all day",
    "I feel so alone in this",
    "Maybe I should talk to someone professional",
    "But what if nothing helps?"
  ];

  messages.forEach((message, index) => {
    console.log(`--- Exchange ${index + 1} ---`);
    console.log(`User: "${message}"`);
    
    state = progressConversationAdvanced(message, state);
    
    console.log(`Stage: ${state.stage}, Emotion: ${state.dominantEmotion}, Count: ${state.exchangeCount}`);
    
    if (state.stage === "emotion_followup") {
      const followUp = generateEmotionFollowUp(state.dominantEmotion, state.emotionFollowUps);
      console.log(`Bot (Follow-up): "${followUp}"`);
    } else if (state.stage === "call_to_action") {
      const action = generateCallToAction(state.dominantEmotion, state.exchangeCount);
      console.log(`Bot (${action.actionType}): "${action.message}"`);
    }
    
    console.log("");
  });
};

// Helper function for regular responses
const getRegularResponse = (stage: string): string => {
  const responses = {
    greeting: "Hello! I'm here to listen and support you. How are you feeling today?",
    initial_question: "Thank you for sharing. What's been on your mind lately?",
    emotion_exploration: "I can hear that you're going through something. Tell me more.",
    deeper_understanding: "That sounds really difficult. How long have you been feeling this way?",
    supportive_response: "I'm here with you. Your feelings are valid."
  };
  
  return responses[stage as keyof typeof responses] || "I'm here to listen.";
};

// Demonstrate the conversation flows
if (import.meta.url === `file://${process.argv[1]}`) {
  exampleAnxietyConversation();
  console.log("\n" + "=".repeat(50) + "\n");
  exampleSadnessConversation();
}