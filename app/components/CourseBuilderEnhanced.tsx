'use client';

import { useState, useEffect } from 'react';
import { analytics } from '@/lib/analytics';
import ProgressBreadcrumbs from './ProgressBreadcrumbs';
import LoadingSpinner from './LoadingSpinner';
import SuccessCelebration from './SuccessCelebration';
import CoursePreview from './CoursePreview';

type Step = 'topic' | 'situation' | 'timeline' | 'goal' | 'generating' | 'celebration' | 'preview' | 'complete';

const SITUATIONS = [
  { 
    label: 'Visiting a factory', 
    value: 'visiting_factory', 
    emoji: '🏭', 
    color: 'from-orange-400 to-red-500',
    description: 'Learn the lingo before your tour'
  },
  { 
    label: 'Job interview', 
    value: 'job_interview', 
    emoji: '💼', 
    color: 'from-blue-400 to-indigo-500',
    description: 'Sound confident and knowledgeable'
  },
  { 
    label: 'Career switch', 
    value: 'career_switch', 
    emoji: '🔄', 
    color: 'from-purple-400 to-pink-500',
    description: 'Fast-track your transition'
  },
  { 
    label: 'Just curious', 
    value: 'curious', 
    emoji: '🤔', 
    color: 'from-green-400 to-teal-500',
    description: 'Explore something new'
  }
];

const TIMELINES = [
  { 
    label: 'Tomorrow', 
    value: 'tomorrow', 
    emoji: '🔥', 
    color: 'from-red-400 to-orange-500',
    description: 'Crash course - get ready fast'
  },
  { 
    label: 'This week', 
    value: 'this_week', 
    emoji: '📅', 
    color: 'from-blue-400 to-cyan-500',
    description: 'Balanced pace with depth'
  },
  { 
    label: 'No rush', 
    value: 'no_rush', 
    emoji: '🧘', 
    color: 'from-green-400 to-emerald-500',
    description: 'Deep dive at your pace'
  }
];

const GOALS = [
  { 
    label: 'Sound smart', 
    value: 'sound_smart', 
    emoji: '🎯', 
    color: 'from-yellow-400 to-orange-500',
    description: 'Speak confidently on the topic'
  },
  { 
    label: 'Ask good questions', 
    value: 'ask_questions', 
    emoji: '❓', 
    color: 'from-cyan-400 to-blue-500',
    description: 'Know what to ask and why'
  },
  { 
    label: 'Actually understand it', 
    value: 'understand', 
    emoji: '🧠', 
    color: 'from-purple-400 to-indigo-500',
    description: 'Master the fundamentals'
  }
];

