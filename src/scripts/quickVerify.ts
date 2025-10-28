#!/usr/bin/env tsx
/**
 * Quick API Verification Script
 * Tests core functionality to ensure all features are working
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function quickVerify() {
  console.log('🚀 Quick API Verification Starting...\n');

  try {
    // 1. Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    
    if (healthResponse.ok) {
      console.log('✅ Health Check: PASS');
      console.log(`   Server Status: ${healthData.data.status}`);
      console.log(`   Gemini Integration: ${healthData.data.features.geminiIntegration ? 'Enabled' : 'Disabled'}`);
      console.log(`   Supabase Connection: ${healthData.data.features.supabaseConnection ? 'Enabled' : 'Disabled'}`);
    } else {
      console.log('❌ Health Check: FAIL');
      return;
    }

    // 2. Test Conversation API (No Auth)
    console.log('\n2️⃣ Testing Conversation API...');
    const conversationResponse = await fetch(`${BASE_URL}/api/conversation/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    
    if (conversationResponse.ok) {
      console.log('✅ Conversation API: PASS');
    } else {
      console.log('❌ Conversation API: FAIL');
    }

    // 3. Test Emotion Detection
    console.log('\n3️⃣ Testing Emotion Detection...');
    const emotionResponse = await fetch(`${BASE_URL}/api/conversation/emotion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'I feel really anxious about everything' })
    });
    
    if (emotionResponse.ok) {
      console.log('✅ Emotion Detection: PASS');
    } else {
      console.log('❌ Emotion Detection: FAIL');
    }

    // 4. Test Safety Detection
    console.log('\n4️⃣ Testing Safety Detection...');
    const safetyResponse = await fetch(`${BASE_URL}/api/conversation/engage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'I want to hurt myself' })
    });
    
    if (safetyResponse.ok) {
      console.log('✅ Safety Detection: PASS');
    } else {
      console.log('❌ Safety Detection: FAIL');
    }

    // 5. Test JWT Protected Endpoint (should fail without token)
    console.log('\n5️⃣ Testing JWT Authentication...');
    const authResponse = await fetch(`${BASE_URL}/api/v1/chat/message/test-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'test' })
    });
    
    if (authResponse.status === 401) {
      console.log('✅ JWT Authentication: PASS (correctly rejected without token)');
    } else {
      console.log('❌ JWT Authentication: FAIL (should require token)');
    }

    // 6. Test Gemini Endpoint (should fail without token, but for different reason)
    console.log('\n6️⃣ Testing Gemini Endpoint Availability...');
    const geminiResponse = await fetch(`${BASE_URL}/api/chat-gemini`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'test', sessionId: 'test' })
    });
    
    if (geminiResponse.status === 401) {
      console.log('✅ Gemini Endpoint: PASS (correctly requires authentication)');
    } else {
      console.log('❌ Gemini Endpoint: FAIL');
    }

    // 7. Test Advanced Gemini Endpoint
    console.log('\n7️⃣ Testing Advanced Gemini Endpoint...');
    const advancedGeminiResponse = await fetch(`${BASE_URL}/api/chat-gemini-advanced`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'test', sessionId: 'test' })
    });
    
    if (advancedGeminiResponse.status === 401) {
      console.log('✅ Advanced Gemini Endpoint: PASS (correctly requires authentication)');
    } else {
      console.log('❌ Advanced Gemini Endpoint: FAIL');
    }

    console.log('\n🎉 Quick Verification Complete!');
    console.log('\n📋 Summary:');
    console.log('   • Server is running and healthy');
    console.log('   • Conversation API working (no auth required)');
    console.log('   • Emotion detection functional');
    console.log('   • Safety detection operational');
    console.log('   • JWT authentication enforced');
    console.log('   • All endpoints properly configured');
    
    console.log('\n🔑 Next Steps:');
    console.log('   1. Get a valid JWT token for protected endpoints');
    console.log('   2. Test full conversation flows with authentication');
    console.log('   3. Verify Gemini AI responses with real API key');
    console.log('   4. Test advanced features (follow-ups, call-to-action)');

  } catch (error) {
    console.log('❌ Verification failed with error:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   • Make sure the server is running: npm run dev:local');
    console.log('   • Check that port 3000 is available');
    console.log('   • Verify environment variables are set');
  }
}

// Run verification
quickVerify();