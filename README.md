# Avika Backend API - Unified Mental Health Support System

A comprehensive Node.js/Express.js backend API that provides AI-powered conversational therapy with emotion recognition, safety detection, and structured conversation flow management.

## 🎯 **Project Overview**

This is a unified mental health support system that combines:
- **Conversation API**: 4-stage therapeutic conversation flow with emotion recognition and safety detection
- **Chat API**: JWT-protected chat system with encrypted message storage
- **Wellness API**: Conversation analysis, recommendations, and safety checks
- **Dual Storage**: Both in-memory (encrypted) and PostgreSQL database support

## 📁 **Project Structure**

### **Core Controllers**
- **`conversationController.ts`** - 4-stage conversation handlers (START → EMOTION → ENGAGE → FINAL)
- **`chatController.ts`** - JWT-protected chat system with stage-based flow
- **`wellnessController.ts`** - Conversation analysis, recommendations, and safety checks
- **`flowManager.ts`** - Session-based conversation flow management

### **Middleware Components**
- **`auth.ts`** - JWT authentication middleware
- **`emotionRecognitionMiddleware.ts`** - Analyzes user text for emotional content
- **`safetyDetectionMiddleware.ts`** - Detects self-harm terms and triggers safety responses
- **`errors.ts`** - Enhanced global error handling

### **Data Layer**
- **`messageRepository.ts`** - PostgreSQL database operations for encrypted messages
- **`chatRepository.ts`** - In-memory encrypted conversation storage
- **`wellnessRepository.ts`** - In-memory wellness data storage

### **Utility Functions**
- **`emotionMap.ts`** - Enhanced emotion classification (joy, sadness, anger, anxiety, neutral)
- **`safetyCheck.ts`** - Self-harm detection with predefined terms
- **`encryption.ts`** - AES-256-CBC encryption for secure data storage
- **`flowManager.ts`** - Chat conversation flow management
- **`response.ts`** - Standardized API response formatting

### **API Routes**
- **`conversationRoutes.ts`** - RESTful conversation endpoints:
  - `POST /api/conversation/start` - Begin conversation
  - `POST /api/conversation/emotion` - Process emotions
  - `POST /api/conversation/engage` - Continue conversation (with safety checks)
  - `POST /api/conversation/final` - End conversation

- **`chatRoutes.ts`** - JWT-protected chat endpoints:
  - `POST /api/v1/chat/message/:userId` - Send message to chat system

- **`wellnessRoutes.ts`** - JWT-protected wellness endpoints:
  - `GET /api/v1/wellness/analyze/:userId` - Analyze conversation history
  - `GET /api/v1/wellness/recommendations/:userId` - Generate recommendations
  - `GET /api/v1/wellness/safety/:userId` - Perform safety check

## 🔧 **Key Features**

1. **Dual API Architecture** - Both conversation and chat/wellness APIs
2. **JWT Authentication** - Secure access to chat and wellness endpoints
3. **Emotion Recognition** - Analyzes user input for emotional states
4. **Safety Detection** - Monitors for self-harm indicators with appropriate responses
5. **Structured Flow** - 4-stage therapeutic conversation flow
6. **Session Management** - Tracks conversation state per user session
7. **Dual Storage** - Both PostgreSQL and in-memory encrypted storage
8. **Enhanced Error Handling** - Comprehensive error management with custom HTTP errors
9. **Data Encryption** - AES-256-CBC encryption for sensitive data

## 🚀 **Getting Started**

### Prerequisites
- Node.js 20 or higher
- npm, pnpm or yarn
- PostgreSQL (optional, for persistent storage)
- Docker (optional)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
```

3. Start development server:
```bash
npm run dev:local
```

The server will start on `http://localhost:3000` with hot-reloading enabled.

### Production Build

```bash
npm run build:prod
npm run prod:serve
```

## 📋 **Environment Variables**

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=avika_db
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Encryption Configuration
DB_ENCRYPTION_KEY=your_32_character_encryption_key_here

# Gemini API Configuration (for future AI integration)
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🎯 **Use Cases**

This unified system provides:

1. **Therapeutic Conversations** - Structured 4-stage mental health support
2. **Secure Chat System** - JWT-protected messaging with encryption
3. **Wellness Analysis** - Conversation history analysis and recommendations
4. **Safety Monitoring** - Automated self-harm detection and response
5. **Flexible Storage** - Choose between in-memory or PostgreSQL storage

## 📊 **API Endpoints Summary**

### Conversation API (No Auth Required)
- `POST /api/conversation/start` - Start therapeutic conversation
- `POST /api/conversation/emotion` - Process user emotions
- `POST /api/conversation/engage` - Continue conversation with safety checks
- `POST /api/conversation/final` - End conversation

### Chat API (JWT Auth Required)
- `POST /api/v1/chat/message/:userId` - Send encrypted message

### Wellness API (JWT Auth Required)
- `GET /api/v1/wellness/analyze/:userId` - Analyze conversation history
- `GET /api/v1/wellness/recommendations/:userId` - Get wellness recommendations
- `GET /api/v1/wellness/safety/:userId` - Perform safety check

## 🔒 **Security Features**

- JWT authentication for protected endpoints
- AES-256-CBC encryption for sensitive data
- Self-harm detection and safety responses
- Helmet.js security headers
- CORS configuration
- Input validation with Zod

## 📝 **Scripts**

- `npm run dev:local` - Start local development server with hot-reload
- `npm run dev:docker` - Start development server in Docker
- `npm run build:prod` - Build for production
- `npm run prod:serve` - Run production server
- `npm run test` - Run tests
- `npm run coverage` - Run tests with coverage report

## 📄 **License**

[MIT](./LICENSE)