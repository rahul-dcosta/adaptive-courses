'use client';

import { useState } from 'react';

type ConversationStep = 'topic' | 'skill_level' | 'goal' | 'time' | 'generating' | 'complete';

export default function CourseBuilder() {
  const [step, setStep] = useState<ConversationStep>('topic');
  const [topic, setTopic] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [goal, setGoal] = useState('');
  const [timeAvailable, setTimeAvailable] = useState('');
  const [currentInput, setCurrentInput] = useState('');
  const [generatedCourse, setGeneratedCourse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 'topic') {
      setTopic(currentInput);
      setCurrentInput('');
      setStep('skill_level');
    } else if (step === 'skill_level') {
      setSkillLevel(currentInput);
      setCurrentInput('');
      setStep('goal');
    } else if (step === 'goal') {
      setGoal(currentInput);
      setCurrentInput('');
      setStep('time');
    } else if (step === 'time') {
      const finalTime = currentInput;
      setTimeAvailable(finalTime);
      setStep('generating');
      await generateCourse(finalTime);
    }
  };

  const generateCourse = async (time: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          skillLevel,
          goal,
          timeAvailable: time
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status}`);
      }
      
      setGeneratedCourse(data.course);
      setStep('complete');
    } catch (error: any) {
      console.error('Generation failed:', error);
      alert(`Failed to generate course: ${error.message || 'Unknown error'}`);
      setStep('topic');
    } finally {
      setLoading(false);
    }
  };

  const getQuestion = () => {
    switch (step) {
      case 'topic':
        return "What do you want to learn?";
      case 'skill_level':
        return `Great! Learning about ${topic}. What's your current skill level? (beginner/intermediate/advanced)`;
      case 'goal':
        return "What's your main goal with this?";
      case 'time':
        return "How much time can you dedicate? (e.g., '30 min/day' or '2 hours total')";
      default:
        return "";
    }
  };

  const getPlaceholder = () => {
    switch (step) {
      case 'topic':
        return "e.g., Python for data science";
      case 'skill_level':
        return "e.g., beginner";
      case 'goal':
        return "e.g., build my first ML model";
      case 'time':
        return "e.g., 1 hour/day for a week";
      default:
        return "";
    }
  };

  const getStepNumber = () => {
    switch (step) {
      case 'topic': return 1;
      case 'skill_level': return 2;
      case 'goal': return 3;
      case 'time': return 4;
      default: return 0;
    }
  };

  if (step === 'generating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900">Generating your course...</h2>
          <p className="text-gray-600 mt-2">This will take about 30-60 seconds</p>
        </div>
      </div>
    );
  }

  if (step === 'complete' && generatedCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-6">{generatedCourse.title}</h1>
          
          {generatedCourse.modules?.map((module: any, idx: number) => (
            <div key={idx} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                Module {idx + 1}: {module.title}
              </h2>
              
              {module.lessons?.map((lesson: any, lessonIdx: number) => (
                <div key={lessonIdx} className="ml-4 mb-6">
                  <h3 className="text-xl font-medium mb-2">{lesson.title}</h3>
                  <div className="prose max-w-none text-gray-700">
                    {lesson.content}
                  </div>
                  
                  {lesson.quiz && (
                    <div className="mt-4 p-4 bg-blue-50 rounded">
                      <p className="font-medium mb-2">Quick Quiz:</p>
                      <p>{lesson.quiz.question}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
          
          <button
            onClick={() => {
              setStep('topic');
              setTopic('');
              setSkillLevel('');
              setGoal('');
              setTimeAvailable('');
              setGeneratedCourse(null);
            }}
            className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Generate Another Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Conversation History */}
        <div className="mb-8 space-y-4">
          {topic && (
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm mb-1">Topic:</p>
              <p className="text-gray-900 font-medium">{topic}</p>
            </div>
          )}
          {skillLevel && (
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm mb-1">Skill Level:</p>
              <p className="text-gray-900 font-medium">{skillLevel}</p>
            </div>
          )}
          {goal && (
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-600 text-sm mb-1">Goal:</p>
              <p className="text-gray-900 font-medium">{goal}</p>
            </div>
          )}
        </div>

        {/* Current Question */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {getQuestion()}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full px-6 py-4 text-lg text-gray-900 placeholder-gray-400 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none mb-4"
              autoFocus
              required
            />
            <button
              type="submit"
              disabled={!currentInput.trim()}
              className="w-full bg-indigo-600 text-white font-semibold py-4 px-8 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {step === 'time' ? 'Generate My Course → $5' : 'Continue →'}
            </button>
          </form>
        </div>

        <p className="text-center mt-4 text-gray-600 text-sm">
          Step {getStepNumber()} of 4
        </p>
      </div>
    </div>
  );
}
