# 🧪 Complete API Testing Checklist

## 🚀 **Quick Start Testing**

### **1. Start the Server**
```bash
npm run dev:local
```

### **2. Quick Health Check**
```bash
npm run verify:quick
```

### **3. Generate Test JWT Token**
```bash
npm run generate:token
# Copy the generated token for use in protected endpoints
```

### **4. Full API Verification**
```bash
npm run verify:full
```

---

## ✅ **Feature Verification Checklist**

### **🏥 Health & Configuration**
- [ ] Server starts successfully on port 3000
- [ ] Health endpoint responds: `GET /health`
- [ ] Environment variables configured:
  - [ ] `GEMINI_API_KEY` set
  - [ ] `SUPABASE_URL` set  
  - [ ] `SUPABASE_SERVICE_KEY` set
  - [ ] `JWT_SECRET` set
  - [ ] `DB_ENCRYPTION_KEY` set

### **🔐 Authentication & Security**
- [ ] JWT authentication working on protected endpoints
- [ ] Unauthorized requests return 401
- [ ] CORS headers properly configured
- [ ] Helmet security headers applied
- [ ] Input validation with Zod schemas

### **💬 Conversation API (No Auth Required)**
- [ ] `POST /api/conversation/start` - Basic conversation initiation
- [ ] `POST /api/conversation/emotion` - Emotion detection working
- [ ] `POST /api/conversation/engage` - Safety detection middleware
- [ ] `POST /api/conversation/final` - Conversation completion

### **🧠 Advanced Chat API (JWT Required)**
- [ ] `POST /api/v1/chat/message/:userId` - Basic messaging
- [ ] Conversation state tracking across exchanges
- [ ] Emotion follow-ups triggered (2-4 questions)
- [ ] Call-to-action activated after 8-10 exchanges
- [ ] Progressive conversation flow working
- [ ] Encrypted message storage

### **🌱 Wellness API (JWT Required)**
- [ ] `GET /api/v1/wellness/analyze/:userId` - Conversation analysis
- [ ] `GET /api/v1/wellness/recommendations/:userId` - Recommendations
- [ ] `GET /api/v1/wellness/safety/:userId` - Safety assessment

### **🤖 Basic Gemini API (JWT Required)**
- [ ] `POST /api/chat-gemini` - Basic Gemini integration
- [ ] Real AI responses from Gemini API
- [ ] Enhanced emotion detection
- [ ] Three-tier safety detection (low/medium/high)
- [ ] Crisis intervention for high-risk messages
- [ ] Encrypted message storage in Supabase

### **🌟 Advanced Gemini API (JWT Required)**
- [ ] `POST /api/chat-gemini-advanced` - Full integration
- [ ] Context-aware Gemini prompts
- [ ] Intelligent response routing (AI vs structured)
- [ ] 2-4 emotion follow-ups with AI integration
- [ ] Call-to-action triggers after 8-10 exchanges
- [ ] Specific interventions based on emotion:
  - [ ] Self-help recommendations
  - [ ] Breathing exercises
  - [ ] Therapy referrals
  - [ ] Educational content
- [ ] Advanced conversation state tracking
- [ ] Crisis intervention overrides

### **🔄 Wellness Unified API (JWT Required)**
- [ ] `POST /api/wellness?action=analyze-session` - Session analysis
- [ ] `POST /api/wellness?action=generate-recommendations` - Random activities
- [ ] `POST /api/wellness?action=safety-check` - Safety assessment

---

## 🧪 **Detailed Testing Scenarios**

### **Scenario 1: Basic Conversation Flow**
```bash
# Test basic conversation without auth
curl -X POST http://localhost:3000/api/conversation/start
curl -X POST http://localhost:3000/api/conversation/emotion -d '{"text":"I feel sad"}'
curl -X POST http://localhost:3000/api/conversation/engage -d '{"text":"Everything is fine"}'
curl -X POST http://localhost:3000/api/conversation/final
```

**Expected Results:**
- ✅ All endpoints return 200 OK
- ✅ Emotion detection classifies "sad" correctly
- ✅ Safety detection processes normally for non-crisis text

### **Scenario 2: Crisis Detection**
```bash
# Test safety detection across endpoints
curl -X POST http://localhost:3000/api/conversation/engage -d '{"text":"I want to kill myself"}'
curl -X POST http://localhost:3000/api/chat-gemini -H "Authorization: Bearer $JWT_TOKEN" -d '{"message":"I want to end my life","sessionId":"test"}'
```

**Expected Results:**
- ✅ High-risk detection triggered
- ✅ Crisis intervention responses provided
- ✅ Emergency resources included in response

