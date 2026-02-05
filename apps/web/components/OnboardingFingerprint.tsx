'use client';

import { useState } from 'react';
import { LearnerFingerprint, isOnboardingComplete } from '@/lib/types';

type OnboardingStep = 
  | 'topic'
  | 'learningStyle' 
  | 'priorKnowledge'
  | 'learningGoal'
  | 'timeCommitment'
  | 'contentFormat'
  | 'challengePreference'
  | 'freeform'
  | 'review';

interface OnboardingQuestion {
  question: string;
  subtitle: string;
  options: Array<{
    value: string;
    label: string;
    emoji: string;
    description: string;
  }>;
}

const ONBOARDING_QUESTIONS: Record<Exclude<OnboardingStep, 'topic' | 'freeform' | 'review'>, OnboardingQuestion> = {
  learningStyle: {
    question: "How do you learn best?",
    subtitle: "Everyone absorbs information differently",
    options: [
      { value: 'visual', label: 'Visual Learner', emoji: '👁️', description: 'Charts, diagrams, images help me understand' },
      { value: 'reading', label: 'Reading/Writing', emoji: '📝', description: 'I learn by reading and taking notes' },
      { value: 'auditory', label: 'Listening', emoji: '🎧', description: 'I prefer explanations and discussions' },
      { value: 'kinesthetic', label: 'Hands-on', emoji: '🛠️', description: 'I learn by doing and practicing' },
      { value: 'mixed', label: 'Mix of Everything', emoji: '🎨', description: 'I like variety in learning methods' },
    ]
  },
  priorKnowledge: {
    question: "What's your current level?",
    subtitle: "Be honest - we'll meet you where you are",
    options: [
      { value: 'none', label: 'Complete Beginner', emoji: '🌱', description: "I've never studied this before" },
      { value: 'beginner', label: 'Beginner', emoji: '📚', description: 'I know the very basics' },
      { value: 'some_exposure', label: 'Some Exposure', emoji: '🎯', description: "I've encountered this but need structure" },
      { value: 'intermediate', label: 'Intermediate', emoji: '🚀', description: 'I have a decent foundation' },
      { value: 'advanced', label: 'Advanced', emoji: '⚡', description: 'I just need to fill specific gaps' },
    ]
  },
  learningGoal: {
    question: "Why are you learning this?",
    subtitle: "Your goal shapes the course",
    options: [
      { value: 'job_interview', label: 'Job Interview', emoji: '💼', description: 'I have an interview coming up' },
      { value: 'career', label: 'Career Growth', emoji: '📈', description: 'Building skills for my profession' },
      { value: 'sound_smart', label: 'Conversational Fluency', emoji: '🎤', description: 'I want to sound knowledgeable in discussions' },
      { value: 'academic', label: 'Academic/Test', emoji: '🎓', description: 'Studying for school or certification' },
      { value: 'hobby', label: 'Personal Interest', emoji: '🌟', description: 'Learning for fun and curiosity' },
      { value: 'teach_others', label: 'Teach Others', emoji: '👨‍🏫', description: 'I need to explain this to someone else' },
    ]
  },
  timeCommitment: {
    question: "How deep should we go?",
    subtitle: "Choose your course depth and reading time",
    options: [
      { value: '30_min', label: 'Quick Overview', emoji: '⚡', description: '~5 min read · 2 modules · Key points only' },
      { value: '1_hour', label: 'Solid Foundation', emoji: '📘', description: '~15 min read · 3 modules · Core concepts' },
      { value: '2_hours', label: 'Thorough Coverage', emoji: '📚', description: '~25 min read · 5 modules · Real depth' },
      { value: '1_week', label: 'Full Course', emoji: '🎓', description: '~45 min read · 8 modules · Complete curriculum' },
      { value: 'no_rush', label: 'Deep Mastery', emoji: '🏆', description: '~1 hr read · 10 modules · Expert-level' },
      { value: 'masterclass', label: 'Masterclass', emoji: '👑', description: '~2 hr read · 15 modules · Comprehensive mastery' },
    ]
  },
  contentFormat: {
    question: "What content style works for you?",
    subtitle: "How should we structure the material?",
    options: [
      { value: 'examples_first', label: 'Examples First', emoji: '🎯', description: 'Show me concrete cases, then explain why' },
      { value: 'theory_first', label: 'Theory First', emoji: '🧠', description: 'Explain concepts, then give examples' },
      { value: 'visual_diagrams', label: 'Visual & Diagrams', emoji: '📊', description: 'More charts, fewer walls of text' },
      { value: 'text_heavy', label: 'Detailed Text', emoji: '📖', description: 'Comprehensive written explanations' },
      { value: 'mixed', label: 'Mixed Approach', emoji: '🎨', description: 'Balance of all formats' },
    ]
  },
  challengePreference: {
    question: "How should we challenge you?",
    subtitle: "Pick your difficulty curve",
    options: [
      { value: 'easy_to_hard', label: 'Gradual Build-up', emoji: '📈', description: 'Start simple, progressively get harder' },
      { value: 'adaptive', label: 'Adaptive', emoji: '🎚️', description: 'Adjust based on my responses' },
      { value: 'deep_dive', label: 'Deep Dive', emoji: '🏊', description: 'Jump into advanced material quickly' },
      { value: 'practical_only', label: 'Practical Focus', emoji: '🔧', description: 'Skip theory, give me actionable skills' },
    ]
  },
};

