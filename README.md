# 🌟 Avika Backend API

> **Advanced Mental Health Support System with Gemini AI Integration**

A comprehensive, production-ready backend API designed to provide intelligent mental health support through advanced conversation management, emotion detection, and AI-powered responses.

## ✨ Features

### 🤖 **AI-Powered Conversations**
- **Gemini AI Integration** - Real-time AI responses with emotional context
- **Advanced Conversation Flow** - Progressive dialogue with intelligent follow-ups
- **Context-Aware Responses** - Maintains conversation history and emotional state

### 🧠 **Mental Health Support**
- **Emotion Detection & Mapping** - Identifies and responds to emotional states
- **Safety Detection System** - Three-tier crisis detection (LOW/MEDIUM/HIGH)
- **Therapeutic Flow Management** - 2-4 emotion-based follow-ups per interaction
- **Call-to-Action Triggers** - Intervention after 8-10 conversation exchanges

### 🔐 **Enterprise Security**
- **JWT Authentication** - Secure token-based authentication
- **AES-256 Encryption** - End-to-end data encryption
- **Input Validation** - Comprehensive request validation with Zod
- **Helmet.js Security** - Production-grade security headers

### 🚀 **Production Ready**
- **Cross-Platform Build** - Works on Windows, macOS, and Linux
- **Render.com Deployment** - One-click deployment configuration
- **Comprehensive Testing** - PowerShell and automated testing suites
- **Health Monitoring** - Built-in health checks and diagnostics

## 🏗️ Architecture

```
src/
├── controllers/          # Request handlers
│   ├── chatController.ts
│   ├── chatGeminiController.ts
│   └── chatGeminiAdvancedController.ts
├── routes/              # API route definitions
├── middleware/          # Custom middleware
├── utils/               # Utility functions
│   ├── emotionMap.ts    # Emotion detection
│   ├── safetyCheck.ts   # Crisis detection
│   └── flowManager.ts   # Conversation flow
├── repositories/        # Data access layer
└── tests/              # Test suites
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/avika-backend-api.git
   cd avika-backend-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Build and Start**
   ```bash
   npm run build:prod
   npm start
   ```

### 🔧 Environment Variables

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# AI Integration
GEMINI_API_KEY=your_gemini_api_key

# Database
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_key

# Security
JWT_SECRET=your_jwt_secret
DB_ENCRYPTION_KEY=your_encryption_key
```

## 📡 API Endpoints

### Core Endpoints
- `GET /` - API information and status
- `GET /health` - Health check
- `GET /health/detailed` - Detailed system status

### Conversation APIs
- `POST /api/conversation/start` - Start new conversation
- `POST /api/conversation/message` - Send message
- `GET /api/conversation/history` - Get conversation history

### Gemini AI Integration
- `POST /api/chat-gemini` - Basic Gemini chat
- `POST /api/chat-gemini-advanced` - Advanced AI with context

### Wellness & Support
- `POST /api/wellness/check` - Wellness assessment
- `POST /api/wellness/resources` - Get support resources

## 🧪 Testing

### Quick Test
```bash
npm run verify:quick
```

### Full API Verification
```bash
npm run verify:full
```

### PowerShell Testing (Windows)
```powershell
.\quick-test.ps1
```

## 📊 Key Features in Detail

### 🎯 **Conversation Flow Management**
- **Emotion-Based Follow-ups**: 2-4 contextual follow-up questions per emotional state
- **Progressive Engagement**: Conversation depth increases over time
- **Call-to-Action System**: Triggers interventions after 8-10 exchanges

### 🛡️ **Safety Detection System**
```typescript
// Three-tier safety classification
LOW: "feeling sad", "having a bad day"
MEDIUM: "feeling hopeless", "can't cope"
HIGH: "want to hurt myself", "suicidal thoughts"
```

### 🤖 **AI Integration Levels**
1. **Basic Chat**: Simple Q&A responses
2. **Advanced Context**: Maintains conversation history
3. **Therapeutic Mode**: Emotion-aware responses with safety monitoring

## 🚀 Deployment

### Render.com (Recommended)
1. Connect your GitHub repository
2. Use the included `render.yaml` configuration
3. Set environment variables in Render dashboard
4. Deploy with one click

### Manual Deployment
```bash
npm run build:prod
npm start
```

## 📚 Documentation

- [Advanced Features Guide](./ADVANCED_FEATURES.md)
- [Gemini AI Integration](./GEMINI_INTEGRATION.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Testing Guide](./POWERSHELL_TESTING_GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for advanced language processing
- **Supabase** for database and authentication services
- **Express.js** for the robust web framework
- **TypeScript** for type-safe development

## 📞 Support

For support and questions:
- 📧 Email: saispecial20056@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/avika-backend-api/issues)

---

**Built with ❤️ for mental health support and AI-powered conversations**