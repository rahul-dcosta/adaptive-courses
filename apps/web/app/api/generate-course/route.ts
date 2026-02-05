import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getErrorMessage } from '@/lib/types';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  // Check rate limit
  const rateLimitResult = await checkRateLimit(request, 'generate-course');
  if (!rateLimitResult.success) {
    return rateLimitResponse(rateLimitResult, 'generate-course');
  }

  try {
    const body = await request.json();
    const {
      topic,
      skillLevel,
      goal,
      timeAvailable,
      context,
      timeline,
      depth,
      // NEW: Learner Fingerprint fields
      fingerprint,
      learningStyle,
      priorKnowledge,
      learningGoal,
      timeCommitment,
      contentFormat,
      challengePreference,
      // Approved outline from preview step
      approvedOutline
    } = body;

    // Use fingerprint if provided, otherwise fall back to old format
    const finalSkillLevel = priorKnowledge || skillLevel || 'intermediate';
    const finalGoal = learningGoal || goal || depth || 'understand';
    const finalTimeAvailable = timeCommitment || timeAvailable || timeline || 'flexible';
    const learningContext = context || '';
    const finalLearningStyle: string = learningStyle || 'mixed';
    const finalContentFormat: string = contentFormat || 'mixed';
    const finalChallengePreference: string = challengePreference || 'adaptive';

    // Validate inputs
    if (!topic) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Build FINGERPRINT-aware prompt
    const learningStyleMap: Record<string, string> = {
      'visual': `Use lots of concrete examples, analogies to visual concepts, and describe things in spatial/visual terms. 
      
      CRITICAL FOR VISUAL LEARNERS: You MUST include multiple Mermaid.js diagrams throughout the course.
      
      REQUIRED: Include at least 2-3 diagrams across the lessons. Embed them directly in the content field.
      
      Example of content with embedded diagram:
      "Here's how the process works:

\`\`\`mermaid
graph TD
    A[Input] --> B[Process]
    B --> C{Quality Check}
    C -->|Pass| D[Output]
    C -->|Fail| A
\`\`\`

This feedback loop ensures quality..."

      Use these diagram types as appropriate:
      - graph TD / graph LR: Processes, flows, hierarchies
      - sequenceDiagram: Interactions, timelines
      - stateDiagram-v2: State machines
      - erDiagram: Data relationships
      
      ALWAYS wrap in \`\`\`mermaid code blocks and place WITHIN the lesson content text.`,
      
      'auditory': 'Use conversational tone, explain concepts as if speaking to them. Include discussion prompts and verbal examples.',
      'reading': 'Provide detailed written explanations, definitions, and structured text. Use clear hierarchies and bullet points.',
      'kinesthetic': 'Focus on practical exercises, hands-on examples, and actionable steps. "How to DO this" over "what it IS".',
      'mixed': 'Balance all approaches - visuals, detailed text, practical examples, and conversational explanations.'
    };
    const learningStyleGuidance = learningStyleMap[finalLearningStyle] || 'Balance different learning approaches.';

    const contentFormatMap: Record<string, string> = {
      'examples_first': 'Start each concept with a concrete, real-world example, THEN explain the theory behind it.',
      'theory_first': 'Explain the foundational concept first, THEN provide examples to illustrate it.',
      'visual_diagrams': 'Describe visual representations, flowcharts, and diagrams in text. Use spatial language.',
      'text_heavy': 'Provide comprehensive, detailed written explanations with precise terminology.',
      'mixed': 'Mix theory and examples naturally, using both detailed explanations and concrete cases.'
    };
    const contentFormatGuidance = contentFormatMap[finalContentFormat] || 'Use a balanced mix of theory and examples.';

    const challengeMap: Record<string, string> = {
      'easy_to_hard': 'Start with the absolute basics and progressively build complexity. Each lesson should be slightly harder than the last.',
      'adaptive': 'Mix difficulty levels. Include easier and harder examples in each lesson to match different comfort levels.',
      'deep_dive': 'Jump into advanced concepts quickly. Assume quick understanding and focus on nuanced details.',
      'practical_only': 'Skip theoretical foundations. Focus entirely on "how to use this" and practical applications.'
    };
    const challengeGuidance = challengeMap[finalChallengePreference] || 'Balance difficulty appropriately.';

    const goalMap: Record<string, string> = {
      'job_interview': 'Focus on key talking points, common interview questions, and how to discuss this topic confidently in 5-10 minute conversations.',
      'career': 'Focus on professional applications, industry relevance, and how this skill translates to job performance.',
      'sound_smart': 'Focus on key buzzwords, frameworks, and impressive-sounding insights someone can drop in conversations.',
      'academic': 'Focus on definitions, frameworks, testable knowledge, and academic understanding.',
      'hobby': 'Focus on interesting facts, enjoyment, and personal enrichment. Make it fun and engaging.',
      'teach_others': 'Focus on clarity, analogies, and how to explain concepts simply to someone else.'
    };
    const goalGuidance = goalMap[finalGoal] || 'Focus on comprehensive understanding.';

    const timeMap: Record<string, string> = {
      '30_min': 'VERY concise. 2 modules, 2 lessons each. 100-150 words per lesson max. Hit only the critical essentials.',
      '1_hour': 'Concise. 2-3 modules with 2-3 lessons each. 150-200 words per lesson. Core concepts only.',
      '2_hours': '3-4 modules with 2-3 lessons each. 200-300 words per lesson. Include some depth.',
      '1_week': '4-5 modules with 3-4 lessons each. 250-350 words per lesson. Comprehensive coverage.',
      'no_rush': '5-6 modules with 3-4 lessons each. 300-400 words per lesson. Deep, thorough exploration.'
    };
    const timeGuidance = timeMap[finalTimeAvailable] || '4 modules with 2-3 lessons each. 200-300 words per lesson.';

    const systemPrompt = `You are a course creation AI that outputs valid JSON with embedded mermaid diagrams.

ABSOLUTE REQUIREMENTS:
1. Output raw JSON only (no markdown wrapper)
2. You MUST include \`\`\`mermaid code blocks in lesson content strings
3. Use \\n for all newlines in JSON strings
4. NEVER use ASCII art like [A]-->[B] or arrows like →. ONLY use \`\`\`mermaid blocks.

Example of CORRECT content field:
"content": "Scaling explained:\\n\\n\`\`\`mermaid\\ngraph LR\\n    A[Server] --> B[Load Balancer]\\n    B --> C[Server 1]\\n    B --> D[Server 2]\\n\`\`\`\\n\\nThis shows horizontal scaling."

WRONG (never do this):
"content": "Scaling: [Server] → [Load Balancer] → [Servers]"

Always use the mermaid format, never ASCII diagrams.`;

    // Generate course using Claude with FINGERPRINT
    const prompt = `Create a PERSONALIZED learning course for someone learning about "${topic}".

🧠 LEARNER FINGERPRINT:
- Prior Knowledge: ${finalSkillLevel}
- Learning Style: ${finalLearningStyle}
- Learning Goal: ${finalGoal}
- Time Available: ${finalTimeAvailable}
- Content Format: ${finalContentFormat}
- Challenge Preference: ${finalChallengePreference}
${learningContext ? `- Context: ${learningContext}` : ''}

📚 LEARNING STYLE ADAPTATION:
${learningStyleGuidance}

📖 CONTENT FORMAT:
${contentFormatGuidance}

🎯 GOAL-SPECIFIC APPROACH:
${goalGuidance}

⏱️ TIME & STRUCTURE:
${timeGuidance}

🎚️ DIFFICULTY PROGRESSION:
${challengeGuidance}

📊 MERMAID DIAGRAMS - CRITICAL REQUIREMENT:

FORBIDDEN - Never output these patterns:
❌ [Box] --> [Box] or [A]-->[B]
❌ Unicode arrows like → or ➔
❌ ASCII art diagrams
❌ Plain text representations of flows

REQUIRED - Always use this exact format:
✅ \`\`\`mermaid\\ngraph TD\\n    A[Label] --> B[Label]\\n\`\`\`

CORRECT EXAMPLE (copy this pattern exactly):
"content": "Here is how scaling works:\\n\\n\`\`\`mermaid\\ngraph LR\\n    C[Client] --> LB[Load Balancer]\\n    LB --> S1[Server 1]\\n    LB --> S2[Server 2]\\n    S1 --> DB[(Database)]\\n    S2 --> DB\\n\`\`\`\\n\\nThe load balancer distributes traffic across servers."

WRONG EXAMPLE (never do this):
"content": "Here is how scaling works: [Client] → [Load Balancer] → [Server 1, Server 2] → [Database]"

Include at least ONE mermaid diagram in the course. Use graph LR, graph TD, or sequenceDiagram.

💡 TEACH LIKE AN EXPERT (CRITICAL):
Don't just define concepts. Teach the THINKING:
- Definition: What is it?
- Why it matters: Real-world impact and relevance
- Trade-offs: Pros AND cons, tensions, when to use vs not use
- Context: How it fits in the bigger picture
- Common mistakes: What people get wrong
- Practical application: How to actually use this

Example (DO THIS):
"WIP (Work in Progress) = units that started but aren't finished.

Why WIP is bad: Tied-up capital, takes space, can become obsolete, hides bottlenecks.

Why WIP exists: Buffers against variability. If one station has issues, the next keeps working.

The art: Find the MINIMUM WIP to keep flow stable without excessive holding costs."

DON'T just say "WIP = work in progress" and move on. Teach the nuances.

${approvedOutline ? `
📋 APPROVED COURSE STRUCTURE (FOLLOW THIS EXACTLY):
${JSON.stringify(approvedOutline, null, 2)}

Generate content for EACH lesson in the approved outline above. Keep the exact same:
- Course title
- Module titles and order
- Lesson titles and order
- Estimated time

For each lesson, add:
- 100-200 words of rich content WITH embedded \`\`\`mermaid code blocks
- A quiz question with answer
` : `
Generate a SIMPLE structured course with:
1. A specific, actionable course title (not generic)
2. EXACTLY 2 modules, each with EXACTLY 2 lessons
3. Each lesson:
   - Clear, specific title
   - 100-200 words of content WITH embedded \`\`\`mermaid code blocks (NOT ASCII art)
   - A simple quiz question with short answer
4. Module descriptions (ONE sentence, simple words)
5. Estimated time for the entire course
6. EXACTLY 3 concrete "next steps"`}

