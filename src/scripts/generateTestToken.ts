#!/usr/bin/env tsx
/**
 * JWT Token Generator for Testing
 * Generates valid JWT tokens for API testing
 */

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fYlltaxPqHcD7V4Wxx2hXIMb8bAUmRQ5qQS37xg9piQ=';

function generateTestToken(userId: string = 'test-user-123', expiresIn: string = '24h') {
  const payload = {
    userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };

  const token = jwt.sign(payload, JWT_SECRET);
  
  console.log('🔑 JWT Token Generated for Testing');
  console.log('=' .repeat(50));
  console.log(`User ID: ${userId}`);
  console.log(`Expires: ${expiresIn}`);
  console.log(`Secret: ${JWT_SECRET.substring(0, 10)}...`);
  console.log('\n📋 Token:');
  console.log(token);
  console.log('\n🧪 Usage Examples:');
  console.log('\n# Export as environment variable:');
  console.log(`export JWT_TOKEN="${token}"`);
  console.log('\n# Use in cURL:');
  console.log(`curl -H "Authorization: Bearer ${token}" http://localhost:3000/api/v1/chat/message/test-user-123`);
  console.log('\n# Use in Postman:');
  console.log('Authorization: Bearer');
  console.log(`Token: ${token}`);
  
  return token;
}

// Generate token if script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const userId = process.argv[2] || 'test-user-123';
  const expiresIn = process.argv[3] || '24h';
  generateTestToken(userId, expiresIn);
}

export { generateTestToken };