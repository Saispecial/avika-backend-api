# API Testing Guide - Complete Feature Verification

This guide provides comprehensive testing instructions for all API endpoints and features.

## 🚀 **Quick Start**

### **1. Start the Server**
```bash
npm run dev:local
# Server should start on http://localhost:3000
```

### **2. Get JWT Token** (Required for protected endpoints)
```bash
# For testing, you can use this sample JWT (replace with real token in production)
export JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItMTIzIiwiaWF0IjoxNjAwMDAwMDAwfQ.example"
```

---

## 📝 **1. Conversation API (No Auth Required)**

### **Start Conversation**
```bash
curl -X POST http://localhost:3000/api/conversation/start \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "message": "Gemini response to: Start conversation"
  }
}
```

### **Process Emotion**
```bash
curl -X POST http://localhost:3000/api/conversation/emotion \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I feel really anxious about everything"
  }'
```

**Expected Features:**
- ✅ Emotion detection (anxiety)
- ✅ Safety detection
- ✅ Zod validation

### **Engage with Safety Detection**
```bash
curl -X POST http://localhost:3000/api/conversation/engage \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I want to hurt myself"
  }'
```

**Expected Features:**
- ✅ Safety detection middleware
- ✅ Crisis intervention response

### **Final Stage**
```bash
curl -X POST http://localhost:3000/api/conversation/final \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## 💬 **2. Basic Chat API (JWT Required)**

### **Send Message**
```bash
curl -X POST http://localhost:3000/api/v1/chat/message/test-user-123 \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, I need someone to talk to"
  }'
```

**Expected Features:**
- ✅ JWT authentication
- ✅ Advanced conversation flow
- ✅ Encrypted storage
- ✅ State tracking

### **Test Emotion Follow-ups**
```bash
# Send multiple messages to trigger follow-ups
curl -X POST http://localhost:3000/api/v1/chat/message/test-user-123 \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I feel really sad and hopeless"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "message": "I hear that you're feeling sad. Can you tell me more about what's behind these feelings?",
    "stage": "emotion_followup",
    "exchangeCount": 2,
    "emotion": "sadness",
    "actionType": "followup"
  }
}
```

---

## 🌱 **3. Wellness API (JWT Required)**

### **Analyze Conversation**
```bash
curl -X GET http://localhost:3000/api/v1/wellness/analyze/test-user-123 \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### **Get Recommendations**
```bash
curl -X GET http://localhost:3000/api/v1/wellness/recommendations/test-user-123 \
  -H "Authorization: Bearer $JWT_TOKEN"
```

### **Safety Check**
```bash
curl -X GET http://localhost:3000/api/v1/wellness/safety/test-user-123 \
  -H "Authorization: Bearer $JWT_TOKEN"
```

---

## 🤖 **4. Basic Gemini API (JWT Required)**

### **Send Message to Gemini**
```bash
curl -X POST http://localhost:3000/api/chat-gemini \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I feel overwhelmed with work stress",
    "sessionId": "test-session-123",
    "conversationHistory": ["Hello", "Hi there!"]
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "response": "I understand you're feeling overwhelmed...",
    "emotion": "anxiety",
    "riskLevel": "medium",
    "recommendations": [
      "📞 Consider calling 988 for support and guidance",
      "🧘 Try a grounding exercise: 5 things you see, 4 you hear, 3 you feel"
    ]
  }
}
```

### **Test Crisis Detection**
```bash
curl -X POST http://localhost:3000/api/chat-gemini \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I want to end my life",
    "sessionId": "test-session-123"
  }'
```

**Expected Features:**
- ✅ High-risk detection
- ✅ Crisis resources
- ✅ Safety intervention

---

## 🌟 **5. Advanced Gemini API (JWT Required) - RECOMMENDED**

### **Initial Conversation**
```bash
curl -X POST http://localhost:3000/api/chat-gemini-advanced \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hi, I'\''ve been feeling really anxious lately",
    "sessionId": "advanced-test-123",
    "conversationHistory": []
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "response": "I can hear the anxiety in your words, and I want you to know that what you're feeling is completely valid...",
    "emotion": "anxiety",
    "riskLevel": "medium",
    "stage": "emotion_exploration",
    "exchangeCount": 1,
    "actionType": "regular",
    "recommendations": [...]
  }
}
```

### **Test Emotion Follow-ups**
```bash
curl -X POST http://localhost:3000/api/chat-gemini-advanced \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Work is just so overwhelming and I can'\''t sleep",
    "sessionId": "advanced-test-123"
  }'
```

**Expected Features:**
- ✅ Emotion follow-ups triggered
- ✅ Advanced conversation flow
- ✅ Context-aware Gemini responses

### **Test Call-to-Action (Exchange 8-10)**
```bash
# Send 8 more messages to trigger call-to-action
for i in {3..10}; do
  curl -X POST http://localhost:3000/api/chat-gemini-advanced \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"message\": \"This is exchange $i, I'm still feeling anxious\",
      \"sessionId\": \"advanced-test-123\"
    }"
  echo ""
done
```