⚠️ CRITICAL: You MUST include \`\`\`mermaid code blocks (not ASCII art). If you write [A]-->[B] instead of a mermaid block, you have FAILED. Use the exact mermaid format shown above.

KEEP IT SHORT AND SIMPLE TO ENSURE VALID JSON.

CRITICAL JSON FORMATTING RULES:
1. Return ONLY a single valid JSON object, nothing before or after
2. Do NOT wrap the JSON in markdown code blocks (no \`\`\`json wrapper)
3. NO trailing commas after last array/object item
4. Use double quotes for all string keys and values
5. Escape quotes inside strings: use \" not "
6. For multi-line content, use \\n (literal backslash-n) not actual newlines
7. IMPORTANT: Backticks (\`) ARE allowed and REQUIRED inside content strings for mermaid diagrams

EXACT JSON FORMAT WITH MERMAID EXAMPLE:
{
  "title": "Specific Course Title",
  "estimated_time": "1 hour",
  "modules": [
    {
      "title": "Module Title",
      "description": "What this module covers",
      "lessons": [
        {
          "title": "Lesson Title",
          "content": "Introduction text here.\\n\\nHere is a diagram:\\n\\n\`\`\`mermaid\\ngraph TD\\n    A[Start] --> B{Decision}\\n    B -->|Yes| C[Result 1]\\n    B -->|No| D[Result 2]\\n\`\`\`\\n\\nAs you can see in the diagram above...",
          "quiz": {
            "question": "Test question?",
            "answer": "Answer explanation"
          }
        }
      ]
    }
  ],
  "next_steps": ["Step 1", "Step 2", "Step 3"]
}

Make it engaging, practical, and worth paying for.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4000,
      temperature: 0.5, // Slightly higher to allow mermaid code generation
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

    // Parse the course data with aggressive error handling
    let courseData;
    try {
      let jsonString = responseText.trim();
      
      // 1. Remove ALL markdown/code blocks
      jsonString = jsonString
        .replace(/^```json\s*/gi, '')
        .replace(/^```\s*/g, '')
        .replace(/\s*```$/g, '')
        .replace(/^`+/g, '')
        .replace(/`+$/g, '');
      
      // 2. Extract JSON object more aggressively
      const jsonStart = jsonString.indexOf('{');
      const jsonEnd = jsonString.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
        throw new Error('No valid JSON object found in response');
      }
      jsonString = jsonString.substring(jsonStart, jsonEnd + 1);
      
      // 3. Fix common JSON errors (safe fixes only)
      jsonString = jsonString
        .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
      
      // 4. Try to parse
      courseData = JSON.parse(jsonString);
      
      // Validate basic course structure
      if (!courseData.title || !courseData.modules || !Array.isArray(courseData.modules) || courseData.modules.length === 0) {
        throw new Error('Invalid course structure: missing required fields');
      }
      
      // Validate each module has lessons
      for (const module of courseData.modules) {
        if (!module.lessons || !Array.isArray(module.lessons) || module.lessons.length === 0) {
          throw new Error(`Module "${module.title}" has no lessons`);
        }
      }
      
    } catch (parseError: unknown) {
      const errorMsg = getErrorMessage(parseError);
      console.error('=== JSON PARSE ERROR ===');
      console.error('Error:', errorMsg);
      console.error('Response length:', responseText.length);
      console.error('First 500 chars:', responseText.substring(0, 500));
      console.error('Last 500 chars:', responseText.substring(responseText.length - 500));

      // Try to identify the problem area from error message
      const posMatch = errorMsg.match(/position (\d+)/);
      if (posMatch) {
        const pos = parseInt(posMatch[1]);
        console.error(`Problem area (pos ${pos}):`, responseText.substring(Math.max(0, pos - 100), pos + 100));
      }

      return NextResponse.json(
        {
          error: 'We had trouble generating your course. Please try again.',
          userMessage: 'Course generation encountered an issue. This can happen occasionally - please try again.',
          hint: 'The AI generated malformed content. Please try again or try a different topic.'
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

    const response = NextResponse.json({
      success: true,
      course: courseData,
      courseId: courseRecord?.id
    });

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());

    return response;

  } catch (error: unknown) {
    console.error('Course generation error:', error);

    // Provide user-friendly error messages based on error type
    const errorMessage = getErrorMessage(error);
    let userMessage = 'Something went wrong while generating your course. Please try again.';
    let statusCode = 500;

    // Check for specific error types
    if (errorMessage.includes('rate') || errorMessage.includes('limit')) {
      userMessage = 'We are experiencing high demand. Please wait a moment and try again.';
      statusCode = 429;
    } else if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
      userMessage = 'The request took too long. Please try again with a simpler topic.';
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
        // Only include technical details in development
        ...(process.env.NODE_ENV === 'development' && { technicalDetails: errorMessage })
      },
      { status: statusCode }
    );
  }
}
