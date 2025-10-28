# Advanced Conversation Features

This document describes the enhanced conversation features implemented in the Avika Backend API.

## 🎯 **Key Features Implemented**

### 1. **2-4 Emotion Follow-ups**
The system now automatically generates 2-4 follow-up questions when strong emotions are detected:

```typescript
// Example: User expresses anxiety
User: "I'm feeling really anxious about work"
Bot: "I can sense you're feeling anxious. What specifically is making you feel this way?" // Follow-up 1

User: "My boss is really demanding and I can't keep up"
Bot: "When did you first notice these anxious feelings starting?" // Follow-up 2

User: "It started about a month ago when the workload increased"
Bot: "How does this anxiety show up in your body? Do you feel it physically?" // Follow-up 3
```

### 2. **Call to Action After 8-10 Exchanges**
After 8-10 message exchanges, the system triggers specific AI actions based on the user's dominant emotion:

#### **Anxiety Actions:**
- **Self Help**: Grounding exercises, progressive muscle relaxation
- **Breathing**: 4-7-8 breathing technique, box breathing
- **Therapy**: Free 15-minute consultation recommendations
- **Content**: CBT resources, mindfulness apps, books

#### **Sadness Actions:**
- **Self Help**: Gentle movement, creative expression, connection
- **Breathing**: Heart coherence breathing, loving-kindness breathing
- **Therapy**: Depression specialists, support groups
- **Content**: Mood tracking apps, uplifting books, podcasts

#### **Anger Actions:**
- **Self Help**: Physical release, journaling, time-out techniques
- **Breathing**: Cooling breath, count-down breathing
- **Therapy**: Anger management specialists, conflict resolution
- **Content**: Assertiveness training, boundary setting resources

### 3. **Enhanced Safety Detection**
Three-tier risk assessment system:

- **High Risk**: Immediate intervention (suicide ideation, self-harm plans)
- **Medium Risk**: Concerning language (self-harm thoughts, hopelessness)
- **Low Risk**: General distress (feeling down, overwhelmed)

## 🔧 **Technical Implementation**

### **Conversation State Tracking**
```typescript
interface ConversationState {
  stage: string;                    // Current conversation stage
  exchangeCount: number;            // Total message exchanges
  emotionFollowUps: number;         // Number of emotion follow-ups done
  dominantEmotion: string;          // Most frequent recent emotion
  emotionHistory: string[];         // History of detected emotions
  callToActionTriggered: boolean;   // Whether CTA has been triggered
  lastActionType?: string;          // Last action type to avoid repetition
}
```

### **Advanced Flow Management**
```typescript
// Enhanced conversation progression
const newState = progressConversationAdvanced(userInput, currentState);

// Generates appropriate responses based on stage
if (newState.stage === "emotion_followup") {
  response = generateEmotionFollowUp(emotion, followUpCount);
} else if (newState.stage === "call_to_action") {
  response = generateCallToAction(emotion, exchangeCount);
}
```

### **Emotion Classification**
Enhanced keyword-based emotion detection with scoring:

```typescript
// Comprehensive emotion mapping
const emotionScores = {
  anxiety: anxietyKeywords.filter(keyword => text.includes(keyword)).length,
  sadness: sadnessKeywords.filter(keyword => text.includes(keyword)).length,
  anger: angerKeywords.filter(keyword => text.includes(keyword)).length,
  joy: joyKeywords.filter(keyword => text.includes(keyword)).length
};
```

## 📊 **Conversation Flow Examples**

### **Typical Anxiety Flow:**
1. **Greeting** → "Hello! How are you feeling today?"
2. **Initial Question** → "What's been on your mind lately?"
3. **Emotion Detection** → Anxiety detected
4. **Follow-up 1** → "What specifically is making you feel anxious?"
5. **Follow-up 2** → "When did these feelings start?"
6. **Follow-up 3** → "How does this show up physically?"
7. **Deeper Understanding** → Validation and exploration
8. **Call to Action** → "Let's try a 4-7-8 breathing technique..."
9. **Ongoing Support** → Resources and continued guidance

### **Safety Intervention Flow:**
```typescript
// High-risk detection triggers immediate intervention
if (safetyResult.riskLevel === "high") {
  return {
    message: "I'm very concerned. Please call 988 immediately.",
    resources: ["🚨 National Suicide Prevention Lifeline: 988", ...]
  };
}
```

## 🎯 **API Response Format**

Enhanced responses now include:

```json
{
  "success": true,
  "data": {
    "message": "I can sense you're feeling anxious...",
    "stage": "emotion_followup",
    "exchangeCount": 3,
    "emotion": "anxiety",
    "actionType": "followup",
    "resources": [
      "5-4-3-2-1 Grounding Technique",
      "Progressive muscle relaxation",
      "Anxiety journal techniques"
    ]
  }
}
```

## 🚀 **Usage Examples**

### **Testing the Enhanced Features:**

```bash
# Run conversation flow examples
npm run example:conversation

# Start the enhanced chat system
npm run dev:local

# Test with curl
curl -X POST http://localhost:3000/api/v1/chat/message/user123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "I feel really anxious about everything"}'
```

### **Expected Behavior:**
1. **Exchanges 1-7**: Regular conversation with 2-4 emotion follow-ups
2. **Exchanges 8-10**: Call to action triggers with specific recommendations
3. **Ongoing**: Continued support with varied action types

## 🔒 **Safety Features**

- **Immediate Crisis Detection**: High-risk terms trigger instant safety responses
- **Resource Provision**: Comprehensive crisis hotlines and resources
- **Risk Level Tracking**: Three-tier assessment system
- **Professional Referrals**: Therapy and counseling recommendations

## 📈 **Benefits**

1. **Deeper Emotional Exploration**: 2-4 targeted follow-ups help users process feelings
2. **Actionable Support**: Specific interventions based on emotional state
3. **Progressive Engagement**: Natural conversation flow with timely interventions
4. **Safety First**: Comprehensive crisis detection and response
5. **Resource Rich**: Extensive self-help and professional resources

This implementation transforms the basic chatbot into a sophisticated emotional support system that provides personalized, progressive, and safe mental health assistance.