### **Scenario 3: Advanced Conversation with Follow-ups**
```bash
# Test emotion follow-ups (requires JWT)
export JWT_TOKEN="your-generated-token"

# Exchange 1
curl -X POST http://localhost:3000/api/chat-gemini-advanced \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{"message":"I feel really anxious","sessionId":"test-123"}'

# Exchange 2 (should trigger follow-up)
curl -X POST http://localhost:3000/api/chat-gemini-advanced \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{"message":"Work is overwhelming me","sessionId":"test-123"}'
```

**Expected Results:**
- ✅ First exchange: Regular AI response
- ✅ Second exchange: Emotion follow-up question triggered
- ✅ Response includes `"actionType": "followup"`

### **Scenario 4: Call-to-Action Trigger**
```bash
# Send 10 messages to trigger call-to-action
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/chat-gemini-advanced \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -d "{\"message\":\"Exchange $i - still anxious\",\"sessionId\":\"cta-test\"}"
done
```

**Expected Results:**
- ✅ Exchanges 1-7: Regular conversation
- ✅ Exchange 8+: Call-to-action triggered
- ✅ Specific interventions provided (self-help, breathing, therapy, content)
- ✅ Resources array included in response

### **Scenario 5: Authentication Testing**
```bash
# Test without token (should fail)
curl -X POST http://localhost:3000/api/v1/chat/message/test-user

# Test with invalid token (should fail)
curl -X POST http://localhost:3000/api/v1/chat/message/test-user \
  -H "Authorization: Bearer invalid-token"

# Test with valid token (should succeed)
curl -X POST http://localhost:3000/api/v1/chat/message/test-user \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{"message":"Hello"}'
```

**Expected Results:**
- ✅ No token: 401 Unauthorized
- ✅ Invalid token: 401 Unauthorized  
- ✅ Valid token: 200 OK with response

---

## 📊 **Performance & Load Testing**

### **Response Time Benchmarks**
- [ ] Health check: < 50ms
- [ ] Conversation API: < 200ms
- [ ] Chat API (no AI): < 300ms
- [ ] Gemini API: < 2000ms (depends on AI response time)
- [ ] Database operations: < 500ms

### **Concurrent Users**
```bash
# Test with multiple simultaneous requests
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/conversation/start &
done
wait
```

**Expected Results:**
- ✅ All requests complete successfully
- ✅ No memory leaks or crashes
- ✅ Response times remain reasonable

---

## 🔧 **Troubleshooting Guide**

### **Common Issues & Solutions**

#### **Server Won't Start**
```bash
# Check port availability
lsof -i :3000

# Check environment variables
cat .env

# Check dependencies
npm install
```

#### **401 Unauthorized Errors**
```bash
# Generate new JWT token
npm run generate:token

# Verify token format
echo $JWT_TOKEN | cut -d. -f2 | base64 -d
```

#### **Gemini API Errors**
```bash
# Check API key
echo $GEMINI_API_KEY

# Test API key directly
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=$GEMINI_API_KEY" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

#### **Database Connection Issues**
```bash
# Check Supabase configuration
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_KEY

# Test connection
curl -X GET "$SUPABASE_URL/rest/v1/" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY"
```

---

## 🎯 **Success Criteria**

### **All Tests Should Pass:**
- ✅ **100% endpoint availability** - All endpoints respond correctly
- ✅ **Authentication enforcement** - Protected routes require valid JWT
- ✅ **Feature functionality** - All advanced features working as expected
- ✅ **Error handling** - Graceful error responses for invalid inputs
- ✅ **Performance** - Response times within acceptable limits

### **Advanced Features Working:**
- ✅ **Emotion detection** - Correctly classifies user emotions
- ✅ **Safety detection** - Identifies and responds to crisis situations
- ✅ **Follow-up system** - Generates 2-4 targeted follow-up questions
- ✅ **Call-to-action** - Triggers appropriate interventions after 8-10 exchanges
- ✅ **AI integration** - Gemini provides natural, context-aware responses
- ✅ **Resource provision** - Appropriate resources based on emotional state

### **Production Readiness:**
- ✅ **Security** - JWT auth, encryption, input validation
- ✅ **Scalability** - Handles concurrent requests efficiently
- ✅ **Reliability** - Graceful error handling and fallbacks
- ✅ **Monitoring** - Health checks and detailed system status
- ✅ **Documentation** - Complete API documentation and examples

---

## 🚀 **Final Verification Command**

```bash
# Complete verification in one command
npm run test:api
```

This runs both quick verification and full API testing to ensure everything is working perfectly! 🌟

When all tests pass, your Avika backend is fully functional and ready for production deployment.