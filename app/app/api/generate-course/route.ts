import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { topic, skillLevel, goal, timeAvailable } = await request.json();

    // Validate inputs
    if (!topic || !skillLevel || !goal || !timeAvailable) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate course using Claude
    const prompt = `Create a comprehensive learning course for the following:

Topic: ${topic}
Skill Level: ${skillLevel}
Goal: ${goal}
Time Available: ${timeAvailable}

Generate a structured course with:
1. A catchy course title
2. 3-5 modules, each with 2-4 lessons
3. Each lesson should have:
   - A clear lesson title
   - Detailed content (aim for 200-300 words per lesson)
   - A quick quiz question to test understanding
4. Include practical examples and actionable takeaways

Format the response as JSON with this structure:
{
  "title": "Course Title",
  "modules": [
    {
      "title": "Module Title",
      "lessons": [
        {
          "title": "Lesson Title",
          "content": "Detailed lesson content...",
          "quiz": {
            "question": "Quiz question?",
            "answer": "Correct answer"
          }
        }
      ]
    }
  ],
  "estimated_time": "Total time estimate",
  "next_steps": ["Step 1", "Step 2"]
}

Make the content engaging, practical, and tailored to their ${skillLevel} skill level.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Extract the JSON from the response
    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    // Parse the course data
    let courseData;
    try {
      // Try to extract JSON if it's wrapped in markdown code blocks
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                       responseText.match(/```\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : responseText;
      courseData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse course JSON:', parseError);
      return NextResponse.json(
        { error: 'Failed to generate valid course structure' },
        { status: 500 }
      );
    }

    // TODO: Save to Supabase (after payment)
    // For now, just return the course

    return NextResponse.json({
      success: true,
      course: courseData
    });

  } catch (error: any) {
    console.error('Course generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate course' },
      { status: 500 }
    );
  }
}
