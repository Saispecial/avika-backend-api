/**
 * Utility function to detect self-harm terms in user input.
 */
export const detectSelfHarmTerms = (text: string): { selfHarmDetected: boolean; terms: string[] } => {
  const selfHarmTerms = [
    "I want to die",
    "I want to kill myself",
    "suicide",
    "end my life",
    "self-harm",
    "cutting",
  ]; // Expand this list

  const lowerCaseText = text.toLowerCase();
  const foundTerms: string[] = [];

  for (const term of selfHarmTerms) {
    if (lowerCaseText.includes(term.toLowerCase())) {
      foundTerms.push(term);
    }
  }

  return {
    selfHarmDetected: foundTerms.length > 0,
    terms: foundTerms,
  };
};
