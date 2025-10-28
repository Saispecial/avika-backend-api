/**
 * Enhanced emotion classification with comprehensive keyword mapping
 */
export const classifyEmotion = (text: string): string => {
  const lowerCaseText = text.toLowerCase();
  
  // Anxiety indicators
  const anxietyKeywords = [
    'anxious', 'worried', 'nervous', 'stressed', 'panic', 'overwhelmed', 
    'scared', 'afraid', 'fearful', 'tense', 'restless', 'uneasy',
    'can\'t sleep', 'racing thoughts', 'heart racing', 'sweating',
    'what if', 'catastrophic', 'doom', 'dread'
  ];
  
  // Sadness indicators
  const sadnessKeywords = [
    'sad', 'depressed', 'down', 'low', 'empty', 'hopeless', 'lonely',
    'isolated', 'worthless', 'defeated', 'broken', 'lost', 'numb',
    'crying', 'tears', 'grief', 'mourning', 'devastated', 'heartbroken',
    'can\'t get out of bed', 'no energy', 'pointless'
  ];
  
  // Anger indicators
  const angerKeywords = [
    'angry', 'mad', 'furious', 'rage', 'frustrated', 'irritated',
    'annoyed', 'pissed', 'livid', 'outraged', 'resentful', 'bitter',
    'hate', 'disgusted', 'fed up', 'can\'t stand', 'infuriating',
    'want to scream', 'boiling', 'explosive'
  ];
  
  // Joy/happiness indicators
  const joyKeywords = [
    'happy', 'joyful', 'excited', 'elated', 'cheerful', 'content',
    'pleased', 'delighted', 'thrilled', 'ecstatic', 'overjoyed',
    'grateful', 'blessed', 'amazing', 'wonderful', 'fantastic',
    'love', 'peaceful', 'calm', 'serene', 'optimistic'
  ];

  // Count matches for each emotion
  const emotionScores = {
    anxiety: anxietyKeywords.filter(keyword => lowerCaseText.includes(keyword)).length,
    sadness: sadnessKeywords.filter(keyword => lowerCaseText.includes(keyword)).length,
    anger: angerKeywords.filter(keyword => lowerCaseText.includes(keyword)).length,
    joy: joyKeywords.filter(keyword => lowerCaseText.includes(keyword)).length
  };

  // Find the emotion with the highest score
  const maxScore = Math.max(...Object.values(emotionScores));
  
  if (maxScore === 0) {
    return "neutral";
  }

  // Return the emotion with the highest score
  for (const [emotion, score] of Object.entries(emotionScores)) {
    if (score === maxScore) {
      return emotion;
    }
  }

  return "neutral";
};

/**
 * Maps user input to a specific emotional state.
 * @param userInput The user's input.
 * @returns The emotional state corresponding to the input.
 */
export const mapEmotion = (userInput: string): string => {
  const lowerCaseInput = userInput.toLowerCase();

  if (lowerCaseInput.includes("happy") || lowerCaseInput.includes("joyful")) {
    return "happy";
  } else if (lowerCaseInput.includes("sad") || lowerCaseInput.includes("depressed")) {
    return "sad";
  } else if (lowerCaseInput.includes("angry") || lowerCaseInput.includes("frustrated")) {
    return "angry";
  } else if (lowerCaseInput.includes("anxious") || lowerCaseInput.includes("worried")) {
    return "anxious";
  } else {
    return "neutral";
  }
};