**Expected at Exchange 8+:**
```json
{
  "success": true,
  "data": {
    "response": "I'd like to share some self-help techniques that many people find helpful for anxiety. Would you like to try a quick grounding exercise?",
    "stage": "call_to_action",
    "exchangeCount": 8,
    "actionType": "selfHelp",
    "resources": [
      "5-4-3-2-1 Grounding Technique: Name 5 things you see...",
      "Progressive muscle relaxation: Tense and release each muscle group"
    ]
  }
}
```

---

## 🔄 **6. Wellness Unified API (JWT Required)**

### **Analyze Session**
```bash
curl -X POST http://localhost:3000/api/wellness?action=analyze-session \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationHistory": [
      "I feel anxious",
      "Work is stressing me out", 
      "I can'\''t handle the pressure"
    ]
  }'
```

### **Generate Recommendations**
```bash
curl -X POST http://localhost:3000/api/wellness?action=generate-recommendations \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### **Safety Check**
```bash
curl -X POST http://localhost:3000/api/wellness?action=safety-check \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I feel like giving up on everything"
  }'
```

---

## 🧪 **7. Automated Testing**

### **Run Test Suite**
```bash
# Install tsx for TypeScript execution
npm install -g tsx

# Run comprehensive API tests
tsx src/tests/apiVerification.ts
```

### **Run Example Conversation Flow**
```bash
npm run example:conversation
```

---

## ✅ **Feature Verification Checklist**

### **Core Features:**
- [ ] **JWT Authentication** - Protected endpoints require valid token
- [ ] **Emotion Detection** - Classifies user emotions (anxiety, sadness, anger, joy)
- [ ] **Safety Detection** - Three-tier risk assessment (low/medium/high)
- [ ] **Encrypted Storage** - Messages stored with AES-256-CBC encryption
- [ ] **Conversation State** - Tracks exchange count, emotion history, stage

### **Advanced Features:**
- [ ] **2-4 Emotion Follow-ups** - Targeted questions based on detected emotion
- [ ] **Call to Action (8-10 exchanges)** - Triggers specific interventions
- [ ] **Progressive Conversation Flow** - Natural stage progression
- [ ] **Context-Aware AI** - Gemini receives rich conversation context
- [ ] **Crisis Intervention** - Immediate safety responses for high-risk

### **AI Integration:**
- [ ] **Gemini API Integration** - Real AI responses with API key
- [ ] **Enhanced Prompting** - Context-aware prompts with emotion/stage
- [ ] **Intelligent Routing** - AI vs structured responses based on stage
- [ ] **Fallback Responses** - Graceful degradation when AI unavailable

### **Resource Provision:**
- [ ] **Self-Help Resources** - Grounding exercises, relaxation techniques
- [ ] **Breathing Exercises** - 4-7-8 breathing, box breathing, heart coherence
- [ ] **Therapy Referrals** - Professional consultation recommendations
- [ ] **Educational Content** - Books, apps, podcasts for mental health

---

## 🎯 **Success Criteria**

### **All Endpoints Should:**
1. **Return 200 OK** for valid requests
2. **Require JWT** for protected endpoints (401 without token)
3. **Validate Input** with Zod schemas (400 for invalid data)
4. **Handle Errors** gracefully with proper error messages
5. **Provide Consistent** response format

### **Advanced Features Should:**
1. **Track State** across multiple exchanges
2. **Trigger Follow-ups** when strong emotions detected
3. **Activate Call-to-Action** after 8-10 exchanges
4. **Provide Resources** appropriate to emotional state
5. **Intervene Immediately** for crisis situations

### **AI Integration Should:**
1. **Generate Natural** responses using Gemini
2. **Include Context** about emotion, stage, and history
3. **Fallback Gracefully** when API unavailable
4. **Route Intelligently** between AI and structured responses

---

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **401 Unauthorized**
- Check JWT token is valid and properly formatted
- Ensure `Authorization: Bearer <token>` header is included

#### **500 Internal Server Error**
- Check server logs for detailed error messages
- Verify environment variables are set correctly
- Ensure Supabase connection is working

#### **Gemini API Errors**
- Verify `GEMINI_API_KEY` is set in `.env`
- Check API key has proper permissions
- Monitor API rate limits and quotas

#### **Database Connection Issues**
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`
- Check network connectivity to Supabase
- Ensure database schema is properly set up

---

## 🎉 **Expected Results**

When all tests pass, you should see:
- ✅ **All endpoints responding** with proper status codes
- ✅ **Authentication working** for protected routes
- ✅ **Emotion detection** classifying user input correctly
- ✅ **Safety detection** identifying risk levels appropriately
- ✅ **Follow-up questions** triggered for strong emotions
- ✅ **Call-to-action** activated after sufficient exchanges
- ✅ **Gemini integration** providing natural AI responses
- ✅ **Crisis intervention** working for high-risk situations
- ✅ **Resource provision** appropriate to user's emotional state

This comprehensive testing ensures your Avika backend is fully functional and ready for production use! 🌟