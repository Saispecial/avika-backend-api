# 🚀 Render Deployment - Step by Step

## ⚡ **Quick Deploy (5 Minutes)**

### **Step 1: Go to Render**
Visit: https://dashboard.render.com

### **Step 2: Create New Web Service**
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect a repository"** or **"Configure account"** if first time

### **Step 3: Connect GitHub Repository**
1. Find and select: **`Saispecial/avika-backend-api`**
2. Click **"Connect"**

### **Step 4: Configure Service**
Render will auto-detect your `render.yaml` file, but verify these settings:

```
Name: avika-backend-api
Region: Oregon (US West) or closest to you
Branch: master
Root Directory: (leave blank)
Environment: Node
Build Command: npm install && npm run build:prod
Start Command: npm start
Instance Type: Free
```

### **Step 5: Add Environment Variables** ⚠️ **IMPORTANT**
Click **"Advanced"** → **"Add Environment Variable"**

Add these **5 required variables**:

```env
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
DB_ENCRYPTION_KEY=your_32_character_encryption_key
```

**Don't have these values?** See below for how to get them.

### **Step 6: Deploy!**
1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Your app will be live at: `https://avika-backend-api-xxxx.onrender.com`

---

## 🔑 **How to Get Environment Variables**

### **1. GEMINI_API_KEY**
1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

### **2. JWT_SECRET**
Generate a random secret:
```bash
# Option 1: Use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: Use OpenSSL
openssl rand -hex 32

# Option 3: Use online generator
# Visit: https://randomkeygen.com/
```

### **3. SUPABASE_URL & SUPABASE_SERVICE_KEY**
1. Go to: https://supabase.com/dashboard
2. Select your project (or create new one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** → `SUPABASE_SERVICE_KEY` (⚠️ Keep secret!)

### **4. DB_ENCRYPTION_KEY**
Generate a 32-character key:
```bash
# Option 1: Node.js
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"

# Option 2: OpenSSL
openssl rand -hex 16

# Option 3: Manual
# Use any 32-character string (letters + numbers)
```

---

## ✅ **Verify Deployment**

### **Test 1: Check if service is running**
```bash
curl https://your-app-name.onrender.com/health
```

Expected response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-01-10T...",
    "uptime": 123,
    "version": "1.0.0"
  }
}
```

### **Test 2: Check API info**
```bash
curl https://your-app-name.onrender.com/
```

### **Test 3: Test chat endpoint**
First, generate a JWT token locally:
```bash
cd avika-backend-api-main
npm run generate:token
```

Then test:
```bash
curl -X POST https://your-app-name.onrender.com/api/chat-gemini-advanced \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","sessionId":"test-123"}'
```

---

## 🔧 **Troubleshooting**

### **Build Failed**
**Check Render logs:**
1. Go to your service dashboard
2. Click "Logs" tab
3. Look for error messages

**Common fixes:**
- Ensure all dependencies are in `package.json`
- Check Node version compatibility
- Verify build command is correct

### **Deploy Failed - Missing Environment Variables**
**Error**: `Cannot read property 'X' of undefined`

**Fix**: Add missing environment variables in Render dashboard:
1. Go to service → **Environment**
2. Add missing variables
3. Click **"Save Changes"**
4. Service will auto-redeploy

### **503 Service Unavailable**
**Cause**: Service is still starting up

**Fix**: Wait 2-3 minutes, then try again

### **401 Unauthorized**
**Cause**: Invalid or missing JWT token

**Fix**: 
1. Generate new token: `npm run generate:token`
2. Use format: `Authorization: Bearer <token>`

---

## 🎯 **Post-Deployment Checklist**

- [ ] Service deployed successfully
- [ ] Health endpoint returns 200 OK
- [ ] All 5 environment variables configured
- [ ] JWT token generated
- [ ] Chat endpoint tested and working
- [ ] Backend URL saved for frontend integration
- [ ] SSL certificate active (https://)

---

## 📊 **Render Dashboard Overview**

### **Useful Tabs:**
- **Logs**: Real-time application logs
- **Metrics**: CPU, memory, request stats
- **Environment**: Manage environment variables
- **Settings**: Service configuration
- **Events**: Deployment history

### **Free Tier Limits:**
- ✅ 750 hours/month (enough for 24/7)
- ✅ Automatic HTTPS
- ✅ Custom domains
- ⚠️ Spins down after 15 min inactivity
- ⚠️ Cold start: 30-60 seconds

---

## 🔄 **Redeploying After Changes**

### **Automatic Deployment:**
Render auto-deploys when you push to GitHub:
```bash
git add .
git commit -m "your changes"
git push origin master
```

### **Manual Deployment:**
1. Go to Render dashboard
2. Click **"Manual Deploy"**
3. Select branch: **master**
4. Click **"Deploy"**

---

## 💡 **Pro Tips**

1. **Keep Service Alive**: Use a service like UptimeRobot to ping your health endpoint every 5 minutes
2. **Monitor Logs**: Check logs regularly for errors
3. **Environment Variables**: Never commit secrets to GitHub
4. **Custom Domain**: Add your own domain in Render settings
5. **Backup Keys**: Save all environment variables securely

---

## 🆘 **Still Having Issues?**

1. **Check Render Status**: https://status.render.com
2. **Review Logs**: Render Dashboard → Your Service → Logs
3. **Test Locally**: Run `npm run build:prod && npm start`
4. **Check GitHub**: Ensure latest code is pushed

---

## 📞 **Your Deployment URL**

After deployment, your backend will be available at:
```
https://avika-backend-api-[random-id].onrender.com
```

**Save this URL!** You'll need it for frontend integration.

---

**Ready to deploy? Let's go! 🚀**