/**
 * Manages the conversational flow by progressing through different stages based on user input.
 * @param userInput The user's input.
 * @param currentStage The current stage of the conversation.
 * @returns The next stage of the conversation.
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


