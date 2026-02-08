import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getErrorMessage } from '@/lib/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, priorKnowledge } = body;

    if (!topic) {
      return NextResponse.json(
        { error: 'Missing required field: topic' },
        { status: 400 }
      );
    }

    const prompt = `Generate a diagnostic quiz to assess someone's knowledge of "${topic}".
They self-reported their level as: ${priorKnowledge || 'unknown'}.

Create exactly 5 multiple-choice questions that progressively test knowledge from beginner to advanced.
Each question should have 4 options with exactly one correct answer.

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "difficulty": "beginner",
      "explanation": "Brief explanation of the correct answer"
    }
  ]
}

Difficulty levels should progress: beginner, beginner, intermediate, intermediate, advanced.
Keep questions concise (under 100 characters). Keep options short (under 50 characters each).
Return raw JSON only — no markdown wrapper.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1500,
      temperature: 0.3,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    let diagnosticData;
    try {
      let jsonString = responseText.trim();
      jsonString = jsonString.replace(/^```json\s*/gi, '').replace(/```\s*$/gi, '');
      diagnosticData = JSON.parse(jsonString);
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse diagnostic questions' },
        { status: 500 }
      );
    }

    return NextResponse.json(diagnosticData);
  } catch (error: unknown) {
    console.error('Diagnostic generation failed:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
