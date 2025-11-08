# 🌐 Frontend Integration Guide for Avika Backend API

## 📋 **What You Need to Connect Your Web App**

### **1. Backend URL**
After deploying to Render, your backend will be available at:
```
https://avika-backend-api.onrender.com
```
(Replace with your actual Render URL)

### **2. Authentication Required**
All chat endpoints require JWT authentication via Bearer token.

---

## 🔑 **Authentication Setup**

### **Step 1: Generate JWT Token**

Your backend uses JWT tokens. You have two options:

#### **Option A: Use the Token Generator Script**
```bash
cd avika-backend-api-main
npm run generate:token
```

#### **Option B: Generate Token Programmatically**
```typescript
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { 
    userId: 'user123',
    sessionId: 'session456'
  },
  process.env.JWT_SECRET || 'your-secret-key',
  { expiresIn: '24h' }
);
```

### **Step 2: Include Token in Requests**
```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## 🎯 **Available API Endpoints**

### **1. Advanced Gemini Chat (RECOMMENDED)**
**Endpoint**: `POST /api/chat-gemini-advanced`

**Features**:
- ✅ Emotion detection
- ✅ Safety monitoring
- ✅ Conversation flow management
- ✅ Follow-up questions (2-4 per emotion)
- ✅ Call-to-action triggers (after 8-10 exchanges)
- ✅ Crisis intervention

**Request Format**:
```typescript
{
  "message": "I'm feeling really anxious today",
  "sessionId": "unique-session-id",
  "conversationHistory": ["previous message 1", "previous message 2"] // optional
}
```

**Response Format**:
```typescript
{
  "success": true,
  "data": {
    "response": "I can sense you're feeling anxious. What specifically is making you feel this way?",
    "emotion": "anxiety",
    "riskLevel": "low",
    "stage": "emotion_followup",
    "exchangeCount": 3,
    "actionType": "followup",
    "recommendations": [
      "🧘 Try a 5-minute mindfulness or breathing exercise",
      "🚶 Take a gentle walk outside if possible",
      "📝 Write down one small, achievable goal for today"
    ]
  },
  "error": null
}
```

### **2. Basic Gemini Chat**
**Endpoint**: `POST /api/chat-gemini`

**Request Format**:
```typescript
{
  "message": "Hello, I need someone to talk to",
  "sessionId": "unique-session-id"
}
```

**Response Format**:
```typescript
{
  "success": true,
  "data": {
    "response": "Hello! I'm here to listen and support you. How are you feeling today?",
    "emotion": "neutral",
    "riskLevel": "low"
  },
  "error": null
}
```

### **3. Health Check (No Auth Required)**
**Endpoint**: `GET /health`

**Response**:
```typescript
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-01-10T12:00:00.000Z",
    "uptime": 3600,
    "version": "1.0.0"
  }
}
```

---

## 💻 **Frontend Integration Code Examples**

### **React/Next.js Integration**

#### **1. Create API Service**
```typescript
// lib/avika-api.ts

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
const JWT_TOKEN = process.env.NEXT_PUBLIC_JWT_TOKEN || 'your-jwt-token';

export interface ChatMessage {
  message: string;
  sessionId: string;
  conversationHistory?: string[];
}

export interface ChatResponse {
  success: boolean;
  data: {
    response: string;
    emotion: string;
    riskLevel: 'low' | 'medium' | 'high';
    stage: string;
    exchangeCount: number;
    actionType: string;
    recommendations: string[];
  };
  error: any;
}

export class AvikaAPI {
  private baseURL: string;
  private token: string;

