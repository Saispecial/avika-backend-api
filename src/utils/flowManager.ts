import { classifyEmotion } from "./emotionMap.js";

export interface ConversationState {
  stage: string;
  exchangeCount: number;
  emotionFollowUps: number;
  dominantEmotion: string;
  emotionHistory: string[];
  callToActionTriggered: boolean;
  lastActionType?: string;
}

export interface ConversationResponse {
  message: string;
  actionType?: 'selfHelp' | 'breathing' | 'therapy' | 'content' | 'followup' | 'regular' | 'safety';
  resources?: string[];
}

/**
 * Basic conversation flow (legacy support)
 */
export const progressConversation = (userInput: string, currentStage: string): string => {
  switch (currentStage) {
    case "greeting":
      return "initial_question";
    case "initial_question":
      if (userInput.toLowerCase().includes("yes")) {
        return "elaboration";
      } else {
        return "farewell";
      }
    case "elaboration":
      return "emotion_assessment";
    case "emotion_assessment":
      return "recommendation";
    case "recommendation":
      return "farewell";
    default:
      return "greeting";
  }
};

/**
 * Advanced conversation flow with emotion follow-ups and call-to-action triggers
 */
export const progressConversationAdvanced = (
  userInput: string, 
  currentState: ConversationState
): ConversationState => {
  const newState = { ...currentState };
  newState.exchangeCount += 1;
  
  // Track emotions
  const currentEmotion = classifyEmotion(userInput);
  newState.emotionHistory.push(currentEmotion);
  
  // Determine dominant emotion (most frequent in recent history)
  newState.dominantEmotion = getMostFrequentEmotion(newState.emotionHistory.slice(-5));
  
  // Check if we should do emotion follow-ups (2-4 follow-ups)
  if (shouldFollowUpOnEmotion(currentEmotion, currentState) && currentState.emotionFollowUps < 4) {
    newState.emotionFollowUps += 1;
    newState.stage = "emotion_followup";
    return newState;
  }
  
  // Trigger Call to Action after 8-10 exchanges
  if (newState.exchangeCount >= 8 && !newState.callToActionTriggered) {
    newState.stage = "call_to_action";
    newState.callToActionTriggered = true;
    return newState;
  }
  
  // Continue with call to actions if user is engaged
  if (newState.callToActionTriggered && newState.exchangeCount > 8) {
    newState.stage = "ongoing_support";
    return newState;
  }
  
  // Regular flow progression
  switch (currentState.stage) {
    case "greeting":
      return { ...newState, stage: "initial_question" };
    case "initial_question":
      return { ...newState, stage: "emotion_exploration" };
    case "emotion_exploration":
      return { ...newState, stage: "deeper_understanding" };
    case "emotion_followup":
      return { ...newState, stage: "emotion_exploration" };
    case "deeper_understanding":
      return { ...newState, stage: "supportive_response" };
    default:
      return { ...newState, stage: "supportive_response" };
  }
};

/**
 * Determines if we should follow up on the detected emotion
 */
const shouldFollowUpOnEmotion = (emotion: string, currentState: ConversationState): boolean => {
  // Follow up on strong emotions that need exploration
  const strongEmotions = ['sadness', 'anger', 'anxiety', 'joy'];
  
  // Don't follow up if we're already in follow-up mode or if emotion is neutral
  if (currentState.stage === "emotion_followup" || emotion === "neutral") {
    return false;
  }
  
  // Follow up if it's a strong emotion and we haven't done too many follow-ups
  return strongEmotions.includes(emotion) && currentState.emotionFollowUps < 2;
};

/**
 * Gets the most frequent emotion from recent history
 */
const getMostFrequentEmotion = (emotions: string[]): string => {
  if (emotions.length === 0) return "neutral";
  
  const frequency: { [key: string]: number } = {};
  emotions.forEach(emotion => {
    frequency[emotion] = (frequency[emotion] || 0) + 1;
  });
  
  return Object.keys(frequency).reduce((a, b) => 
    frequency[a] > frequency[b] ? a : b
  );
};

/**
 * Generates emotion-specific follow-up questions (2-4 follow-ups)
 */
export const generateEmotionFollowUp = (emotion: string, followUpCount: number): string => {
  const followUps = {
    anxiety: [
      "I can sense you're feeling anxious. What specifically is making you feel this way?",
      "When did you first notice these anxious feelings starting?",
      "How does this anxiety show up in your body? Do you feel it physically?",
      "What usually helps you when you're feeling anxious like this?"
    ],
    sadness: [
      "I hear that you're feeling sad. Can you tell me more about what's behind these feelings?",
      "How long have you been carrying this sadness?",
      "What does this sadness feel like for you right now?",
      "Is there something specific that triggered these sad feelings?"
    ],
    anger: [
      "I can feel your frustration. What's really bothering you?",
      "When you feel angry like this, what goes through your mind?",
      "What would help you feel heard right now?",
      "How do you usually handle these intense feelings?"
    ],
    joy: [
      "I'm glad to hear you're feeling positive! What's bringing you joy today?",
      "How does this happiness feel in your body?",
      "What's been contributing to these good feelings?",
      "How can we help you maintain this positive energy?"
    ]
  };
  
  const emotionFollowUps = followUps[emotion as keyof typeof followUps] || [
    "Tell me more about how you're feeling.",
    "What's going through your mind right now?",
    "How are you experiencing this emotion?",
    "What would be most helpful for you in this moment?"
  ];
  
  return emotionFollowUps[Math.min(followUpCount - 1, emotionFollowUps.length - 1)];
};

/**
 * Generates call-to-action responses based on dominant emotion and exchange count
 */