export default function OnboardingFingerprint({ 
  onComplete,
  initialTopic
}: { 
  onComplete: (fingerprint: LearnerFingerprint) => void;
  initialTopic?: string;
}) {
  const [step, setStep] = useState<OnboardingStep>(initialTopic ? 'learningStyle' : 'topic');
  const [fingerprint, setFingerprint] = useState<Partial<LearnerFingerprint>>(
    initialTopic ? { topic: initialTopic } : {}
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [topic, setTopic] = useState(initialTopic || '');
  const [freeformText, setFreeformText] = useState('');

  const steps: OnboardingStep[] = [
    'topic',
    'learningStyle',
    'priorKnowledge',
    'learningGoal',
    'timeCommitment',
    'contentFormat',
    'challengePreference',
    'freeform',
    'review'
  ];

  const currentStepIndex = steps.indexOf(step);
  const progressPercent = Math.round((currentStepIndex / (steps.length - 1)) * 100);

  const handleTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      setFingerprint({ ...fingerprint, topic: topic.trim() });
      setStep('learningStyle');
    }
  };

  const handleOptionSelect = async (field: keyof LearnerFingerprint, value: string) => {
    setSelectedOption(value);
    await new Promise(resolve => setTimeout(resolve, 300));

    const updatedFingerprint = { ...fingerprint, [field]: value };
    setFingerprint(updatedFingerprint);
    setSelectedOption(null);

    // Move to next step
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const handleComplete = () => {
    const completion = isOnboardingComplete(fingerprint);
    if (completion.isComplete && completion.fingerprint) {
      completion.fingerprint.createdAt = new Date().toISOString();
      onComplete(completion.fingerprint);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      const prevStep = steps[currentStepIndex - 1];
      setStep(prevStep);
      setSelectedOption(null);
    }
  };

  // Topic Input (only shown if no initialTopic provided)
  if (step === 'topic') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #e8f0f9 0%, #d0e2f4 100%)' }}>
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight tracking-tight font-serif" style={{ color: 'var(--royal-blue)' }}>
              What would you<br/>like to study?
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
              Enter your subject of interest and we will construct a personalized curriculum
            </p>
          </div>

          <div className="glass rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 font-serif" style={{ color: 'var(--royal-blue)' }}>
              Subject of Study
            </h2>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">
              Enter your topic of interest — from supply chain management to quantum mechanics
            </p>
            
            <form onSubmit={handleTopicSubmit}>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Example: Game Theory for Strategic Business Decisions"
                className="w-full px-6 py-5 text-xl text-gray-900 placeholder-gray-400 glass rounded-2xl focus:ring-2 focus:outline-none mb-4 transition-all shadow-sm"
                style={{ borderColor: 'var(--royal-blue)' }}
                autoFocus
                required
              />
              <button
                type="submit"
                disabled={!topic.trim()}
                className="w-full text-white font-semibold text-lg py-5 px-8 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                style={{ backgroundColor: 'var(--royal-blue)' }}
                onMouseEnter={(e) => !topic.trim() || (e.currentTarget.style.backgroundColor = 'var(--royal-blue-light)')}
                onMouseLeave={(e) => !topic.trim() || (e.currentTarget.style.backgroundColor = 'var(--royal-blue)')}
              >
                Start Learning Journey →
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Free-form Context Step
  if (step === 'freeform') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #e8f0f9 0%, #d0e2f4 100%)' }}>
        <div className="max-w-2xl w-full">
          {/* Show topic at top */}
          {initialTopic && (
            <div className="mb-6 text-center">
              <p className="text-gray-600 text-sm mb-2">Building your course on</p>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--royal-blue)' }}>{initialTopic}</h2>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStepIndex} of {steps.length - 1}
              </span>
              <span className="text-sm font-medium" style={{ color: 'var(--royal-blue)' }}>
                {progressPercent}% Complete
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-500 rounded-full"
                style={{ 
                  width: `${progressPercent}%`,
                  backgroundColor: 'var(--royal-blue)'
                }}
              />
            </div>
          </div>

          <div className="glass rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold mb-4 font-serif" style={{ color: 'var(--royal-blue)' }}>
              Additional Context
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Provide any specific context, deadlines, or objectives that will help us tailor your course more precisely. This step is optional but recommended for optimal personalization.
            </p>

            <textarea
              value={freeformText}
              onChange={(e) => setFreeformText(e.target.value)}
              placeholder="Example: 'Strategy consulting interview scheduled for next week focusing on competitive scenarios and Nash equilibrium applications' or 'Manufacturing site visit requiring familiarity with assembly line optimization metrics'"
              className="w-full px-6 py-4 text-lg text-gray-900 placeholder-gray-400 glass rounded-2xl focus:ring-2 focus:outline-none mb-6 transition-all shadow-sm resize-none"
              style={{ 
                borderColor: 'var(--royal-blue)',
                minHeight: '180px'
              }}
              maxLength={500}
              autoFocus
            />
            
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {freeformText.length}/500 characters
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  // Skip - go to review
                  setStep('review');
                }}
                className="flex-1 px-6 py-4 border-2 rounded-xl font-semibold transition-all"
                style={{ 
                  borderColor: 'var(--royal-blue)',
                  color: 'var(--royal-blue)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 63, 135, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Skip
              </button>
              
              <button
                onClick={() => {
                  if (freeformText.trim()) {
                    setFingerprint({ ...fingerprint, context: freeformText.trim() });
                  }
                  setStep('review');
                }}
                className="flex-1 text-white font-semibold text-lg py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
                style={{ backgroundColor: 'var(--royal-blue)' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--royal-blue-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--royal-blue)')}
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Helper function to get display labels
  const getDisplayLabel = (value: string | undefined, options: any[]) => {
    if (!value) return '';
    const option = options.find(opt => opt.value === value);
    return option?.label || value;
  };

  // Review Step
  if (step === 'review') {
    const learningStyleLabel = getDisplayLabel(fingerprint.learningStyle, ONBOARDING_QUESTIONS.learningStyle.options);
    const priorKnowledgeLabel = getDisplayLabel(fingerprint.priorKnowledge, ONBOARDING_QUESTIONS.priorKnowledge.options);
    const learningGoalLabel = getDisplayLabel(fingerprint.learningGoal, ONBOARDING_QUESTIONS.learningGoal.options);
    const timeCommitmentLabel = getDisplayLabel(fingerprint.timeCommitment, ONBOARDING_QUESTIONS.timeCommitment.options);
    const contentFormatLabel = getDisplayLabel(fingerprint.contentFormat, ONBOARDING_QUESTIONS.contentFormat.options);
    const challengePreferenceLabel = getDisplayLabel(fingerprint.challengePreference, ONBOARDING_QUESTIONS.challengePreference.options);

    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #e8f0f9 0%, #d0e2f4 100%)' }}>
        <div className="max-w-2xl w-full">
          <div className="glass rounded-3xl p-10 shadow-2xl">
            {/* Header with topic */}
            <div className="text-center mb-8">
              <p className="text-sm text-gray-500 mb-2">Your personalized course on</p>
              <h2 className="text-2xl font-bold font-serif" style={{ color: 'var(--royal-blue)' }}>
                "{fingerprint.topic}"
              </h2>
            </div>

            {/* Profile grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-white rounded-lg p-4" style={{ border: '1px solid rgba(0, 63, 135, 0.08)' }}>
                <p className="text-xs text-gray-500 mb-1">Learning Style</p>
                <p className="text-sm font-semibold text-gray-900">{learningStyleLabel}</p>
              </div>
              <div className="bg-white rounded-lg p-4" style={{ border: '1px solid rgba(0, 63, 135, 0.08)' }}>
                <p className="text-xs text-gray-500 mb-1">Prior Knowledge</p>
                <p className="text-sm font-semibold text-gray-900">{priorKnowledgeLabel}</p>
              </div>
              <div className="bg-white rounded-lg p-4" style={{ border: '1px solid rgba(0, 63, 135, 0.08)' }}>
                <p className="text-xs text-gray-500 mb-1">Learning Goal</p>
                <p className="text-sm font-semibold text-gray-900">{learningGoalLabel}</p>
              </div>
              <div className="bg-white rounded-lg p-4" style={{ border: '1px solid rgba(0, 63, 135, 0.08)' }}>
                <p className="text-xs text-gray-500 mb-1">Course Depth</p>
                <p className="text-sm font-semibold text-gray-900">{timeCommitmentLabel}</p>
              </div>
              <div className="bg-white rounded-lg p-4" style={{ border: '1px solid rgba(0, 63, 135, 0.08)' }}>
                <p className="text-xs text-gray-500 mb-1">Content Format</p>
                <p className="text-sm font-semibold text-gray-900">{contentFormatLabel}</p>
              </div>
              <div className="bg-white rounded-lg p-4" style={{ border: '1px solid rgba(0, 63, 135, 0.08)' }}>
                <p className="text-xs text-gray-500 mb-1">Challenge Level</p>
                <p className="text-sm font-semibold text-gray-900">{challengePreferenceLabel}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep('learningStyle')}
                className="flex-1 py-4 rounded-xl font-medium transition-all border-2"
                style={{ borderColor: 'var(--royal-blue)', color: 'var(--royal-blue)' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 63, 135, 0.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Edit Preferences
              </button>
              <button
                onClick={handleComplete}
                className="flex-[2] text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
                style={{ backgroundColor: 'var(--royal-blue)' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--royal-blue-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--royal-blue)')}
              >
                Generate Course Outline
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Question Steps
  const currentQuestion = ONBOARDING_QUESTIONS[step as keyof typeof ONBOARDING_QUESTIONS];
  
  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #e8f0f9 0%, #d0e2f4 100%)' }}>
      <div className="max-w-2xl w-full">
        {/* Show topic at top */}
        {(fingerprint.topic || initialTopic) && (
          <div className="mb-6 text-center">
            <p className="text-gray-500 text-sm">
              Building your course on{' '}
              <span className="font-semibold" style={{ color: 'var(--royal-blue)' }}>
                "{fingerprint.topic || initialTopic}"
              </span>
            </p>
          </div>
        )}

        {/* Progress Bar with Back Button */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              {currentStepIndex > 1 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              )}
              <span className="text-sm font-medium text-gray-700">
                Step {currentStepIndex} of {steps.length - 1}
              </span>
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--royal-blue)' }}>
              {progressPercent}% Complete
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: 'var(--royal-blue)'
              }}
            />
          </div>
        </div>

        <div className="glass rounded-3xl p-12 shadow-2xl">
          <h2 className="text-4xl font-bold mb-4 font-serif" style={{ color: 'var(--royal-blue)' }}>
            {currentQuestion.question}
          </h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            {currentQuestion.subtitle}
          </p>

          <div className="space-y-2">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionSelect(step as keyof LearnerFingerprint, option.value)}
                disabled={selectedOption !== null}
                className={`
                  group relative bg-white rounded-lg py-3 px-4
                  transition-all duration-150 w-full text-left
                  ${selectedOption === option.value
                    ? 'shadow-sm'
                    : 'hover:shadow-sm'
                  }
                  ${selectedOption !== null && selectedOption !== option.value ? 'opacity-40' : ''}
                `}
                style={{
                  border: selectedOption === option.value
                    ? '1.5px solid var(--royal-blue)'
                    : '1px solid rgba(0, 63, 135, 0.1)',
                  backgroundColor: selectedOption === option.value
                    ? 'rgba(0, 63, 135, 0.02)'
                    : 'white'
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Minimal radio indicator */}
                  <div
                    className="w-4 h-4 rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center transition-all duration-150"
                    style={{
                      borderColor: selectedOption === option.value ? 'var(--royal-blue)' : 'rgba(0, 63, 135, 0.25)'
                    }}
                  >
                    {selectedOption === option.value && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: 'var(--royal-blue)' }}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span
                      className="text-[15px] font-medium transition-colors duration-150"
                      style={{ color: selectedOption === option.value ? 'var(--royal-blue)' : '#374151' }}
                    >
                      {option.label}
                    </span>
                    <span className="text-[13px] text-gray-400 ml-2">
                      {option.description}
                    </span>
                  </div>

                  {selectedOption === option.value && (
                    <svg
                      className="w-4 h-4 flex-shrink-0"
                      fill="none"
                      stroke="var(--royal-blue)"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
