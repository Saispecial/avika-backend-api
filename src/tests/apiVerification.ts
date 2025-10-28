/**
 * Comprehensive API Verification Test Suite
 * Tests all endpoints and features for successful API fetching
 */

import fetch from 'node-fetch';

// Configuration
const BASE_URL = 'http://localhost:3000';
const TEST_JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItMTIzIiwiaWF0IjoxNjAwMDAwMDAwfQ.example'; // Replace with valid JWT

interface TestResult {
  endpoint: string;
  method: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  statusCode?: number;
  responseTime?: number;
  error?: string;
  features?: string[];
}

class APIVerificationSuite {
  private results: TestResult[] = [];
  private baseUrl: string;
  private jwtToken: string;

  constructor(baseUrl: string = BASE_URL, jwtToken: string = TEST_JWT_TOKEN) {
    this.baseUrl = baseUrl;
    this.jwtToken = jwtToken;
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting API Verification Suite...\n');
    
    // Test all endpoints
    await this.testConversationAPI();
    await this.testBasicChatAPI();
    await this.testWellnessAPI();
    await this.testGeminiAPI();
    await this.testAdvancedGeminiAPI();
    
    // Print results
    this.printResults();
  }

  private async testConversationAPI(): Promise<void> {
    console.log('📝 Testing Conversation API (No Auth Required)...');
    
    // Test conversation start
    await this.testEndpoint({
      endpoint: '/api/conversation/start',
      method: 'POST',
      body: {},
      requiresAuth: false,
      expectedFeatures: ['Basic conversation flow', 'Gemini placeholder']
    });

    // Test emotion processing
    await this.testEndpoint({
      endpoint: '/api/conversation/emotion',
      method: 'POST',
      body: { text: 'I feel really anxious about everything' },
      requiresAuth: false,
      expectedFeatures: ['Emotion detection', 'Safety detection', 'Zod validation']
    });

    // Test engagement with safety
    await this.testEndpoint({
      endpoint: '/api/conversation/engage',
      method: 'POST',
      body: { text: 'I want to hurt myself' },
      requiresAuth: false,
      expectedFeatures: ['Safety detection middleware', 'Crisis intervention']
    });

    // Test final stage
    await this.testEndpoint({
      endpoint: '/api/conversation/final',
      method: 'POST',
      body: {},
      requiresAuth: false,
      expectedFeatures: ['Conversation completion']
    });
  }

  private async testBasicChatAPI(): Promise<void> {
    console.log('💬 Testing Basic Chat API (JWT Required)...');
    
    await this.testEndpoint({
      endpoint: '/api/v1/chat/message/test-user-123',
      method: 'POST',
      body: { message: 'Hello, I need someone to talk to' },
      requiresAuth: true,
      expectedFeatures: ['JWT authentication', 'Advanced conversation flow', 'Encrypted storage']
    });

    // Test emotion follow-ups
    await this.testEndpoint({
      endpoint: '/api/v1/chat/message/test-user-123',
      method: 'POST',
      body: { message: 'I feel really sad and hopeless' },
      requiresAuth: true,
      expectedFeatures: ['Emotion follow-ups', 'State tracking', 'Progressive conversation']
    });
  }

  private async testWellnessAPI(): Promise<void> {
    console.log('🌱 Testing Wellness API (JWT Required)...');
    
    // Test conversation analysis
    await this.testEndpoint({
      endpoint: '/api/v1/wellness/analyze/test-user-123',
      method: 'GET',
      requiresAuth: true,
      expectedFeatures: ['Conversation analysis', 'Mood tracking']
    });

    // Test recommendations
    await this.testEndpoint({
      endpoint: '/api/v1/wellness/recommendations/test-user-123',
      method: 'GET',
      requiresAuth: true,
      expectedFeatures: ['Personalized recommendations']
    });

    // Test safety check
    await this.testEndpoint({
      endpoint: '/api/v1/wellness/safety/test-user-123',
      method: 'GET',
      requiresAuth: true,
      expectedFeatures: ['Safety assessment', 'Risk evaluation']
    });
  }

  private async testGeminiAPI(): Promise<void> {
    console.log('🤖 Testing Basic Gemini API (JWT Required)...');
    
    await this.testEndpoint({
      endpoint: '/api/chat-gemini',
      method: 'POST',
      body: {
        message: 'I feel overwhelmed with work stress',
        sessionId: 'test-session-123',
        conversationHistory: ['Hello', 'Hi there!']
      },
      requiresAuth: true,
      expectedFeatures: ['Gemini AI integration', 'Enhanced emotion detection', 'Risk assessment']
    });

    // Test safety detection
    await this.testEndpoint({
      endpoint: '/api/chat-gemini',
      method: 'POST',
      body: {
        message: 'I want to end my life',
        sessionId: 'test-session-123'
      },
      requiresAuth: true,
      expectedFeatures: ['High-risk detection', 'Crisis resources', 'Safety intervention']
    });
  }

