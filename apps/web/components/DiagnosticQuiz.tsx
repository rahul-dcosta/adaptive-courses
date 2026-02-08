'use client';

import { useState, useEffect, useCallback } from 'react';
import { feedbackQuizCorrect, feedbackQuizIncorrect } from '@/lib/feedback';

// =============================================================================
// Types
// =============================================================================

interface DiagnosticQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  explanation: string;
}

export interface DiagnosticResult {
  score: number; // 0-5
  maxScore: number;
  correctByDifficulty: Record<string, number>;
  suggestedLevel: 'beginner' | 'intermediate' | 'advanced';
}

interface DiagnosticQuizProps {
  topic: string;
  priorKnowledge?: string;
  onComplete: (result: DiagnosticResult) => void;
  onSkip: () => void;
}

// =============================================================================
// Component
// =============================================================================

export function DiagnosticQuiz({ topic, priorKnowledge, onComplete, onSkip }: DiagnosticQuizProps) {
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<Array<{ questionIdx: number; selectedIdx: number; correct: boolean }>>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('/api/generate-diagnostic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, priorKnowledge }),
        });

        if (!res.ok) throw new Error('Failed to generate diagnostic');

        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load diagnostic');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topic, priorKnowledge]);

  const handleSelectOption = useCallback((idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
  }, [showExplanation]);

  const handleSubmit = useCallback(() => {
    if (selectedOption === null || !questions[currentIndex]) return;

    const isCorrect = selectedOption === questions[currentIndex].correctIndex;
    if (isCorrect) feedbackQuizCorrect();
    else feedbackQuizIncorrect();

    setAnswers((prev) => [...prev, {
      questionIdx: currentIndex,
      selectedIdx: selectedOption,
      correct: isCorrect,
    }]);
    setShowExplanation(true);
  }, [selectedOption, currentIndex, questions]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Quiz complete — compute results
      const allAnswers = [...answers];
      // Include current if not already (last question)
      const score = allAnswers.filter((a) => a.correct).length;

      const correctByDifficulty: Record<string, number> = {};
      allAnswers.forEach((a) => {
        const q = questions[a.questionIdx];
        if (a.correct) {
          correctByDifficulty[q.difficulty] = (correctByDifficulty[q.difficulty] || 0) + 1;
        }
      });

      let suggestedLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
      if (score >= 4) suggestedLevel = 'advanced';
      else if (score >= 2) suggestedLevel = 'intermediate';

      onComplete({
        score,
        maxScore: questions.length,
        correctByDifficulty,
        suggestedLevel,
      });
    }
  }, [currentIndex, questions, answers, onComplete]);

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-12">
        <div
          className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--royal-blue)', borderTopColor: 'transparent' }}
        />
        <p className="text-[var(--text-secondary)]">Generating diagnostic questions...</p>
        <button
          onClick={onSkip}
          className="mt-4 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] underline"
        >
          Skip diagnostic
        </button>
      </div>
    );
  }

  // Error state
  if (error || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--text-secondary)] mb-4">
          {error || 'Could not load diagnostic questions.'}
        </p>
        <button
          onClick={onSkip}
          className="px-6 py-2 rounded-lg font-medium text-white"
          style={{ backgroundColor: 'var(--royal-blue)' }}
        >
          Continue without diagnostic
        </button>
      </div>
    );
  }

  const question = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] font-serif">
            Quick Knowledge Check
          </h3>
          <p className="text-sm text-[var(--text-muted)]">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <button
          onClick={onSkip}
          className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
        >
          Skip
        </button>
      </div>

      {/* Progress bar */}
      <div
        className="h-1.5 rounded-full mb-8 overflow-hidden"
        style={{ backgroundColor: 'rgba(0, 63, 135, 0.1)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
            backgroundColor: 'var(--royal-blue)',
          }}
        />
      </div>

      {/* Difficulty badge */}
      <span
        className="inline-block px-2 py-0.5 rounded text-xs font-medium mb-3"
        style={{
          backgroundColor:
            question.difficulty === 'beginner'
              ? 'rgba(34, 197, 94, 0.1)'
              : question.difficulty === 'intermediate'
                ? 'rgba(251, 146, 60, 0.1)'
                : 'rgba(239, 68, 68, 0.1)',
          color:
            question.difficulty === 'beginner'
              ? 'rgb(22, 163, 74)'
              : question.difficulty === 'intermediate'
                ? 'rgb(234, 88, 12)'
                : 'rgb(220, 38, 38)',
        }}
      >
        {question.difficulty}
      </span>

      {/* Question */}
      <h4 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
        {question.question}
      </h4>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, idx) => {
          let optionStyle: React.CSSProperties = {
            backgroundColor: 'var(--bg-card)',
            border: '2px solid var(--border-secondary)',
          };

          if (showExplanation) {
            if (idx === question.correctIndex) {
              optionStyle = {
                backgroundColor: 'rgba(34, 197, 94, 0.08)',
                border: '2px solid rgb(34, 197, 94)',
              };
            } else if (idx === selectedOption && idx !== question.correctIndex) {
              optionStyle = {
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '2px solid rgb(239, 68, 68)',
              };
            }
          } else if (selectedOption === idx) {
            optionStyle = {
              backgroundColor: 'rgba(0, 63, 135, 0.08)',
              border: '2px solid var(--royal-blue)',
            };
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              className="w-full text-left px-4 py-3 rounded-xl transition-all"
              style={optionStyle}
              disabled={showExplanation}
            >
              <span className="text-[var(--text-primary)]">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div
          className="p-4 rounded-xl mb-6 animate-fade-in"
          style={{
            backgroundColor: 'rgba(0, 63, 135, 0.04)',
            border: '1px solid rgba(0, 63, 135, 0.1)',
          }}
        >
          <p className="text-sm text-[var(--text-secondary)]">{question.explanation}</p>
        </div>
      )}

      {/* Action button */}
      {!showExplanation ? (
        <button
          onClick={handleSubmit}
          disabled={selectedOption === null}
          className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
          style={{ backgroundColor: 'var(--royal-blue)' }}
        >
          Check Answer
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-xl font-semibold text-white transition-all"
          style={{ backgroundColor: 'var(--royal-blue)' }}
        >
          {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
        </button>
      )}
    </div>
  );
}

export default DiagnosticQuiz;
