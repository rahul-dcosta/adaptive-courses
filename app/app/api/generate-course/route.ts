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

    const systemPrompt = `You are a course creation AI. You MUST respond with valid JSON only. No markdown, no explanations, just pure JSON.`;

    // Generate course using Claude
    const prompt = `Create a personalized learning course for someone learning about "${topic}".

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
2. 3-4 modules, each with 2-3 lessons
3. Each lesson:
   - Clear, specific title
   - 150-200 words of actionable content (concise!)
   - Keep content simple and avoid complex quotes/punctuation
   - A quiz question that tests understanding (include answer)
4. Module descriptions (1 sentence explaining what the module covers)
5. Estimated time for the entire course
6. 3 concrete "next steps" they can take after finishing

CRITICAL JSON FORMATTING RULES:
1. Return ONLY a single valid JSON object, nothing before or after
2. NO markdown code blocks or backticks
3. NO trailing commas after last array/object item
4. Use double quotes for all string keys and values
5. Escape quotes inside strings: use \" not "
6. For multi-line content, use \\n not actual newlines
7. Test your JSON is valid before responding

Use this exact structure:
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
      max_tokens: 6000, // Balanced - enough for quality course, not so long it breaks JSON
      temperature: 0.5, // Lower temp = more predictable, less likely to break JSON
      system: systemPrompt,
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
      let jsonString = responseText.trim();
      
      // 1. Remove markdown code blocks
      jsonString = jsonString
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/, '')
        .replace(/\s*```$/,'');
      
      // 2. Find JSON object boundaries more carefully
      const jsonStart = jsonString.indexOf('{');
      const jsonEnd = jsonString.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        jsonString = jsonString.substring(jsonStart, jsonEnd + 1);
      }
      
      // 3. Remove trailing commas (common JSON error)
      jsonString = jsonString.replace(/,(\s*[}\]])/g, '$1');
      
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
      console.error('=== JSON PARSE ERROR ===');
      console.error('Error:', parseError.message);
      console.error('Response length:', responseText.length);
      console.error('First 500 chars:', responseText.substring(0, 500));
      console.error('Last 500 chars:', responseText.substring(responseText.length - 500));
      
      // Try to identify the problem area from error message
      const posMatch = parseError.message.match(/position (\d+)/);
      if (posMatch) {
        const pos = parseInt(posMatch[1]);
        console.error(`Problem area (pos ${pos}):`, responseText.substring(Math.max(0, pos - 100), pos + 100));
      }
      
      return NextResponse.json(
        { 
          error: `Failed to parse course: ${parseError.message}`,
          hint: 'The AI generated malformed JSON. Please try again or try a different topic.'
        },
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
