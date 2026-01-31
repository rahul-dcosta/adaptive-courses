'use client';

import { useState, useEffect } from 'react';
import { analytics } from '@/lib/analytics';

type Step = 'topic' | 'situation' | 'timeline' | 'goal' | 'generating' | 'email-gate' | 'complete';

const SITUATIONS = [
  { label: 'Visiting a factory', value: 'visiting_factory', emoji: '🏭', color: 'from-orange-400 to-red-500' },
  { label: 'Job interview', value: 'job_interview', emoji: '💼', color: 'from-blue-400 to-indigo-500' },
  { label: 'Career switch', value: 'career_switch', emoji: '🔄', color: 'from-purple-400 to-pink-500' },
  { label: 'Just curious', value: 'curious', emoji: '🤔', color: 'from-green-400 to-teal-500' }
];

const TIMELINES = [
  { label: 'Tomorrow', value: 'tomorrow', emoji: '🔥', color: 'from-red-400 to-orange-500' },
  { label: 'This week', value: 'this_week', emoji: '📅', color: 'from-blue-400 to-cyan-500' },
  { label: 'No rush', value: 'no_rush', emoji: '🧘', color: 'from-green-400 to-emerald-500' }
];

const GOALS = [
  { label: 'Sound smart', value: 'sound_smart', emoji: '🎯', color: 'from-yellow-400 to-orange-500' },
  { label: 'Ask good questions', value: 'ask_questions', emoji: '❓', color: 'from-cyan-400 to-blue-500' },
  { label: 'Actually understand it', value: 'understand', emoji: '🧠', color: 'from-purple-400 to-indigo-500' }
];

export default function CourseBuilderV2() {
  const [step, setStep] = useState<Step>('topic');
  const [topic, setTopic] = useState('');
  const [situation, setSituation] = useState('');
  const [timeline, setTimeline] = useState('');
  const [goal, setGoal] = useState('');
  const [email, setEmail] = useState('');
  const [generatedCourse, setGeneratedCourse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      setStep('situation');
    }
  };

  const handleSituationClick = (value: string) => {
    setSituation(value);
    setStep('timeline');
  };

  const handleTimelineClick = (value: string) => {
    setTimeline(value);
    setStep('goal');
  };

  const handleGoalClick = async (value: string) => {
    setGoal(value);
    setStep('generating');
    await generateCourse(value);
  };

  const generateCourse = async (selectedGoal: string) => {
    setLoading(true);
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
      setStep('email-gate'); // Show email gate AFTER generation
    } catch (error: any) {
      console.error('Generation failed:', error);
      alert(`Failed to generate course: ${error.message || 'Unknown error'}`);
      setStep('topic');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Save email and course
    // TODO: Create user account, save course to their dashboard
    setStep('complete');
  };

  if (step === 'generating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full w-24 h-24 flex items-center justify-center">
                <svg className="w-12 h-12 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-3">
              Crafting Your Course
            </h2>
            <p className="text-cyan-200 text-lg">This takes 30-60 seconds</p>
          </div>
          
          <div className="space-y-3 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            {[
              { label: 'Analyzing your topic...', done: true },
              { label: 'Structuring modules...', done: false },
              { label: 'Writing lessons...', done: false },
              { label: 'Creating quizzes...', done: false }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  item.done ? 'bg-green-400' : 'bg-white/20'
                } transition-colors duration-300`}>
                  {item.done && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`${item.done ? 'text-white' : 'text-white/60'} transition-colors duration-300`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'email-gate') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Your Course is Ready! 🎉
            </h2>
            <p className="text-gray-600 text-lg">
              Enter your email to save it to your dashboard
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-6 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-8 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105 shadow-lg"
            >
              Save My Course →
            </button>
          </form>

          <div className="mt-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
            <p className="text-sm text-gray-700 text-center">
              ✨ <strong>This course is FREE!</strong> Every course after is just $2.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Topic input with sexy gradient background
  if (step === 'topic') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Learn Anything<br/>
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                in 30 Minutes
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-cyan-200">
              AI-powered courses tailored to YOUR situation
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              What do you want to learn?
            </h2>
            <p className="text-gray-600 mb-6">
              Type anything — from "supply chain" to "quantum physics"
            </p>
            
            <form onSubmit={handleTopicSubmit}>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., manufacturing operations"
                className="w-full px-6 py-5 text-xl text-gray-900 placeholder-gray-400 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none mb-4 transition"
                autoFocus
                required
              />
              <button
                type="submit"
                disabled={!topic.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg py-5 px-8 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                Continue →
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
              ✨ Your first course is <strong>FREE</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Situation/Timeline/Goal steps with gradient cards
  const OptionCard = ({ option, onSelect }: any) => (
    <button
      onClick={() => onSelect(option.value)}
      className="group relative overflow-hidden bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-100 hover:border-transparent"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
      <div className="relative flex items-center gap-4">
        <span className="text-5xl group-hover:scale-110 transition-transform">{option.emoji}</span>
        <span className="text-xl font-semibold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-indigo-600 group-hover:to-purple-600 transition">
          {option.label}
        </span>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          {step === 'situation' && (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                What's the situation?
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Help us understand the vibe
              </p>
              <div className="space-y-4">
                {SITUATIONS.map((option) => (
                  <OptionCard key={option.value} option={option} onSelect={handleSituationClick} />
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
                Your deadline shapes the depth
              </p>
              <div className="space-y-4">
                {TIMELINES.map((option) => (
                  <OptionCard key={option.value} option={option} onSelect={handleTimelineClick} />
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
                What does success look like?
              </p>
              <div className="space-y-4">
                {GOALS.map((option) => (
                  <OptionCard key={option.value} option={option} onSelect={handleGoalClick} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