export default function CourseBuilderEnhanced() {
  const [step, setStep] = useState<Step>('topic');
  const [topic, setTopic] = useState('');
  const [situation, setSituation] = useState('');
  const [timeline, setTimeline] = useState('');
  const [goal, setGoal] = useState('');
  const [generatedCourse, setGeneratedCourse] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const getStepNumber = () => {
    const stepMap: Record<Step, number> = {
      topic: 1,
      situation: 2,
      timeline: 3,
      goal: 4,
      generating: 4,
      celebration: 4,
      preview: 4,
      complete: 4
    };
    return stepMap[step];
  };

  const handleTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      analytics.track('topic_entered', { topic });
      setStep('situation');
    }
  };

  const handleOptionClick = async (value: string, nextStep: Step) => {
    // Visual feedback
    setSelectedOption(value);
    
    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 400));
    
    setSelectedOption(null);
    
    if (nextStep === 'timeline') {
      setSituation(value);
      analytics.track('situation_selected', { situation: value });
    } else if (nextStep === 'goal') {
      setTimeline(value);
      analytics.track('timeline_selected', { timeline: value });
    } else if (nextStep === 'generating') {
      setGoal(value);
      analytics.track('goal_selected', { goal: value });
      await generateCourse(value);
      return;
    }
    
    setStep(nextStep);
  };

  const generateCourse = async (selectedGoal: string) => {
    setStep('generating');
    const startTime = Date.now();
    
    try {
      analytics.courseStarted(topic);
      
      const skillLevel = situation === 'curious' ? 'beginner' : 
                        situation === 'career_switch' ? 'intermediate' : 'advanced';
      
      const timeAvailable = timeline === 'tomorrow' ? '2 hours' :
                           timeline === 'this_week' ? '1 hour/day for a week' :
                           '30 min/day';

      const response = await fetch('/api/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          skillLevel,
          goal: selectedGoal,
          timeAvailable
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
    } catch (error: any) {
      console.error('Generation failed:', error);
      alert(`Failed to generate course: ${error.message || 'Unknown error'}`);
      setStep('topic');
    }
  };

  // Loading state
  if (step === 'generating') {
    return <LoadingSpinner topic={topic} />;
  }

  // Success celebration
  if (step === 'celebration') {
    return (
      <SuccessCelebration 
        courseTitle={generatedCourse?.title || topic}
        onContinue={() => setStep('preview')}
      />
    );
  }

  // Course preview
  if (step === 'preview') {
    return (
      <CoursePreview
        course={generatedCourse}
        isFree={true}
        onUnlock={() => {
          // TODO: Integrate Stripe checkout
          alert('Stripe payment coming soon!');
        }}
      />
    );
  }

  // Topic input
  if (step === 'topic') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8 md:mb-12 px-2">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 md:mb-6 leading-tight">
              Learn Anything<br/>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                in 30 Minutes
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-cyan-200">
              AI-powered courses tailored to YOUR situation
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12">
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
                placeholder="e.g., manufacturing operations"
                className="w-full px-4 sm:px-6 py-4 sm:py-5 text-lg sm:text-xl text-gray-900 placeholder-gray-400 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none mb-4 transition-all"
                autoFocus
                required
              />
              <button
                type="submit"
                disabled={!topic.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-6 sm:px-8 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl min-h-[56px]"
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

  // Option selection card
  const OptionCard = ({ option, onSelect, isSelected }: any) => (
    <button
      onClick={() => onSelect(option.value)}
      disabled={selectedOption !== null}
      className={`
        group relative overflow-hidden bg-white rounded-2xl p-6 border-2 
        transition-all duration-300 transform w-full text-left
        ${isSelected 
          ? 'border-indigo-600 scale-95 shadow-2xl' 
          : 'border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
        }
        ${selectedOption !== null ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className={`
        absolute inset-0 bg-gradient-to-r ${option.color} opacity-0 
        transition-opacity duration-300
        ${isSelected ? 'opacity-20' : 'group-hover:opacity-10'}
      `}></div>
      
      <div className="relative flex items-start gap-4">
        <span className={`
          text-5xl transition-transform duration-300
          ${isSelected ? 'scale-110' : 'group-hover:scale-110'}
        `}>
          {option.emoji}
        </span>
        <div className="flex-1">
          <h3 className={`
            text-xl font-semibold mb-1 transition-all duration-300
            ${isSelected 
              ? 'text-transparent bg-gradient-to-r bg-clip-text from-indigo-600 to-purple-600' 
              : 'text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-indigo-600 group-hover:to-purple-600'
            }
          `}>
            {option.label}
          </h3>
          <p className="text-sm text-gray-600">{option.description}</p>
        </div>
        
        {isSelected && (
          <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-scale-in">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <ProgressBreadcrumbs currentStep={getStepNumber()} totalSteps={4} />
          
          {step === 'situation' && (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                What's the situation?
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                💡 This helps us tailor the course to what you actually need
              </p>
              <div className="space-y-4">
                {SITUATIONS.map((option) => (
                  <OptionCard 
                    key={option.value} 
                    option={option} 
                    onSelect={(value: string) => handleOptionClick(value, 'timeline')}
                    isSelected={selectedOption === option.value}
                  />
                ))}
              </div>
            </>
          )}

          {step === 'timeline' && (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                When do you need this?
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                💡 Your deadline shapes how deep we go
              </p>
              <div className="space-y-4">
                {TIMELINES.map((option) => (
                  <OptionCard 
                    key={option.value} 
                    option={option} 
                    onSelect={(value: string) => handleOptionClick(value, 'goal')}
                    isSelected={selectedOption === option.value}
                  />
                ))}
              </div>
            </>
          )}

          {step === 'goal' && (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                What's the goal?
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                💡 What does success look like for you?
              </p>
              <div className="space-y-4">
                {GOALS.map((option) => (
                  <OptionCard 
                    key={option.value} 
                    option={option} 
                    onSelect={(value: string) => handleOptionClick(value, 'generating')}
                    isSelected={selectedOption === option.value}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