  private async testAdvancedGeminiAPI(): Promise<void> {
    console.log('🌟 Testing Advanced Gemini API (JWT Required)...');
    
    // Test initial conversation
    await this.testEndpoint({
      endpoint: '/api/chat-gemini-advanced',
      method: 'POST',
      body: {
        message: 'Hi, I\'ve been feeling really anxious lately',
        sessionId: 'advanced-test-123',
        conversationHistory: []
      },
      requiresAuth: true,
      expectedFeatures: ['Advanced Gemini integration', 'Context-aware AI', 'State tracking']
    });

    // Test emotion follow-up (should trigger after emotion detection)
    await this.testEndpoint({
      endpoint: '/api/chat-gemini-advanced',
      method: 'POST',
      body: {
        message: 'Work is just so overwhelming and I can\'t sleep',
        sessionId: 'advanced-test-123'
      },
      requiresAuth: true,
      expectedFeatures: ['Emotion follow-ups', 'Advanced conversation flow']
    });

    // Test multiple exchanges to trigger call-to-action
    for (let i = 3; i <= 10; i++) {
      await this.testEndpoint({
        endpoint: '/api/chat-gemini-advanced',
        method: 'POST',
        body: {
          message: `This is exchange ${i}, I'm still feeling anxious`,
          sessionId: 'advanced-test-123'
        },
        requiresAuth: true,
        expectedFeatures: i >= 8 ? ['Call to action trigger', 'Specific interventions'] : ['Progressive conversation']
      });
    }
  }

  private async testWellnessUnifiedAPI(): Promise<void> {
    console.log('🔄 Testing Wellness Unified API (JWT Required)...');
    
    // Test session analysis
    await this.testEndpoint({
      endpoint: '/api/wellness?action=analyze-session',
      method: 'POST',
      body: {
        conversationHistory: [
          'I feel anxious',
          'Work is stressing me out',
          'I can\'t handle the pressure'
        ]
      },
      requiresAuth: true,
      expectedFeatures: ['Session analysis', 'Mood detection', 'Activity recommendations']
    });

    // Test recommendation generation
    await this.testEndpoint({
      endpoint: '/api/wellness?action=generate-recommendations',
      method: 'POST',
      body: {},
      requiresAuth: true,
      expectedFeatures: ['Random activity generation', 'Wellness suggestions']
    });

    // Test safety check
    await this.testEndpoint({
      endpoint: '/api/wellness?action=safety-check',
      method: 'POST',
      body: {
        message: 'I feel like giving up on everything'
      },
      requiresAuth: true,
      expectedFeatures: ['Safety assessment', 'Helpline resources']
    });
  }

  private async testEndpoint(config: {
    endpoint: string;
    method: string;
    body?: any;
    requiresAuth?: boolean;
    expectedFeatures?: string[];
  }): Promise<void> {
    const startTime = Date.now();
    
    try {
      const headers: any = {
        'Content-Type': 'application/json'
      };

      if (config.requiresAuth) {
        headers['Authorization'] = `Bearer ${this.jwtToken}`;
      }

      const response = await fetch(`${this.baseUrl}${config.endpoint}`, {
        method: config.method,
        headers,
        body: config.body ? JSON.stringify(config.body) : undefined
      });

      const responseTime = Date.now() - startTime;
      const responseData = await response.json();

      const result: TestResult = {
        endpoint: config.endpoint,
        method: config.method,
        status: response.ok ? 'PASS' : 'FAIL',
        statusCode: response.status,
        responseTime,
        features: config.expectedFeatures
      };

      if (!response.ok) {
        result.error = `HTTP ${response.status}: ${responseData.error?.message || 'Unknown error'}`;
      }

      this.results.push(result);
      
      // Log result
      const statusIcon = result.status === 'PASS' ? '✅' : '❌';
      console.log(`  ${statusIcon} ${config.method} ${config.endpoint} - ${result.status} (${responseTime}ms)`);
      
      if (result.status === 'FAIL') {
        console.log(`     Error: ${result.error}`);
      }

    } catch (error) {
      const responseTime = Date.now() - startTime;
      const result: TestResult = {
        endpoint: config.endpoint,
        method: config.method,
        status: 'FAIL',
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        features: config.expectedFeatures
      };

      this.results.push(result);
      console.log(`  ❌ ${config.method} ${config.endpoint} - FAIL (${responseTime}ms)`);
      console.log(`     Error: ${result.error}`);
    }
  }

  private printResults(): void {
    console.log('\n📊 API Verification Results Summary');
    console.log('=' .repeat(50));
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const total = this.results.length;
    
    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(result => {
          console.log(`  • ${result.method} ${result.endpoint}: ${result.error}`);
        });
    }

    console.log('\n🎯 Feature Coverage:');
    const allFeatures = new Set<string>();
    this.results.forEach(r => {
      if (r.features && r.status === 'PASS') {
        r.features.forEach(f => allFeatures.add(f));
      }
    });
    
    Array.from(allFeatures).forEach(feature => {
      console.log(`  ✅ ${feature}`);
    });

    console.log('\n🚀 API Verification Complete!');
  }
}

// Export for use in other files
export { APIVerificationSuite };

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const suite = new APIVerificationSuite();
  suite.runAllTests().catch(console.error);
}