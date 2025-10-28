/**
 * Enhanced safety detection with comprehensive self-harm and crisis indicators
 */
export const detectSelfHarmTerms = (text: string): { selfHarmDetected: boolean; terms: string[]; riskLevel: 'low' | 'medium' | 'high' } => {
  const lowerCaseText = text.toLowerCase();

  // High-risk terms (immediate intervention needed)
  const highRiskTerms = [
    "i want to die",
    "i want to kill myself",
    "i'm going to kill myself",
    "want to hurt myself",
    "want to harm myself",
    "going to hurt myself",
    "suicide",
    "end my life",
    "better off dead",
    "no point in living",
    "planning to die",
    "goodbye forever",
    "this is my last",
    "can't go on",
    "ready to die",
    "taking my own life",
    "hurt myself",
    "harm myself"
  ];

  // Medium-risk terms (concerning but not immediate)
  const mediumRiskTerms = [
    "self-harm",
    "cutting",
    "self-injury",
    "hate myself",
    "worthless",
    "burden to everyone",
    "everyone would be better without me",
    "can't take it anymore",
    "nothing matters",
    "give up",
    "hopeless",
    "no way out",
    "thoughts of hurting",
    "thoughts of harming"
  ];

  // Low-risk terms (monitor but supportive response)
  const lowRiskTerms = [
    "feeling down",
    "really sad",
    "don't want to be here",
    "tired of everything",
    "what's the point",
    "feeling empty",
    "lost",
    "alone",
    "nobody cares",
    "can't handle this"
  ];

  const foundTerms: string[] = [];
  let riskLevel: 'low' | 'medium' | 'high' = 'low';

  // Check for high-risk terms
  for (const term of highRiskTerms) {
    if (lowerCaseText.includes(term)) {
      foundTerms.push(term);
      riskLevel = 'high';
    }
  }

  // Check for medium-risk terms (only if no high-risk found)
  if (riskLevel !== 'high') {
    for (const term of mediumRiskTerms) {
      if (lowerCaseText.includes(term)) {
        foundTerms.push(term);
        riskLevel = 'medium';
      }
    }
  }

  // Check for low-risk terms (only if no higher risk found)
  if (riskLevel === 'low') {
    for (const term of lowRiskTerms) {
      if (lowerCaseText.includes(term)) {
        foundTerms.push(term);
        // riskLevel remains 'low'
      }
    }
  }

  return {
    selfHarmDetected: foundTerms.length > 0,
    terms: foundTerms,
    riskLevel: foundTerms.length > 0 ? riskLevel : 'low'
  };
};

/**
 * Generates appropriate safety response based on risk level
 */
export const generateSafetyResponse = (riskLevel: 'low' | 'medium' | 'high'): string => {
  switch (riskLevel) {
    case 'high':
      return "I'm very concerned about what you've shared. Please reach out for immediate help - call 988 (Suicide & Crisis Lifeline) or go to your nearest emergency room. You don't have to face this alone.";

    case 'medium':
      return "I can hear that you're really struggling right now. These feelings are serious, and I want you to know that help is available. Have you considered talking to a counselor or calling a support line?";

    case 'low':
      return "It sounds like you're going through a difficult time. Your feelings are valid, and it's okay to not be okay. Would you like to talk about what's been weighing on you?";

    default:
      return "I'm here to listen and support you. What's on your mind?";
  }
};
