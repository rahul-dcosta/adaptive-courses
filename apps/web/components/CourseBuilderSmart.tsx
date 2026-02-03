'use client';

import { useState, Component, ReactNode } from 'react';
import { analytics } from '@/lib/analytics';
import LoadingSpinner from './LoadingSpinner';
import SuccessCelebration from './SuccessCelebration';
import CourseViewer from './CourseViewer';
import OnboardingFingerprint from './OnboardingFingerprint';
import CourseOutlinePreview from './CourseOutlinePreview';
import { ApiError } from './ApiError';
import { LearnerFingerprint, CourseContent, CourseOutline, getErrorMessage } from '@/lib/types';

type Step = 'onboarding' | 'generating-outline' | 'outline-preview' | 'generating-full' | 'celebration' | 'preview' | 'error';

// Error state interface
interface ErrorState {
  message: string;
  step: Step;
}

// Error Boundary for CourseBuilder
interface ErrorBoundaryProps {
  children: ReactNode;
  onReset: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class CourseBuilderErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('CourseBuilder error:', error, errorInfo);
    analytics.track('course_builder_error', {
      error: error.message,
      componentStack: errorInfo.componentStack?.slice(0, 500)
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #e8f0f9 0%, #ffffff 100%)' }}>
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3 font-serif">Something Went Wrong</h2>
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Please try again.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 rounded-xl text-left">
                <p className="text-xs text-red-700 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <button
              onClick={() => {
                this.setState({ hasError: false, error: undefined });
                this.props.onReset();
              }}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl"
              style={{ backgroundColor: 'var(--royal-blue)' }}
            >
              Start Over
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function CourseBuilderContent({ initialTopic }: { initialTopic?: string }) {
  const [step, setStep] = useState<Step>('onboarding');
  const [generatedCourse, setGeneratedCourse] = useState<CourseContent | null>(null);
  const [courseOutline, setCourseOutline] = useState<CourseOutline | null>(null);
  const [fingerprint, setFingerprint] = useState<LearnerFingerprint | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);

  const handleFingerprintComplete = async (completedFingerprint: LearnerFingerprint) => {
    setFingerprint(completedFingerprint);
    setError(null); // Clear any previous errors
    generateOutline(completedFingerprint);
  };

  const generateOutline = async (fp: LearnerFingerprint, previousOutline?: CourseOutline | null, userFeedback?: string) => {
    setStep('generating-outline');
    setIsRegenerating(!!userFeedback); // Only true if regenerating with feedback
    setError(null);

    try {
      analytics.track('outline_generation_started', { topic: fp.topic });

      const response = await fetch('/api/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: fp.topic,
          learningStyle: fp.learningStyle,
          priorKnowledge: fp.priorKnowledge,
          learningGoal: fp.learningGoal,
          timeCommitment: fp.timeCommitment,
          contentFormat: fp.contentFormat,
          challengePreference: fp.challengePreference,
          context: fp.context || '',
          previousOutline: previousOutline || null,
          feedback: userFeedback || null
        })
      });

      // Handle network errors
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const errorMessage = data.error || getNetworkErrorMessage(response.status);
        throw new Error(errorMessage);
      }

      const data = await response.json();

      analytics.track('outline_generated', {
        topic: fp.topic,
        isRevision: !!userFeedback
      });

