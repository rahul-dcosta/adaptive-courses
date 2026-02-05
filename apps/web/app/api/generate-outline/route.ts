import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getErrorMessage } from '@/lib/types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      topic,
      learningStyle,
      priorKnowledge,
      learningGoal,
      timeCommitment,
      contentFormat,
      challengePreference,
      context,
      previousOutline,
      feedback
    } = body;

    if (!topic) {
      return NextResponse.json(
        { error: 'Missing required field: topic' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a course outline creator. Generate a structured course OUTLINE only (no full content yet). 
Respond with valid JSON only. No markdown, no explanations.`;

    let prompt = `Create a course OUTLINE for "${topic}".

LEARNER PROFILE:
- Learning Style: ${learningStyle || 'mixed'}
- Prior Knowledge: ${priorKnowledge || 'beginner'}
- Goal: ${learningGoal || 'understand'}
- Time Available: ${timeCommitment || '1_hour'}
- Content Format: ${contentFormat || 'mixed'}
- Challenge: ${challengePreference || 'adaptive'}
${context ? `- Specific Context: ${context}` : ''}

NEXT STEPS TONE (IMPORTANT):
- For CASUAL/FUN topics (dance moves, memes, pop culture, hobbies): Keep next steps light and fun. NO serious practice drills.
- For ACADEMIC/PROFESSIONAL topics: Can include concrete exercises and practice.
- Match the vibe to the topic. "Dabbing" shouldn't have "practice for 15 minutes" as a next step.

${previousOutline && feedback ? `
PREVIOUS OUTLINE:
${JSON.stringify(previousOutline, null, 2)}

USER FEEDBACK:
"${feedback}"

Adjust the outline based on this feedback. Add/remove/change modules and lessons as requested.
` : ''}

Generate a course OUTLINE with:
1. Specific, actionable title (not generic)
2. 2-3 modules
3. Each module has:
   - Title
   - Brief description (1 sentence)
   - 2-3 lesson titles (no content, just titles)
4. Estimated total time
5. 3 concrete next steps

Return ONLY valid JSON in this exact structure:
{
  "title": "Specific Course Title",
  "estimated_time": "2 hours",
  "modules": [
    {
      "title": "Module Title",
      "description": "What this covers",
      "lessons": [
        { "title": "Lesson 1 Title" },
        { "title": "Lesson 2 Title" }
      ]
    }
  ],
  "next_steps": [
    "Action 1",
    "Action 2", 
    "Action 3"
  ]
}

Keep it SHORT - this is just an outline for the user to approve before we generate full content.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1500, // Shorter for outline
      temperature: 0.4,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    // Parse JSON
    let outlineData;
    try {
      let jsonString = responseText.trim();
      
      // Remove markdown
      jsonString = jsonString
        .replace(/^```json\s*/gi, '')
        .replace(/^```\s*/g, '')
        .replace(/\s*```$/g, '');
      
      // Extract JSON
      const jsonStart = jsonString.indexOf('{');
      const jsonEnd = jsonString.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No valid JSON found');
      }
      jsonString = jsonString.substring(jsonStart, jsonEnd + 1);
      
      // Fix trailing commas
      jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
      
      outlineData = JSON.parse(jsonString);
      
      if (!outlineData.title || !outlineData.modules) {
        throw new Error('Invalid outline structure');
      }
      
    } catch (parseError: unknown) {
      const errorMsg = getErrorMessage(parseError);
      console.error('Outline parse error:', errorMsg);
      return NextResponse.json(
        {
          error: 'We had trouble creating your course outline. Please try again.',
          userMessage: 'Outline generation encountered an issue. This can happen occasionally - please try again.',
          ...(process.env.NODE_ENV === 'development' && { technicalDetails: errorMsg })
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      outline: outlineData
    });

  } catch (error: unknown) {
    console.error('Outline generation error:', error);

    // Provide user-friendly error messages based on error type
    const errorMessage = getErrorMessage(error);
    let userMessage = 'Something went wrong while creating your outline. Please try again.';
    let statusCode = 500;

    // Check for specific error types
    if (errorMessage.includes('rate') || errorMessage.includes('limit')) {
      userMessage = 'We are experiencing high demand. Please wait a moment and try again.';
      statusCode = 429;
    } else if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
      userMessage = 'The request took too long. Please try again.';
      statusCode = 408;
    } else if (errorMessage.includes('network') || errorMessage.includes('ECONNREFUSED')) {
      userMessage = 'We are having trouble connecting to our servers. Please check your connection and try again.';
      statusCode = 503;
    } else if (errorMessage.includes('API key') || errorMessage.includes('authentication')) {
      userMessage = 'There is a configuration issue on our end. We are working on it.';
      statusCode = 500;
    }

    return NextResponse.json(
      {
        error: userMessage,
        ...(process.env.NODE_ENV === 'development' && { technicalDetails: errorMessage })
      },
      { status: statusCode }
    );
  }
}
