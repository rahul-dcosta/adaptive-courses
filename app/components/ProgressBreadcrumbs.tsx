'use client';

interface ProgressBreadcrumbsProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export default function ProgressBreadcrumbs({ currentStep, totalSteps, labels }: ProgressBreadcrumbsProps) {
  const defaultLabels = ['Topic', 'Situation', 'Timeline', 'Goal'];
  const stepLabels = labels || defaultLabels;

  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="h-2 rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${(currentStep / totalSteps) * 100}%`,
            background: '#003F87' // Royce royal blue
          }}
        />
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between items-center">
        {stepLabels.slice(0, totalSteps).map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm mb-2
                  transition-all duration-300
                  ${isCompleted ? 'bg-green-500 text-white' : 
                    isActive ? 'text-white scale-110 shadow-lg' : 
                    'bg-gray-200 text-gray-400'}
                `}
                style={isActive ? { background: '#003F87' } : {}}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <span 
                className={`
                  text-xs font-medium hidden sm:block transition-colors duration-300
                  ${isCompleted ? 'text-green-600' : isActive ? '' : 'text-gray-400'}
                `}
                style={isActive ? { color: '#003F87' } : {}}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
