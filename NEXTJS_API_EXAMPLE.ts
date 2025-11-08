// 📁 app/api/avika-chat/route.ts
// Copy this file to your Next.js app

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.RENDER_BACKEND_URL || 'http://localhost:3000';
const JWT_TOKEN = process.env.JWT_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId, conversationHistory } = body;

    // Validate required fields
    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'message and sessionId are required' },
        { status: 400 }
      );
    }

    // Forward request to Avika Backend API
    const response = await fetch(`${BACKEND_URL}/api/chat-gemini-advanced`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${JWT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId,
        conversationHistory,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Backend request failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Backend health check failed', details: error.message },
      { status: 500 }
    );
  }
}