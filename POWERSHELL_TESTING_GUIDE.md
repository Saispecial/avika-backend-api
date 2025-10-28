# PowerShell API Testing Guide - Avika Backend

Complete testing guide using PowerShell `curl` syntax for the Avika Backend API.

## 🚀 **Quick Start**

Your server should be running on `http://localhost:3000`. If not, start it with:
```powershell
.\start-server.bat
```

## 📝 **1. Basic Endpoints (No Auth Required)**

### **Root Endpoint**
```powershell
curl -Uri "http://localhost:3000/"
```

### **Health Check**
```powershell
curl -Uri "http://localhost:3000/health"
```

### **Diagnostic Endpoints**
```powershell
# Test endpoint
curl -Uri "http://localhost:3000/diagnostic/test"

# List all endpoints
curl -Uri "http://localhost:3000/diagnostic/endpoints"
```

## 💬 **2. Conversation API (No Auth Required)**

### **Start Conversation**
```powershell
curl -Uri "http://localhost:3000/api/conversation/start" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{}'
```

### **Test Emotion Detection**
```powershell
curl -Uri "http://localhost:3000/api/conversation/emotion" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"text": "I feel really anxious about everything"}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "message": "Gemini response with emotion processing"
  }
}
```

### **Test Safety Detection**
```powershell
curl -Uri "http://localhost:3000/api/conversation/engage" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{"text": "I want to hurt myself"}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "message": "I'm sorry to hear that. It's important to seek help. Here are some resources...",
    "geminiResponse": "..."
  }
}
```

### **Final Stage**
```powershell
curl -Uri "http://localhost:3000/api/conversation/final" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{}'
```

## 🔑 **3. Generate JWT Token**

```powershell
npm run generate:token
```

Copy the generated token for use in protected endpoints.

## 🛡️ **4. Protected Endpoints (JWT Required)**

### **Set JWT Token Variable**
```powershell
$jwtToken = "your-generated-jwt-token-here"
$authHeaders = @{ 
  "Authorization" = "Bearer $jwtToken"
  "Content-Type" = "application/json" 
}
```

### **Basic Chat API**
```powershell
curl -Uri "http://localhost:3000/api/v1/chat/message/test-user-123" `
  -Method POST `
  -Headers $authHeaders `
  -Body '{"message": "I feel really anxious lately"}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "message": "Hello! I'm here to listen and support you. How are you feeling today?",
    "stage": "greeting",
    "exchangeCount": 1,
    "emotion": "anxiety"
  }
}
```

### **Test Multiple Messages (Trigger Follow-ups)**
```powershell
# Message 1
curl -Uri "http://localhost:3000/api/v1/chat/message/test-user-123" `
  -Method POST `
  -Headers $authHeaders `
  -Body '{"message": "I feel really sad and hopeless"}'

# Message 2 (should trigger emotion follow-up)
curl -Uri "http://localhost:3000/api/v1/chat/message/test-user-123" `
  -Method POST `
  -Headers $authHeaders `
  -Body '{"message": "Work is overwhelming me completely"}'
```

### **Wellness API**
```powershell
# Analyze conversation
curl -Uri "http://localhost:3000/api/v1/wellness/analyze/test-user-123" `
  -Headers $authHeaders

# Get recommendations
curl -Uri "http://localhost:3000/api/v1/wellness/recommendations/test-user-123" `
  -Headers $authHeaders

# Safety check
curl -Uri "http://localhost:3000/api/v1/wellness/safety/test-user-123" `
  -Headers $authHeaders
```

## 🤖 **5. Gemini AI Integration**

### **Basic Gemini API**
```powershell
curl -Uri "http://localhost:3000/api/chat-gemini" `
  -Method POST `
  -Headers $authHeaders `
  -Body '{"message": "I feel overwhelmed with work stress", "sessionId": "test-session-123"}'
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

### **Advanced Gemini API (Full Features)**
```powershell
# Initial conversation
curl -Uri "http://localhost:3000/api/chat-gemini-advanced" `
  -Method POST `
  -Headers $authHeaders `
  -Body '{"message": "Hi, I have been feeling really anxious lately", "sessionId": "advanced-test-123"}'

# Follow-up message (should trigger emotion follow-up)
curl -Uri "http://localhost:3000/api/chat-gemini-advanced" `
  -Method POST `
  -Headers $authHeaders `
  -Body '{"message": "Work is just so overwhelming and I cannot sleep", "sessionId": "advanced-test-123"}'
```

### **Test Call-to-Action (Send 8+ Messages)**
```powershell
# Send multiple messages to trigger call-to-action after 8-10 exchanges
for ($i = 3; $i -le 10; $i++) {
  curl -Uri "http://localhost:3000/api/chat-gemini-advanced" `
    -Method POST `
    -Headers $authHeaders `
    -Body "{`"message`": `"Exchange $i - still feeling anxious`", `"sessionId`": `"advanced-test-123`"}"
}
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

## 🔄 **6. Wellness Unified API**

### **Analyze Session**
```powershell
curl -Uri "http://localhost:3000/api/wellness?action=analyze-session" `
  -Method POST `
  -Headers $authHeaders `
  -Body '{"conversationHistory": ["I feel anxious", "Work is stressing me out", "I cannot handle the pressure"]}'
```

### **Generate Recommendations**
```powershell
curl -Uri "http://localhost:3000/api/wellness?action=generate-recommendations" `
  -Method POST `
  -Headers $authHeaders `
  -Body '{}'
```

### **Safety Check**
```powershell
curl -Uri "http://localhost:3000/api/wellness?action=safety-check" `
  -Method POST `
  -Headers $authHeaders `
  -Body '{"message": "I feel like giving up on everything"}'
```

## 🧪 **7. Automated Testing Script**

Run the complete PowerShell testing script:
```powershell
.\test-api-powershell.ps1
```

## ✅ **Expected Results**

When all tests pass, you should see:
- ✅ All endpoints responding with 200 OK
- ✅ Emotion detection working (anxiety, sadness, anger, joy)
- ✅ Safety detection identifying risk levels
- ✅ JWT authentication enforced on protected routes
- ✅ Follow-up questions triggered for strong emotions
- ✅ Call-to-action activated after 8-10 exchanges
- ✅ Gemini AI providing contextual responses
- ✅ Crisis intervention for high-risk situations

## 🚨 **Troubleshooting**

### **401 Unauthorized**
```powershell
# Generate a new JWT token
npm run generate:token
# Copy the token and update $jwtToken variable
```

### **Server Not Running**
```powershell
# Start the server
.\start-server.bat
```

### **Port 3000 In Use**
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

## 🎯 **Key PowerShell Syntax**

| Feature | PowerShell Syntax |
|---------|-------------------|
| **GET Request** | `curl -Uri "url"` |
| **POST Request** | `curl -Uri "url" -Method POST` |
| **Headers** | `-Headers @{ "Key" = "Value" }` |
| **JSON Body** | `-Body '{"key": "value"}'` |
| **Auth Header** | `-Headers @{ "Authorization" = "Bearer $token" }` |

This guide provides all the PowerShell commands needed to test every feature of your Avika Backend API! 🚀