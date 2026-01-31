'use client';

import { useState, useEffect } from 'react';
import { analytics } from '@/lib/analytics';
import ProgressBreadcrumbs from './ProgressBreadcrumbs';
import LoadingSpinner from './LoadingSpinner';
import SuccessCelebration from './SuccessCelebration';
import CourseViewer from './CourseViewer';

type Step = 'topic' | 'context' | 'timeline' | 'depth' | 'generating' | 'celebration' | 'preview' | 'complete';

interface QuestionData {
  question: string;
  subtitle: string;
  options: Array<{
    label: string;
    value: string;
    emoji: string;
    description: string;
  }>;
}

export default function CourseBuilderSmart({ initialTopic }: { initialTopic?: string }) {
  const [step, setStep] = useState<Step>(initialTopic ? 'context' : 'topic');
  const [topic, setTopic] = useState(initialTopic || '');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [generatedCourse, setGeneratedCourse] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // AI-generated questions
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);

  const getStepNumber = () => {
    const stepMap: Record<Step, number> = {
      topic: 1,
      context: 2,
      timeline: 3,
      depth: 4,
      generating: 4,
      celebration: 4,
      preview: 4,
      complete: 4
    };
    return stepMap[step];
  };

  // Load AI-generated question when step changes
  useEffect(() => {
    if (step === 'context' || step === 'timeline' || step === 'depth') {
      loadQuestion(step);
    }
  }, [step, topic]);

  const loadQuestion = async (currentStep: 'context' | 'timeline' | 'depth') => {
    setLoadingQuestion(true);
    try {
      const response = await fetch('/api/generate-onboarding-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          step: currentStep,
          previousAnswers: answers
        })
      });

      if (!response.ok) throw new Error('Failed to generate question');

      const data = await response.json();
      setCurrentQuestion(data);
    } catch (error) {
      console.error('Error loading question:', error);
      // Fallback to generic question
      setCurrentQuestion({
        question: currentStep === 'context' ? 'Why are you learning this?' :
                  currentStep === 'timeline' ? 'When do you need this?' :
                  'What level do you need?',
        subtitle: 'Help us personalize your course',
        options: [
          { label: 'Option 1', value: 'opt1', emoji: '✨', description: 'First option' },
          { label: 'Option 2', value: 'opt2', emoji: '🚀', description: 'Second option' },
          { label: 'Option 3', value: 'opt3', emoji: '💡', description: 'Third option' },
          { label: 'Option 4', value: 'opt4', emoji: '🎯', description: 'Fourth option' }
        ]
      });
    } finally {
      setLoadingQuestion(false);
    }
  };

  const handleTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      analytics.track('topic_entered', { topic });
      setStep('context');
    }
  };

  const handleOptionClick = async (value: string, nextStep: Step) => {
    setSelectedOption(value);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Save answer
    setAnswers(prev => ({ ...prev, [step]: value }));
    setSelectedOption(null);
    
    if (nextStep === 'generating') {
      await generateCourse();
    } else {
      setStep(nextStep);
    }
  };

  const generateCourse = async () => {
    setStep('generating');
    const startTime = Date.now();
    
    try {
      analytics.courseStarted(topic);
      
      const response = await fetch('/api/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          context: answers.context,
          timeline: answers.timeline,
          depth: answers.depth,
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status}`);
      }
      
      const duration = Date.now() - startTime;
      analytics.courseGenerated(topic, duration);
      
      setGeneratedCourse(data.course);
      setStep('celebration');
      
      setTimeout(() => setStep('preview'), 2000);
    } catch (error: any) {
      console.error('Course generation failed:', error);
      alert(`Failed to generate course: ${error.message}`);
      setStep('depth');
    }
  };

  // Loading state
  if (step === 'generating') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <LoadingSpinner />
      </div>
    );
  }

  // Celebration
  if (step === 'celebration') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <SuccessCelebration onContinue={() => setStep('preview')} courseTitle={topic} />
      </div>
    );
  }

  // Course preview
  if (step === 'preview' && generatedCourse) {
    return <CourseViewer course={generatedCourse} />;
  }

  // Topic input
  if (step === 'topic') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8 md:mb-12 px-2">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-gray-900 mb-4 md:mb-6 leading-tight tracking-tight">
              Learn Anything<br/>
              in 30 Minutes
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600">
              AI-powered courses tailored to YOUR situation
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 md:p-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
              What do you want to learn?
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 md:mb-6">
              💡 Type anything — from "supply chain" to "quantum physics"
            </p>
            
            <form onSubmit={handleTopicSubmit}>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Egyptian civilization"
                className="w-full px-4 sm:px-6 py-4 sm:py-5 text-lg sm:text-xl text-gray-900 placeholder-gray-400 border-2 border-gray-200 rounded-2xl focus:border-gray-900 focus:ring-4 focus:ring-gray-100 focus:outline-none mb-4 transition-all"
                autoFocus
                required
              />
              <button
                type="submit"
                disabled={!topic.trim()}
                className="w-full bg-gray-900 text-white font-medium text-base sm:text-lg py-4 sm:py-5 px-6 sm:px-8 rounded-lg hover:bg-gray-800 active:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[56px]"
              >
                Continue →
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="text-2xl">🚀</span>
              <p className="text-sm text-gray-600">
                <strong>Early Access</strong> • First course FREE
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AI-generated questions (context, timeline, depth)
  const OptionCard = ({ option, onSelect, isSelected }: any) => (
    <button
      onClick={() => onSelect(option.value)}
      disabled={selectedOption !== null}
      className={`
        group relative overflow-hidden bg-white rounded-2xl p-6 border-2 
        transition-all duration-300 transform w-full text-left
        ${isSelected 
          ? 'border-gray-900 scale-95 shadow-2xl' 
          : 'border-gray-200 hover:border-gray-900 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
        }
        ${selectedOption !== null ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className="relative flex items-start gap-4">
        <span className={`
          text-5xl transition-transform duration-300
          ${isSelected ? 'scale-110' : 'group-hover:scale-110'}
        `}>
          {option.emoji}
        </span>
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-1 text-gray-900">
            {option.label}
          </h3>
          <p className="text-sm text-gray-600">{option.description}</p>
        </div>
        
        {isSelected && (
          <div className="absolute top-4 right-4 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 md:p-12">
          <ProgressBreadcrumbs currentStep={getStepNumber()} totalSteps={4} />
          
          {initialTopic && step === 'context' && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-gray-900 text-lg">
                <span className="font-semibold">Cool! You want to learn:</span> {topic}
              </p>
            </div>
          )}

          {loadingQuestion ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-gray-900"></div>
              <p className="mt-4 text-gray-600">Generating smart questions...</p>
            </div>
          ) : currentQuestion && (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {currentQuestion.question}
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                💡 {currentQuestion.subtitle}
              </p>
              <div className="space-y-4">
                {currentQuestion.options.map((option) => (
                  <OptionCard 
                    key={option.value} 
                    option={option} 
                    onSelect={(value: string) => handleOptionClick(
                      value, 
                      step === 'context' ? 'timeline' : step === 'timeline' ? 'depth' : 'generating'
                    )}
                    isSelected={selectedOption === option.value}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
