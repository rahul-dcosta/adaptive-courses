'use client';

import { useState } from 'react';

type Step = 'topic' | 'situation' | 'timeline' | 'goal' | 'generating' | 'complete';

interface OptionButton {
  label: string;
  value: string;
  emoji?: string;
}

const SITUATIONS: OptionButton[] = [
  { label: 'Visiting a factory', value: 'visiting_factory', emoji: '🏭' },
  { label: 'Job interview', value: 'job_interview', emoji: '💼' },
  { label: 'Career switch', value: 'career_switch', emoji: '🔄' },
  { label: 'Just curious', value: 'curious', emoji: '🤔' }
];

const TIMELINES: OptionButton[] = [
  { label: 'Tomorrow', value: 'tomorrow', emoji: '🔥' },
  { label: 'This week', value: 'this_week', emoji: '📅' },
  { label: 'No rush', value: 'no_rush', emoji: '🧘' }
];

const GOALS: OptionButton[] = [
  { label: 'Sound smart', value: 'sound_smart', emoji: '🎯' },
  { label: 'Ask good questions', value: 'ask_questions', emoji: '❓' },
  { label: 'Actually understand it', value: 'understand', emoji: '🧠' }
];

export default function CourseBuilderNew() {
  const [step, setStep] = useState<Step>('topic');
  const [topic, setTopic] = useState('');
  const [situation, setSituation] = useState('');
  const [timeline, setTimeline] = useState('');
  const [goal, setGoal] = useState('');
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
    try {
      // Map the vibe selections to API params
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

  const OptionButtons = ({ options, onSelect }: { options: OptionButton[], onSelect: (value: string) => void }) => (
    <div className="grid grid-cols-1 gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className="group relative bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all duration-200 text-left"
        >
          <div className="flex items-center gap-4">
            {option.emoji && (
              <span className="text-3xl group-hover:scale-110 transition-transform">
                {option.emoji}
              </span>
            )}
            <span className="text-lg font-medium text-gray-900 group-hover:text-indigo-600">
              {option.label}
            </span>
          </div>
        </button>
      ))}
    </div>
  );

  if (step === 'generating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900">Crafting your course...</h2>
          <p className="text-gray-600 mt-2">This will take about 30-60 seconds</p>
        </div>
      </div>
    );
  }

  if (step === 'complete' && generatedCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Course Header */}
          <div className="bg-white rounded-t-2xl shadow-xl p-6 md:p-8 border-b-4 border-indigo-600">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {generatedCourse.title}
            </h1>
            {generatedCourse.estimated_time && (
              <p className="text-gray-600 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {generatedCourse.estimated_time}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-white px-6 md:px-8 py-4 flex gap-3 flex-wrap border-b">
            <button
              onClick={() => alert('PDF export coming soon!')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
            <button
              onClick={() => alert('Email delivery coming soon!')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Me This
            </button>
          </div>

          {/* Course Content */}
          <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-8">
            {generatedCourse.modules?.map((module: any, idx: number) => (
              <div key={idx} className="mb-10 last:mb-0">
                <div className="flex items-start gap-3 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {module.title}
                    </h2>
                    {module.description && (
                      <p className="text-gray-600 mt-1">{module.description}</p>
                    )}
                  </div>
                </div>
                
                {module.lessons?.map((lesson: any, lessonIdx: number) => (
                  <div key={lessonIdx} className="ml-0 md:ml-13 mb-8 last:mb-0 pl-6 border-l-2 border-gray-200">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      {lesson.title}
                    </h3>
                    <div className="prose max-w-none text-gray-700 leading-relaxed mb-4">
                      {lesson.content}
                    </div>
                    
                    {lesson.quiz && (
                      <div className="mt-4 p-5 bg-indigo-50 rounded-xl border-l-4 border-indigo-600">
                        <p className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Quick Check:
                        </p>
                        <p className="text-gray-800">{lesson.quiz.question}</p>
                        {lesson.quiz.answer && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                              Show answer
                            </summary>
                            <p className="mt-2 text-gray-700 text-sm">{lesson.quiz.answer}</p>
                          </details>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}

            {/* Next Steps */}
            {generatedCourse.next_steps && generatedCourse.next_steps.length > 0 && (
              <div className="mt-10 p-6 bg-green-50 rounded-xl border-l-4 border-green-600">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  What's Next?
                </h3>
                <ul className="space-y-2">
                  {generatedCourse.next_steps.map((step: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <span className="text-green-600 font-bold mt-1">→</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="mt-6 flex gap-4 flex-wrap">
            <button
              onClick={() => {
                setStep('topic');
                setTopic('');
                setSituation('');
                setTimeline('');
                setGoal('');
                setGeneratedCourse(null);
              }}
              className="flex-1 min-w-[200px] bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Generate Another Course
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition border-2 border-gray-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress breadcrumbs */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className={`px-3 py-1 rounded-full ${step !== 'topic' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-400'}`}>
              {topic || 'Topic'}
            </div>
            {situation && (
              <>
                <span className="text-gray-400">→</span>
                <div className="px-3 py-1 rounded-full bg-indigo-600 text-white">
                  {SITUATIONS.find(s => s.value === situation)?.label}
                </div>
              </>
            )}
            {timeline && (
              <>
                <span className="text-gray-400">→</span>
                <div className="px-3 py-1 rounded-full bg-indigo-600 text-white">
                  {TIMELINES.find(t => t.value === timeline)?.label}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {step === 'topic' && (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What do you want to learn?
              </h2>
              <p className="text-gray-600 mb-6">
                Type anything — from "supply chain" to "how nuclear reactors work"
              </p>
              <form onSubmit={handleTopicSubmit}>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., manufacturing operations"
                  className="w-full px-6 py-4 text-lg text-gray-900 placeholder-gray-400 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none mb-4"
                  autoFocus
                  required
                />
                <button
                  type="submit"
                  disabled={!topic.trim()}
                  className="w-full bg-indigo-600 text-white font-semibold py-4 px-8 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Continue →
                </button>
              </form>
            </>
          )}

          {step === 'situation' && (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                What's the situation?
              </h2>
              <p className="text-gray-600 mb-6">
                Help us understand the vibe
              </p>
              <OptionButtons options={SITUATIONS} onSelect={handleSituationClick} />
            </>
          )}

          {step === 'timeline' && (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                When do you need this?
              </h2>
              <p className="text-gray-600 mb-6">
                Your deadline shapes the depth
              </p>
              <OptionButtons options={TIMELINES} onSelect={handleTimelineClick} />
            </>
          )}

          {step === 'goal' && (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                What's the goal?
              </h2>
              <p className="text-gray-600 mb-6">
                What does success look like?
              </p>
              <OptionButtons options={GOALS} onSelect={handleGoalClick} />
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  After you select, we'll generate your course (takes ~30 sec)
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
