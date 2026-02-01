'use client';

import { useState } from 'react';
import { analytics } from '@/lib/analytics';
import LoadingSpinner from './LoadingSpinner';
import SuccessCelebration from './SuccessCelebration';
import CourseViewer from './CourseViewer';
import OnboardingFingerprint from './OnboardingFingerprint';
import CourseOutlinePreview from './CourseOutlinePreview';
import { LearnerFingerprint } from '@/lib/types';

type Step = 'onboarding' | 'generating-outline' | 'outline-preview' | 'generating-full' | 'celebration' | 'preview';

export default function CourseBuilderSmart({ initialTopic }: { initialTopic?: string }) {
  const [step, setStep] = useState<Step>('onboarding');
  const [generatedCourse, setGeneratedCourse] = useState<any>(null);
  const [courseOutline, setCourseOutline] = useState<any>(null);
  const [fingerprint, setFingerprint] = useState<LearnerFingerprint | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleFingerprintComplete = async (completedFingerprint: LearnerFingerprint) => {
    setFingerprint(completedFingerprint);
    generateOutline(completedFingerprint);
  };

  const generateOutline = async (fp: LearnerFingerprint, previousOutline?: any, userFeedback?: string) => {
    setStep('generating-outline');
    setIsRegenerating(!!userFeedback); // Only true if regenerating with feedback
    
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
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status}`);
      }
      
      analytics.track('outline_generated', { 
        topic: fp.topic,
        isRevision: !!userFeedback
      });
      
      setCourseOutline(data.outline);
      setStep('outline-preview');
      setIsRegenerating(false);
    } catch (error: any) {
      console.error('Outline generation failed:', error);
      alert(`Failed to generate outline: ${error.message}`);
      setStep('onboarding');
      setIsRegenerating(false);
    }
  };

  const handleOutlineApproved = async () => {
    if (!fingerprint || !courseOutline) return;
    
    setStep('generating-full');
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
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status}`);
      }
      
      const duration = Date.now() - startTime;
      analytics.courseGenerated(fingerprint.topic, duration);
      
      setGeneratedCourse(data.course);
      setStep('celebration');
      
      setTimeout(() => setStep('preview'), 2000);
    } catch (error: any) {
      console.error('Course generation failed:', error);
      alert(`Failed to generate course: ${error.message}`);
      setStep('outline-preview');
    }
  };

  const handleRequestChanges = async (feedback: string) => {
    if (!fingerprint) return;
    analytics.track('outline_revision_requested', { 
      topic: fingerprint.topic,
      feedback 
    });
    generateOutline(fingerprint, courseOutline, feedback);
  };

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
