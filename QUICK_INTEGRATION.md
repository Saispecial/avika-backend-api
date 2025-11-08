# ⚡ Quick Integration Guide

## 🎯 **What You Need (TL;DR)**

### **1. Backend URL**
```
https://your-app-name.onrender.com
```

### **2. Main Endpoint**
```
POST /api/chat-gemini-advanced
```

### **3. Authentication**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### **4. Request Format**
```json
{
  "message": "I'm feeling anxious",
  "sessionId": "unique-session-id",
  "conversationHistory": ["previous messages"] // optional
}
```

### **5. Response Format**
```json
{
  "success": true,
  "data": {
    "response": "AI response here",
    "emotion": "anxiety",
    "riskLevel": "low",
    "stage": "emotion_followup",
    "exchangeCount": 3,
    "actionType": "followup",
    "recommendations": ["tip 1", "tip 2"]
  }
}
```

---

## 🚀 **3-Step Integration**

### **Step 1: Deploy Backend**
1. Go to [Render.com](https://render.com)
2. Connect GitHub repo: `Saispecial/avika-backend-api`
3. Add environment variables:
   - `GEMINI_API_KEY`
   - `JWT_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `DB_ENCRYPTION_KEY`
4. Deploy!

### **Step 2: Get JWT Token**
Run in backend directory:
```bash
npm run generate:token
```

Or create programmatically:
```typescript
import jwt from 'jsonwebtoken';
const token = jwt.sign({ userId: 'user123' }, 'your-secret', { expiresIn: '24h' });
```

### **Step 3: Connect Frontend**
```typescript
// In your frontend
const response = await fetch('https://your-backend.onrender.com/api/chat-gemini-advanced', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: userInput,
    sessionId: 'session-123'
  })
});

const data = await response.json();
console.log(data.data.response); // AI response
```

---

## 📝 **Environment Variables Needed**

### **Backend (.env)**
```env
PORT=3000
NODE_ENV=production
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
DB_ENCRYPTION_KEY=your_encryption_key
```

### **Frontend (.env.local)**
```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
JWT_TOKEN=your_generated_jwt_token
```

---

## 🧪 **Quick Test**

### **Test Backend Health**
```bash
curl https://your-backend.onrender.com/health
```

### **Test Chat Endpoint**
```bash
curl -X POST https://your-backend.onrender.com/api/chat-gemini-advanced \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","sessionId":"test-123"}'
```

---

## 🎨 **Frontend Code (Copy-Paste Ready)**

```typescript
// lib/avika.ts
export async function sendMessage(message: string, sessionId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat-gemini-advanced`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.JWT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, sessionId }),
  });
  
  return response.json();
}

// Usage in component
const handleSend = async () => {
  const result = await sendMessage(userInput, sessionId);
  console.log(result.data.response); // Display AI response
};
```

---

## ✅ **Integration Checklist**

- [ ] Backend deployed to Render
- [ ] Environment variables configured
- [ ] JWT token generated
- [ ] Frontend environment variables set
- [ ] Test health endpoint (works ✓)
- [ ] Test chat endpoint (works ✓)
- [ ] Frontend connected and working
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Risk level display implemented

---

## 🆘 **Common Issues**

| Issue | Solution |
|-------|----------|
| CORS error | Backend has CORS enabled, check URL |
| 401 Unauthorized | Check JWT token format: `Bearer <token>` |
| 400 Bad Request | Ensure `message` and `sessionId` are sent |
| 500 Server Error | Check Render logs, verify env variables |

---

## 📚 **Full Documentation**

- **Complete Guide**: See `FRONTEND_INTEGRATION_GUIDE.md`
- **Features**: See `ADVANCED_FEATURES.md`
- **API Details**: See `GEMINI_INTEGRATION.md`
- **Deployment**: See `DEPLOYMENT_GUIDE.md`

---

**You're ready to integrate! 🎉**