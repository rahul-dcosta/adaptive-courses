import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
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
      challengePreference
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
      
      CRITICAL FOR VISUAL LEARNERS: Include diagrams using Mermaid.js syntax for flowcharts, sequences, and visual concepts.
      
      For concepts that benefit from visuals (processes, flows, hierarchies, relationships, timelines):
      - Use Mermaid flowcharts for processes and decision trees
      - Use sequence diagrams for interactions and flows  
      - Use state diagrams for lifecycle and transitions
      - Use ER diagrams for data relationships
      - Use Gantt charts for timelines and schedules
      
      ALWAYS wrap mermaid diagrams in code blocks with the mermaid language tag:
      
      \`\`\`mermaid
      graph TD
          A[Start] --> B{Decision}
          B -->|Yes| C[Action]
          B -->|No| D[Alternative]
      \`\`\`
      
      ALWAYS include mermaid diagrams when explaining concepts with structure, relationships, processes, or comparisons.`,
      
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

    const systemPrompt = `You are a course creation AI. You MUST respond with valid JSON only. No markdown, no explanations, just pure JSON.`;

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

📊 VISUAL DIAGRAMS (AVAILABLE FOR ALL TOPICS):
When explaining processes, relationships, hierarchies, or flows, use Mermaid.js diagrams:

\`\`\`mermaid
graph LR
    A[Concept A] --> B[Concept B]
    B --> C[Outcome]
\`\`\`

Diagram types available:
- graph/flowchart: Processes, decision trees, flows
- sequenceDiagram: Interactions, API calls, request flows
- stateDiagram-v2: State machines, lifecycles
- erDiagram: Database relationships, data models
- gantt: Timelines, project schedules
- pie: Distributions, proportions

Use diagrams when they add clarity - especially for system design, processes, workflows, data relationships, or timelines.

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

Generate a SIMPLE structured course with:
1. A specific, actionable course title (not generic)
2. EXACTLY 2 modules, each with EXACTLY 2 lessons
3. Each lesson:
   - Clear, specific title
   - 100-150 words of actionable content (SHORT!)
   - Use ONLY simple punctuation (periods, commas). NO quotes, apostrophes, or special characters in content
   - A simple quiz question (include short answer)
4. Module descriptions (ONE sentence, simple words)
5. Estimated time for the entire course
6. EXACTLY 3 concrete "next steps"

KEEP IT SHORT AND SIMPLE TO ENSURE VALID JSON.

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
      max_tokens: 4000, // Shorter = less chance of JSON errors
      temperature: 0.3, // Very low temp for maximum predictability
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
