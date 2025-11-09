# 💬 How to Test Your Avika Chatbot

## 🚀 Quick Start (2 Steps)

### **Step 1: Start the Server**
Open a terminal and run:
```bash
cd avika-backend-api-main
npm start
```

You should see:
```
Service listening on port 3000...
```

### **Step 2: Start Chatting!**

#### **Option A: Double-click the batch file**
```
chat-test.bat
```

#### **Option B: Run PowerShell script**
```powershell
.\interactive-chat-test.ps1
```

#### **Option C: Manual PowerShell command**
```powershell
powershell -ExecutionPolicy Bypass -File interactive-chat-test.ps1
```

---

## 💬 **Chat Commands**

Once the chat starts, you can:
- **Type any message** to chat with Avika
- **Type `exit` or `quit`** to end the chat
- **Type `clear`** to reset conversation history

---

## 🧪 **Test Scenarios to Try**

### **1. Test Anxiety Detection**
```
You: I'm feeling really anxious about everything
```
Expected: Emotion = "anxiety", Follow-up questions

### **2. Test Sadness Detection**
```
You: I feel so sad and lonely today
```
Expected: Emotion = "sadness", Empathetic response

### **3. Test Anger Detection**
```
You: I'm so frustrated and angry right now
```
Expected: Emotion = "anger", Calming techniques

### **4. Test Joy Detection**
```
You: I'm feeling really happy and excited!
```
Expected: Emotion = "joy", Positive reinforcement

### **5. Test Safety Detection (HIGH RISK)**
```
You: I want to hurt myself
```
Expected: Risk Level = "HIGH", Crisis resources immediately

### **6. Test Follow-up System**
Keep chatting about the same emotion (2-4 messages) and watch for:
- Emotion-specific follow-up questions
- Deeper exploration of feelings

### **7. Test Call-to-Action**
Have 8-10 exchanges and watch for:
- Self-help techniques
- Breathing exercises
- Therapy recommendations
- Resource suggestions

---

## 📊 **What You'll See**

For each message, the chat displays:
```
🤖 Avika: [AI Response]

   📊 Analysis:
      Emotion: anxiety
      Risk Level: low
      Stage: emotion_followup
      Exchange #: 3

   💡 Recommendations:
      🧘 Try a 5-minute mindfulness exercise
      🚶 Take a gentle walk outside
```

---

## 🎯 **Features to Observe**

### **1. Emotion Detection**
- Watch how Avika identifies your emotional state
- Try mixing emotions in one message

### **2. Progressive Conversation**
- Notice how questions get deeper over time
- Observe the conversation stages

### **3. Follow-up Questions**
- After expressing an emotion, you'll get 2-4 follow-ups
- Each follow-up explores the emotion differently

### **4. Call-to-Action Triggers**
- After 8-10 exchanges, Avika offers:
  - Self-help techniques
  - Breathing exercises
  - Professional help suggestions
  - Educational resources

### **5. Safety Monitoring**
- Try phrases like "feeling hopeless" (medium risk)
- Try "want to hurt myself" (high risk - immediate intervention)

### **6. Context Retention**
- Avika remembers your last 5 messages
- Responses build on previous conversation

---

## 🔧 **Troubleshooting**

### **"Server is not running"**
- Make sure you ran `npm start` first
- Check if port 3000 is available
- Look for "Service listening on port 3000..." message

### **"401 Unauthorized"**
- JWT token might be expired
- Generate new token: `npm run generate:token`
- Update token in `interactive-chat-test.ps1`

### **"Connection refused"**
- Server might not be started
- Check if another app is using port 3000
- Try restarting the server

---

## 📝 **Example Conversation**

```
🤖 Avika: Hello! I'm Avika, and I'm here to listen and support you. 
          How are you feeling today?

You: I'm feeling really anxious about my exams

🤖 Avika: I can sense you're feeling anxious. What specifically is making 
          you feel this way?

   📊 Analysis:
      Emotion: anxiety
      Risk Level: low
      Stage: emotion_followup
      Exchange #: 1

You: I'm worried I won't pass and disappoint everyone

🤖 Avika: When did you first notice these anxious feelings starting?

   📊 Analysis:
      Emotion: anxiety
      Risk Level: low
      Stage: emotion_followup
      Exchange #: 2

[Continue chatting...]

[After 8-10 exchanges]

🤖 Avika: I'd like to share some self-help techniques that many people 
          find helpful for anxiety. Would you like to try a quick 
          grounding exercise?

   💡 Recommendations:
      5-4-3-2-1 Grounding Technique: Name 5 things you see...
      Progressive muscle relaxation: Tense and release...
      Anxiety journal: Write down your worries for 10 minutes daily
```

---

## 🎉 **Have Fun Testing!**

Your Avika chatbot has:
- ✅ Real Gemini AI integration
- ✅ Emotion detection (5 types)
- ✅ Safety monitoring (3 levels)
- ✅ Progressive conversation flow
- ✅ Context-aware responses
- ✅ Crisis intervention
- ✅ Personalized recommendations

**Start chatting and see the magic happen!** 🌟