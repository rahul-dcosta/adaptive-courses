import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getErrorMessage } from '@/lib/types';

export async function GET() {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'ANTHROPIC_API_KEY not set in environment variables'
      });
    }

    const anthropic = new Anthropic({ apiKey });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: 'Say "API works!" if you can read this.'
        }
      ]
    });

    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    return NextResponse.json({
      success: true,
      response: responseText,
      model: 'claude-sonnet-4-5-20250929'
    });

  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: getErrorMessage(error),
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