  constructor(baseURL: string = BACKEND_URL, token: string = JWT_TOKEN) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async sendMessage(message: ChatMessage): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/chat-gemini-advanced`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async checkHealth(): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  }
}

export const avikaAPI = new AvikaAPI();
```

#### **2. React Chat Component**
```typescript
// components/AvikaChat.tsx
'use client';

import { useState, useEffect } from 'react';
import { avikaAPI } from '@/lib/avika-api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  emotion?: string;
  riskLevel?: string;
  recommendations?: string[];
}

export default function AvikaChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const conversationHistory = messages
        .slice(-5)
        .map(m => m.content);

      const response = await avikaAPI.sendMessage({
        message: input,
        sessionId,
        conversationHistory,
      });

      if (response.success) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: response.data.response,
          emotion: response.data.emotion,
          riskLevel: response.data.riskLevel,
          recommendations: response.data.recommendations,
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error - show error message to user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-100 ml-auto max-w-[80%]'
                : 'bg-gray-100 mr-auto max-w-[80%]'
            }`}
          >
            <p>{message.content}</p>
            
            {/* Show emotion and risk level for assistant messages */}
            {message.role === 'assistant' && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="mr-2">😊 {message.emotion}</span>
                <span className={`px-2 py-1 rounded ${
                  message.riskLevel === 'high' ? 'bg-red-200' :
                  message.riskLevel === 'medium' ? 'bg-yellow-200' :
                  'bg-green-200'
                }`}>
                  {message.riskLevel}
                </span>
              </div>
            )}

            {/* Show recommendations if available */}
            {message.recommendations && message.recommendations.length > 0 && (
              <div className="mt-3 p-3 bg-white rounded border">
                <p className="font-semibold mb-2">💡 Recommendations:</p>
                <ul className="space-y-1 text-sm">
                  {message.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="bg-gray-100 p-4 rounded-lg mr-auto max-w-[80%]">
            <p className="text-gray-500">Avika is typing...</p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 p-3 border rounded-lg"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
        >
          Send
        </button>
      </div>
    </div>
  );
}
```

#### **3. Environment Variables**
Create `.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=https://your-app.onrender.com
NEXT_PUBLIC_JWT_TOKEN=your-jwt-token-here
```

---

## 🚀 **Deployment Steps**

### **1. Deploy Backend to Render**
1. Push your code to GitHub (already done ✅)
2. Go to [Render.com](https://render.com)
3. Create new Web Service
4. Connect your GitHub repository: `Saispecial/avika-backend-api`
5. Configure environment variables:
   ```
   GEMINI_API_KEY=your_gemini_key
   JWT_SECRET=your_jwt_secret
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_supabase_key
   DB_ENCRYPTION_KEY=your_encryption_key
   ```
6. Deploy!

### **2. Get Your Backend URL**
After deployment, Render will give you a URL like:
```
https://avika-backend-api-xyz.onrender.com
```

### **3. Update Frontend Environment Variables**
Update your frontend `.env.local` with the Render URL:
```env
NEXT_PUBLIC_BACKEND_URL=https://avika-backend-api-xyz.onrender.com
```

### **4. Generate JWT Token**
Use the token generator script or create one programmatically:
```bash
npm run generate:token
```

---

## 🧪 **Testing the Integration**

### **Test 1: Health Check**
```bash
curl https://your-app.onrender.com/health
```

### **Test 2: Send Message**
```bash
curl -X POST https://your-app.onrender.com/api/chat-gemini-advanced \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I am feeling anxious",
    "sessionId": "test-session-123"
  }'
```

### **Test 3: Frontend Integration**
```typescript
// Test in your browser console
const response = await fetch('https://your-app.onrender.com/api/chat-gemini-advanced', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'Hello',
    sessionId: 'test-123'
  })
});
const data = await response.json();
console.log(data);
```

---

## 📊 **Response Codes**

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response data |
| 400 | Bad Request | Check request format |
| 401 | Unauthorized | Check JWT token |
| 500 | Server Error | Retry or show error message |

---

## 🔒 **Security Best Practices**

1. **Never expose JWT_SECRET** in frontend code
2. **Generate tokens server-side** if possible
3. **Use HTTPS** in production
4. **Implement token refresh** for long sessions
5. **Validate user input** before sending to API
6. **Handle errors gracefully** - don't expose internal errors to users

---

## 🎯 **Quick Start Checklist**

- [ ] Deploy backend to Render
- [ ] Get Render backend URL
- [ ] Generate JWT token
- [ ] Add environment variables to frontend
- [ ] Install API service in frontend
- [ ] Create chat component
- [ ] Test health endpoint
- [ ] Test chat endpoint
- [ ] Deploy frontend
- [ ] Test end-to-end integration

---

## 💡 **Tips for Best Experience**

1. **Session Management**: Use unique sessionId for each user
2. **Conversation History**: Send last 5 messages for better context
3. **Error Handling**: Show friendly error messages to users
4. **Loading States**: Show typing indicators during API calls
5. **Risk Level Display**: Highlight HIGH risk messages prominently
6. **Recommendations**: Display recommendations in a clear, actionable format

---

## 🆘 **Troubleshooting**

### **CORS Errors**
Backend already has CORS enabled. If you still get errors, check:
- Backend URL is correct
- Request headers are properly set

### **401 Unauthorized**
- Check JWT token is valid
- Ensure Authorization header format: `Bearer <token>`
- Verify JWT_SECRET matches between frontend and backend

### **500 Server Error**
- Check backend logs in Render dashboard
- Verify all environment variables are set
- Test backend health endpoint

---

## 📞 **Need Help?**

- Check backend logs: Render Dashboard → Your Service → Logs
- Test endpoints: Use the testing scripts in the backend repo
- Review documentation: ADVANCED_FEATURES.md, GEMINI_INTEGRATION.md

**Your Avika Backend API is ready to power your web application! 🚀**