      setCourseOutline(data.outline);
      setStep('outline-preview');
      setIsRegenerating(false);
    } catch (error: unknown) {
      console.error('Outline generation failed:', error);
      const errorMessage = getErrorMessage(error);
      analytics.track('outline_generation_failed', {
        topic: fp.topic,
        error: errorMessage
      });
      setError({ message: errorMessage, step: 'onboarding' });
      setStep('error');
      setIsRegenerating(false);
    }
  };

  const handleOutlineApproved = async () => {
    if (!fingerprint || !courseOutline) return;

    setStep('generating-full');
    setError(null);
    const startTime = Date.now();

    try {
      analytics.track('outline_approved', { topic: fingerprint.topic });
      analytics.courseStarted(fingerprint.topic);

      const response = await fetch('/api/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: fingerprint.topic,
          learningStyle: fingerprint.learningStyle,
          priorKnowledge: fingerprint.priorKnowledge,
          learningGoal: fingerprint.learningGoal,
          timeCommitment: fingerprint.timeCommitment,
          contentFormat: fingerprint.contentFormat,
          challengePreference: fingerprint.challengePreference,
          context: fingerprint.context || '',
          approvedOutline: courseOutline // Pass approved outline to guide generation
        })
      });

      // Handle network errors
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const errorMessage = data.error || getNetworkErrorMessage(response.status);
        throw new Error(errorMessage);
      }

      const data = await response.json();

      const duration = Date.now() - startTime;
      analytics.courseGenerated(fingerprint.topic, duration);

      setGeneratedCourse(data.course);
      setStep('celebration');

      setTimeout(() => setStep('preview'), 2000);
    } catch (error: unknown) {
      console.error('Course generation failed:', error);
      const errorMessage = getErrorMessage(error);
      analytics.track('course_generation_failed', {
        topic: fingerprint.topic,
        error: errorMessage
      });
      setError({ message: errorMessage, step: 'outline-preview' });
      setStep('error');
    }
  };

  // Helper to get user-friendly network error messages
  const getNetworkErrorMessage = (status: number): string => {
    switch (status) {
      case 503:
        return 'Service temporarily unavailable. We are working on it - please try again in a few minutes.';
      case 500:
        return 'Something went wrong on our end. Please try again.';
      case 429:
        return 'Too many requests. Please wait a moment before trying again.';
      case 408:
        return 'The request timed out. Please check your connection and try again.';
      case 400:
        return 'Invalid request. Please check your input and try again.';
      default:
        return `An error occurred (${status}). Please try again.`;
    }
  };

  // Handle error recovery
  const handleErrorRetry = () => {
    if (error && fingerprint) {
      if (error.step === 'onboarding') {
        // Retry outline generation
        generateOutline(fingerprint);
      } else if (error.step === 'outline-preview') {
        // Retry course generation
        handleOutlineApproved();
      } else {
        // Go back to onboarding
        setStep('onboarding');
        setError(null);
      }
    } else {
      setStep('onboarding');
      setError(null);
    }
  };

  const handleErrorDismiss = () => {
    if (error) {
      setStep(error.step);
    } else {
      setStep('onboarding');
    }
    setError(null);
  };

  const handleRequestChanges = async (feedback: string) => {
    if (!fingerprint) return;
    analytics.track('outline_revision_requested', { 
      topic: fingerprint.topic,
      feedback 
    });
    generateOutline(fingerprint, courseOutline, feedback);
  };

  // Error state - show user-friendly error with retry option
  if (step === 'error' && error) {
    return (
      <ApiError
        error={error.message}
        onRetry={handleErrorRetry}
        onDismiss={handleErrorDismiss}
      />
    );
  }

  // Outline generation loading
  if (step === 'generating-outline') {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #e8f0f9 0%, #d0e2f4 100%)' }}>
        <div className="max-w-md w-full text-center">
          <div className="inline-block animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-4 mb-8" style={{ borderTopColor: 'var(--royal-blue)' }}></div>
          <h2 className="text-4xl font-bold mb-4 font-serif" style={{ color: 'var(--royal-blue)' }}>
            {isRegenerating ? 'Updating Outline' : 'Structuring Your Course'}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            {isRegenerating ? 'Incorporating your feedback...' : 'Analyzing your profile and constructing optimal curriculum structure...'}
          </p>
        </div>
      </div>
    );
  }

  // Outline preview
  if (step === 'outline-preview' && courseOutline) {
    return (
      <CourseOutlinePreview 
        outline={courseOutline}
        onApprove={handleOutlineApproved}
        onRequestChanges={handleRequestChanges}
        isRegenerating={isRegenerating}
      />
    );
  }

  // Full course generation loading
  if (step === 'generating-full') {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #e8f0f9 0%, #d0e2f4 100%)' }}>
        <LoadingSpinner topic={fingerprint?.topic} />
      </div>
    );
  }

  // Celebration
  if (step === 'celebration') {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #e8f0f9 0%, #d0e2f4 100%)' }}>
        <SuccessCelebration onContinue={() => setStep('preview')} courseTitle={fingerprint?.topic || ''} />
      </div>
    );
  }

  // Course preview
  if (step === 'preview' && generatedCourse) {
    return <CourseViewer course={generatedCourse} />;
  }

  // Onboarding (fingerprint collection)
  return <OnboardingFingerprint onComplete={handleFingerprintComplete} initialTopic={initialTopic} />;
}

// Default export wraps with error boundary
export default function CourseBuilderSmart({ initialTopic }: { initialTopic?: string }) {
  const [resetKey, setResetKey] = useState(0);

  return (
    <CourseBuilderErrorBoundary onReset={() => setResetKey(k => k + 1)}>
      <CourseBuilderContent key={resetKey} initialTopic={initialTopic} />
    </CourseBuilderErrorBoundary>
  );
}
