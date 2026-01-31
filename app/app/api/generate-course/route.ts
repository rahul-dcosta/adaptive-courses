import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, skillLevel, goal, timeAvailable, context, timeline, depth } = body;

    // Accept either old format (skillLevel, goal, timeAvailable) or new format (context, timeline, depth)
    const finalSkillLevel = skillLevel || 'intermediate';
    const finalGoal = goal || depth || 'understand';
    const finalTimeAvailable = timeAvailable || timeline || 'flexible';
    const learningContext = context || '';

    // Validate inputs
    if (!topic) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Build context-aware prompt
    const contextualGuidance = finalGoal.includes('smart') 
      ? 'Focus on key buzzwords, frameworks, and talking points. Make them sound conversational and confident.'
      : finalGoal.includes('questions')
      ? 'Focus on smart questions to ask, what to look for, and how to engage meaningfully. Include specific question examples.'
      : 'Focus on deep understanding with clear explanations, examples, and why things work the way they do.';

    const depthGuidance = finalTimeAvailable.includes('2 hours') || finalTimeAvailable.includes('tomorrow')
      ? 'Keep it concise and tactical. 3-4 modules max. Focus on the essentials someone needs RIGHT NOW.'
      : finalTimeAvailable.includes('week')
      ? '4-5 modules with practical depth. Balance theory with application.'
      : '4-5 modules with comprehensive coverage. Go deeper on concepts.';

    // Generate course using Claude
    const prompt = `You are creating a personalized learning course for someone learning about "${topic}".

CONTEXT:
- Skill Level: ${finalSkillLevel}
- Learning Context: ${learningContext || 'general interest'}
- Timeline: ${finalTimeAvailable}
- Depth Goal: ${finalGoal}

TONE & APPROACH:
${contextualGuidance}

STRUCTURE:
${depthGuidance}

Generate a structured course with:
1. A specific, actionable course title (not generic)
2. 3-5 modules, each with 2-4 lessons
3. Each lesson:
   - Clear, specific title
   - 200-300 words of actionable content
   - Real-world examples
   - A quiz question that tests understanding (include answer)
4. Module descriptions (1 sentence explaining what the module covers)
5. Estimated time for the entire course
6. 3-4 concrete "next steps" they can take after finishing

IMPORTANT: Return ONLY valid JSON, no markdown, no extra text. Use this exact structure:
{
  "title": "Specific Course Title (not generic)",
  "estimated_time": "X hours/minutes total",
  "modules": [
    {
      "title": "Module Title",
      "description": "What this module covers in one sentence",
      "lessons": [
        {
          "title": "Lesson Title",
          "content": "200-300 words of actionable content with real examples",
          "quiz": {
            "question": "Test understanding question?",
            "answer": "Detailed answer explanation"
          }
        }
      ]
    }
  ],
  "next_steps": [
    "Concrete action step 1",
    "Concrete action step 2",
    "Concrete action step 3"
  ]
}

Make it engaging, practical, and worth $5.`;

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
      // Try multiple extraction strategies
      let jsonString = responseText;
      
      // 1. Try to extract from markdown code blocks
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                       responseText.match(/```\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        jsonString = jsonMatch[1];
      }
      
      // 2. Try to find JSON object boundaries
      const jsonStart = jsonString.indexOf('{');
      const jsonEnd = jsonString.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        jsonString = jsonString.substring(jsonStart, jsonEnd + 1);
      }
      
      courseData = JSON.parse(jsonString);
      
      // Validate course structure
      if (!courseData.title || !courseData.modules || courseData.modules.length === 0) {
        throw new Error('Invalid course structure: missing required fields');
      }
      
      // Ensure at least 2 modules
      if (courseData.modules.length < 2) {
        throw new Error('Course must have at least 2 modules');
      }
      
      // Validate each module has lessons
      for (const module of courseData.modules) {
        if (!module.lessons || module.lessons.length === 0) {
          throw new Error(`Module "${module.title}" has no lessons`);
        }
      }
      
    } catch (parseError: any) {
      console.error('Failed to parse course JSON:', parseError);
      console.error('Raw response:', responseText.substring(0, 500));
      return NextResponse.json(
        { error: `Failed to parse course: ${parseError.message}` },
        { status: 500 }
      );
    }

    // Save to Supabase
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data: courseRecord, error: dbError } = await supabase
      .from('courses')
      .insert({
        topic,
        skill_level: skillLevel,
        goal,
        time_available: timeAvailable,
        content: courseData,
        paid: false // Will be true after payment
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Still return the course even if DB save fails
    }

    return NextResponse.json({
      success: true,
      course: courseData,
      courseId: courseRecord?.id
    });

  } catch (error: any) {
    console.error('Course generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate course' },
      { status: 500 }
    );
  }
}
