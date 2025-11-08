# ✅ Render Deployment Checklist

## 🎯 **Your Environment Variables (Ready to Copy-Paste)**

```env
NODE_ENV=production
PORT=3000
SUPABASE_URL=https://sxaavyrahfkeezlnpfke.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4YWF2eXJhaGZrZWV6bG5wZmtlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDM2MjgxMSwiZXhwIjoyMDc1OTM4ODExfQ.4hG10IOUtm9CwIeX2SAe7Gj_Nl7w7JsY_UsQ_Bt3fN0
JWT_SECRET=fYlltaxPqHcD7V4Wxx2hXIMb8bAUmRQ5qQS37xg9piQ=
DB_ENCRYPTION_KEY=8b3496c7ae15df02
GEMINI_API_KEY=AIzaSyBgMewCxFeuhn6wDDEl1txpTd1aESzu-w4
```

## 🚀 **Deployment Steps**

### **Step 1: Render Dashboard**
- [ ] Go to https://dashboard.render.com
- [ ] Click "New +" → "Web Service"
- [ ] Connect repository: `Saispecial/avika-backend-api`

### **Step 2: Service Configuration**
- [ ] Name: `avika-backend-api`
- [ ] Branch: `master`
- [ ] Build Command: `npm install && npm run build:prod`
- [ ] Start Command: `npm start`
- [ ] Instance Type: `Free`

### **Step 3: Environment Variables**
Copy each variable above into Render:
- [ ] NODE_ENV
- [ ] PORT
- [ ] SUPABASE_URL
- [ ] SUPABASE_SERVICE_KEY
- [ ] JWT_SECRET
- [ ] DB_ENCRYPTION_KEY
- [ ] GEMINI_API_KEY

### **Step 4: Deploy**
- [ ] Click "Create Web Service"
- [ ] Wait 3-5 minutes for deployment
- [ ] Note your URL: `https://avika-backend-api-xxxx.onrender.com`

## 🧪 **Testing Your Deployment**

### **Your Test JWT Token:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItMTIzIiwic2Vzc2lvbklkIjoidGVzdC1zZXNzaW9uLTEyMyIsImlhdCI6MTc2MjYwOTMyMCwiZXhwIjoxNzYyNjk1NzIwfQ.COXEEKVtAMpvoFNukf8py1H8QhJ2UwYhcQhWu2l64lI
```

### **Test Commands (Replace YOUR_URL):**

#### **1. Health Check**
```bash
curl https://YOUR_URL.onrender.com/health
```

#### **2. API Info**
```bash
curl https://YOUR_URL.onrender.com/
```

#### **3. Chat Test**
```bash
curl -X POST https://YOUR_URL.onrender.com/api/chat-gemini-advanced \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItMTIzIiwic2Vzc2lvbklkIjoidGVzdC1zZXNzaW9uLTEyMyIsImlhdCI6MTc2MjYwOTMyMCwiZXhwIjoxNzYyNjk1NzIwfQ.COXEEKVtAMpvoFNukf8py1H8QhJ2UwYhcQhWu2l64lI" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello, I am feeling anxious","sessionId":"test-session-123"}'
```

## ✅ **Expected Responses**

### **Health Check Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-01-10T...",
    "uptime": 123,
    "version": "1.0.0",
    "features": {
      "geminiIntegration": true,
      "supabaseConnection": true,
      "jwtAuth": true,
      "encryption": true
    }
  }
}
```

### **Chat Response:**
```json
{
  "success": true,
  "data": {
    "response": "I can sense you're feeling anxious. What specifically is making you feel this way?",
    "emotion": "anxiety",
    "riskLevel": "low",
    "stage": "emotion_followup",
    "exchangeCount": 1,
    "actionType": "followup",
    "recommendations": [
      "🧘 Try a 5-minute mindfulness or breathing exercise",
      "🚶 Take a gentle walk outside if possible"
    ]
  }
}
```

## 🔧 **Troubleshooting**

### **Build Failed**
- Check Render logs for errors
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

### **Environment Variable Issues**
- Double-check all 7 variables are set
- Ensure no extra spaces or quotes
- Verify JWT_SECRET and other keys are correct

### **API Not Responding**
- Wait 2-3 minutes after deployment
- Check service status in Render dashboard
- Verify URL is correct

### **401 Unauthorized**
- Use the JWT token provided above
- Ensure Authorization header format: `Bearer <token>`
- Check JWT_SECRET matches

## 📱 **For Frontend Integration**

Once deployed, update your frontend environment variables:

```env
# .env.local (Frontend)
NEXT_PUBLIC_BACKEND_URL=https://your-actual-url.onrender.com
JWT_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItMTIzIiwic2Vzc2lvbklkIjoidGVzdC1zZXNzaW9uLTEyMyIsImlhdCI6MTc2MjYwOTMyMCwiZXhwIjoxNzYyNjk1NzIwfQ.COXEEKVtAMpvoFNukf8py1H8QhJ2UwYhcQhWu2l64lI
```

## 🎉 **Success Indicators**

- [ ] Render deployment shows "Live"
- [ ] Health endpoint returns 200 OK
- [ ] All features show as enabled in health response
- [ ] Chat endpoint responds with AI message
- [ ] No errors in Render logs
- [ ] Frontend can connect successfully

---

**You're all set! Your Avika Backend API is ready to power your web application! 🚀**