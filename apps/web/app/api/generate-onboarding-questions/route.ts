import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { getErrorMessage } from '@/lib/types';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface QuestionOption {
  label: string;
  value: string;
  emoji: string;
  description: string;
}

interface QuestionData {
  question: string;
  subtitle: string;
  options: QuestionOption[];
}

interface CacheEntry {
  data: QuestionData;
  timestamp: number;
}

// Simple in-memory cache for common topics (context step only)
const questionCache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function getCacheKey(topic: string, step: string): string {
  return `${topic.toLowerCase().trim()}-${step}`;
}

function getCachedQuestion(topic: string, step: string): QuestionData | null {
  const key = getCacheKey(topic, step);
  const entry = questionCache.get(key);

  if (!entry) return null;

  // Check if expired
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    questionCache.delete(key);
    return null;
  }

  return entry.data;
}

function setCachedQuestion(topic: string, step: string, data: QuestionData): void {
  const key = getCacheKey(topic, step);
  questionCache.set(key, {
    data,
    timestamp: Date.now()
  });
}

export async function POST(request: NextRequest) {
  // Check rate limit
  const rateLimitResult = await checkRateLimit(request, 'generate-onboarding-questions');
  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult, 'generate-onboarding-questions');
  }

  try {
    const { topic, step, previousAnswers } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Check cache first (only for 'context' step - first question)
    // Later steps depend on previous answers, so don't cache those
    if (step === 'context') {
      const cached = getCachedQuestion(topic, step);
      if (cached) {
        return NextResponse.json({
          ...cached,
          _cached: true // Flag for debugging
        });
      }
    }

    const systemPrompt = `You are an expert course designer helping create personalized learning experiences. Generate contextually relevant onboarding questions based on what the user wants to learn.

Your job: Generate 4 smart, contextual options for the "${step}" question that make sense for someone learning "${topic}".

Return ONLY valid JSON in this exact format:
{
  "question": "string (the question to ask)",
  "subtitle": "string (why this question matters)",
  "options": [
    {
      "label": "string (concise option)",
      "value": "string (snake_case identifier)",
      "emoji": "string (single relevant emoji)",
      "description": "string (why pick this)"
    }
  ]
}`;

    let userPrompt = '';

    if (step === 'context') {
      userPrompt = `Topic: "${topic}"

Generate 4 contextual options for "Why are you learning ${topic}?"

Think about realistic reasons someone would learn this topic. Make them specific and relevant.

Examples:
- For "supply chain": job interview, factory tour, career switch, personal interest
- For "Egyptian civilization": school project, travel prep, general curiosity, teaching others
- For "Python programming": work project, career change, hobby, building a specific app

Generate 4 options that make sense for "${topic}".`;
    } else if (step === 'timeline') {
      userPrompt = `Topic: "${topic}"
Context: ${previousAnswers?.context || 'Not specified'}

Generate 4 timeline options for "When do you need to know this?"

Consider urgency levels that make sense for this topic and context.

Examples:
- Urgent: "Tomorrow" (exam, interview, presentation)
- Soon: "This week" (upcoming project)
- Moderate: "This month" (general prep)
- Flexible: "No rush" (personal learning)

Generate 4 timeline options.`;
    } else if (step === 'depth') {
      userPrompt = `Topic: "${topic}"
Context: ${previousAnswers?.context || 'Not specified'}
Timeline: ${previousAnswers?.timeline || 'Not specified'}

Generate 4 depth/goal options for "What level of understanding do you need?"

Consider what depth makes sense given their context and timeline.

Examples:
- Surface: "Just the basics" (quick overview)
- Conversational: "Speak intelligently" (social/professional credibility)
- Practical: "Apply it immediately" (hands-on skills)
- Deep: "Master the fundamentals" (comprehensive understanding)

Generate 4 depth options.`;
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON in response');
    }

    const result = JSON.parse(jsonMatch[0]);

    // Cache the result (only for 'context' step)
    if (step === 'context') {
      setCachedQuestion(topic, step, result);
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Generate onboarding error:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) || 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
