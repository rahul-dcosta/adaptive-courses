'use client';

import { useState } from 'react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface InteractiveQuizProps {
  questions: QuizQuestion[];
  onComplete?: (score: number, totalQuestions: number) => void;
}

export default function InteractiveQuiz({ questions, onComplete }: InteractiveQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return; // Prevent changing answer after submission
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    setShowExplanation(true);
    
    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setCompleted(true);
      onComplete?.(score + (selectedAnswer === question.correctAnswer ? 1 : 0), questions.length);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    const finalScore = score;
    const percentage = Math.round((finalScore / questions.length) * 100);
    const isPerfect = finalScore === questions.length;
    const isGood = percentage >= 80;
    const isOk = percentage >= 60;

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          {/* Icon based on score */}
          <div className="text-6xl mb-4">
            {isPerfect ? '🏆' : isGood ? '🎉' : isOk ? '👍' : '📚'}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isPerfect ? 'Perfect Score!' : isGood ? 'Great Job!' : isOk ? 'Good Effort!' : 'Keep Practicing!'}
          </h2>

          <p className="text-lg text-gray-600 mb-6">
            You scored <strong className="text-indigo-600">{finalScore}/{questions.length}</strong> ({percentage}%)
          </p>

          {/* Score bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className={`h-4 rounded-full transition-all duration-1000 ${
                  isPerfect ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                  isGood ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                  'bg-gradient-to-r from-blue-400 to-indigo-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Feedback */}
          {isPerfect && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700">
                🌟 <strong>Outstanding!</strong> You've mastered this material. Consider sharing your achievement!
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all transform hover:scale-105 font-medium"
            >
              ↻ Retake Quiz
            </button>
            <button
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 font-medium"
            >
              Continue Learning →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-indigo-600">
            Score: {score}/{currentQuestion}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        {question.question}
      </h3>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          const showCorrect = showExplanation && isCorrect;
          const showWrong = showExplanation && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showExplanation}
              className={`
                w-full text-left p-4 rounded-xl border-2 transition-all
                ${isSelected && !showExplanation
                  ? 'border-indigo-600 bg-indigo-50' 
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }
                ${showCorrect ? 'border-green-500 bg-green-50' : ''}
                ${showWrong ? 'border-red-500 bg-red-50' : ''}
                ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${isSelected && !showExplanation ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}
                  ${showCorrect ? 'border-green-500 bg-green-500' : ''}
                  ${showWrong ? 'border-red-500 bg-red-500' : ''}
                `}>
                  {showCorrect && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {showWrong && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {isSelected && !showExplanation && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className={`
                  ${showCorrect ? 'font-semibold text-green-700' : ''}
                  ${showWrong ? 'text-red-700' : ''}
                `}>
                  {option}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && question.explanation && (
        <div className={`
          p-4 rounded-xl mb-6
          ${selectedAnswer === question.correctAnswer 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-blue-50 border border-blue-200'
          }
        `}>
          <p className="text-sm font-semibold mb-1 text-gray-900">
            {selectedAnswer === question.correctAnswer ? '✅ Correct!' : '💡 Explanation:'}
          </p>
          <p className="text-sm text-gray-700">{question.explanation}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!showExplanation ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLastQuestion ? 'See Results →' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  );
}
