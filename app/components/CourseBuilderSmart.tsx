'use client';

import { useState } from 'react';
import { analytics } from '@/lib/analytics';
import LoadingSpinner from './LoadingSpinner';
import SuccessCelebration from './SuccessCelebration';
import CourseViewer from './CourseViewer';
import OnboardingFingerprint from './OnboardingFingerprint';
import { LearnerFingerprint } from '@/lib/types';

type Step = 'onboarding' | 'generating' | 'celebration' | 'preview';

export default function CourseBuilderSmart({ initialTopic }: { initialTopic?: string }) {
  const [step, setStep] = useState<Step>('onboarding');
  const [generatedCourse, setGeneratedCourse] = useState<any>(null);
  const [fingerprint, setFingerprint] = useState<LearnerFingerprint | null>(null);

  const handleFingerprintComplete = async (completedFingerprint: LearnerFingerprint) => {
    setFingerprint(completedFingerprint);
    setStep('generating');
    
    const startTime = Date.now();
    
    try {
      analytics.track('fingerprint_completed', { 
        topic: completedFingerprint.topic,
        learningStyle: completedFingerprint.learningStyle,
        priorKnowledge: completedFingerprint.priorKnowledge,
        learningGoal: completedFingerprint.learningGoal,
        timeCommitment: completedFingerprint.timeCommitment,
        contentFormat: completedFingerprint.contentFormat,
        challengePreference: completedFingerprint.challengePreference
      });
      
      analytics.courseStarted(completedFingerprint.topic);
      
      const response = await fetch('/api/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: completedFingerprint.topic,
          learningStyle: completedFingerprint.learningStyle,
          priorKnowledge: completedFingerprint.priorKnowledge,
          learningGoal: completedFingerprint.learningGoal,
          timeCommitment: completedFingerprint.timeCommitment,
          contentFormat: completedFingerprint.contentFormat,
          challengePreference: completedFingerprint.challengePreference,
          context: completedFingerprint.context || ''
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status}`);
      }
      
      const duration = Date.now() - startTime;
      analytics.courseGenerated(completedFingerprint.topic, duration);
      
      setGeneratedCourse(data.course);
      setStep('celebration');
      
      setTimeout(() => setStep('preview'), 2000);
    } catch (error: any) {
      console.error('Course generation failed:', error);
      alert(`Failed to generate course: ${error.message}`);
      setStep('onboarding');
    }
  };

  // Loading state
  if (step === 'generating') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #e8f0f9 0%, #d0e2f4 100%)' }}>
        <LoadingSpinner topic={fingerprint?.topic} />
      </div>
    );
  }

  // Celebration
  if (step === 'celebration') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #e8f0f9 0%, #d0e2f4 100%)' }}>
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