export const generateCallToAction = (dominantEmotion: string, exchangeCount: number, lastActionType?: string): ConversationResponse => {
  const actions = {
    anxiety: {
      selfHelp: {
        message: "I'd like to share some self-help techniques that many people find helpful for anxiety. Would you like to try a quick grounding exercise?",
        resources: [
          "5-4-3-2-1 Grounding Technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste",
          "Progressive muscle relaxation: Tense and release each muscle group",
          "Anxiety journal: Write down your worries for 10 minutes daily"
        ]
      },
      breathing: {
        message: "Let's try a 4-7-8 breathing technique together. It can help calm your nervous system. Breathe in for 4, hold for 7, exhale for 8. Ready to try it?",
        resources: [
          "4-7-8 Breathing: Inhale 4 seconds, hold 7 seconds, exhale 8 seconds",
          "Box breathing: 4 seconds in, 4 hold, 4 out, 4 hold",
          "Belly breathing: Focus on expanding your diaphragm, not your chest"
        ]
      },
      therapy: {
        message: "Based on our conversation, talking to a professional might be really beneficial. I can help you find a therapist for a free 15-minute consultation. Would that interest you?",
        resources: [
          "BetterHelp: Online therapy platform with licensed therapists",
          "Psychology Today: Find local therapists in your area",
          "Crisis Text Line: Text HOME to 741741 for immediate support"
        ]
      },
      content: {
        message: "I have some great resources about managing anxiety that might resonate with you. Would you like me to share some evidence-based techniques?",
        resources: [
          "Cognitive Behavioral Therapy (CBT) techniques for anxiety",
          "Mindfulness meditation apps: Headspace, Calm, Insight Timer",
          "Books: 'The Anxiety and Worry Workbook' by David Clark"
        ]
      }
    },
    sadness: {
      selfHelp: {
        message: "There are some gentle self-care practices that might help lift your spirits. Would you like to explore some nurturing activities?",
        resources: [
          "Gentle movement: Take a 10-minute walk in nature",
          "Creative expression: Draw, write, or listen to music that moves you",
          "Connection: Reach out to someone who cares about you"
        ]
      },
      breathing: {
        message: "Sometimes when we're feeling low, a mindful breathing exercise can create a small shift. Want to try a heart-centered breathing practice together?",
        resources: [
          "Heart coherence breathing: 5 seconds in, 5 seconds out while focusing on your heart",
          "Loving-kindness breathing: Send yourself compassion with each breath",
          "Soothing breath: Longer exhales (6-8 seconds) to activate relaxation"
        ]
      },
      therapy: {
        message: "It sounds like you're going through a tough time. A 15-minute free consultation with a therapist might provide some clarity and support. What do you think?",
        resources: [
          "Find a therapist specializing in depression and mood disorders",
          "Support groups: NAMI (National Alliance on Mental Illness)",
          "Crisis support: National Suicide Prevention Lifeline 988"
        ]
      },
      content: {
        message: "I have some uplifting content about working through difficult emotions that might be helpful right now. Would you like some resources for emotional healing?",
        resources: [
          "Books: 'Feeling Good' by David Burns, 'The Gifts of Imperfection' by Brené Brown",
          "Podcasts: 'The Happiness Lab', 'Ten Percent Happier'",
          "Apps: Sanvello, MindShift for mood tracking and support"
        ]
      }
    },
    anger: {
      selfHelp: {
        message: "When we're feeling frustrated, there are healthy ways to channel that energy. Want to explore some techniques for processing anger constructively?",
        resources: [
          "Physical release: Go for a run, punch a pillow, or do jumping jacks",
          "Journaling: Write out your feelings without censoring yourself",
          "Time-out technique: Step away for 20 minutes before responding"
        ]
      },
      breathing: {
        message: "Let's try a cooling breath exercise to help release some of that tension and bring you back to center. Are you open to trying it?",
        resources: [
          "Cooling breath: Inhale through pursed lips, exhale through nose",
          "Count-down breathing: Breathe in for 10, out for 10, reducing by 1 each round",
          "Anger release breath: Sharp exhale through mouth to release tension"
        ]
      },
      therapy: {
        message: "Sometimes talking through anger with a professional can be really clarifying and help you develop healthy coping strategies. Would you consider a free 15-minute session?",
        resources: [
          "Anger management specialists and therapists",
          "Conflict resolution counselors",
          "Support groups for anger management"
        ]
      },
      content: {
        message: "I have some resources about healthy anger management and emotional regulation that might be useful. Interested in learning some new strategies?",
        resources: [
          "Books: 'The Dance of Anger' by Harriet Lerner",
          "Techniques: Assertiveness training, boundary setting",
          "Apps: Anger management tools and mood trackers"
        ]
      }
    }
  };
  
  // Cycle through different action types to avoid repetition
  const actionTypes: Array<'selfHelp' | 'breathing' | 'therapy' | 'content'> = ['selfHelp', 'breathing', 'therapy', 'content'];
  let actionType: 'selfHelp' | 'breathing' | 'therapy' | 'content';
  
  // Avoid repeating the same action type
  if (lastActionType) {
    const availableTypes = actionTypes.filter(type => type !== lastActionType);
    actionType = availableTypes[exchangeCount % availableTypes.length];
  } else {
    actionType = actionTypes[exchangeCount % actionTypes.length];
  }
  
  const emotionActions = actions[dominantEmotion as keyof typeof actions] || actions.anxiety;
  const selectedAction = emotionActions[actionType];
  
  return {
    message: selectedAction.message,
    actionType,
    resources: selectedAction.resources
  };
};

/**
 * Creates initial conversation state
 */
export const createInitialConversationState = (): ConversationState => {
  return {
    stage: "greeting",
    exchangeCount: 0,
    emotionFollowUps: 0,
    dominantEmotion: "neutral",
    emotionHistory: [],
    callToActionTriggered: false
  };
};


