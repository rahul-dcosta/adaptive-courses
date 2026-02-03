import { Module, Lesson } from '@/lib/types';

interface SampleCourse {
  title: string;
  estimated_time: string;
  modules: Module[];
  next_steps: string[];
}

export default function SampleCoursePage() {
  const sampleCourse: SampleCourse = {
    title: "Manufacturing Operations Essentials",
    estimated_time: "45 minutes",
    modules: [
      {
        title: "Factory Floor Fundamentals",
        description: "Understanding the basic layout and workflow of modern manufacturing facilities",
        lessons: [
          {
            title: "The Production Line Flow",
            content: "A production line is the backbone of any manufacturing operation. It's a series of workstations where products move sequentially, with each station adding value through assembly, testing, or packaging. Modern facilities use just-in-time (JIT) principles to minimize inventory and maximize efficiency. When you walk the floor, notice how materials flow from receiving → assembly → quality control → shipping. The smoother this flow, the more efficient the operation.",
            quiz: {
              question: "What does JIT (just-in-time) manufacturing aim to minimize?",
              answer: "Excess inventory and waste by producing only what's needed when it's needed."
            }
          },
          {
            title: "Key Equipment You'll See",
            content: "Manufacturing floors typically feature CNC machines (computer-controlled cutting/shaping), conveyor systems (automated material movement), robotic arms (repetitive assembly tasks), and quality inspection stations. Don't be intimidated by the machinery—most serve one of four functions: cut, shape, assemble, or test. When touring, ask operators about uptime (how often machines are running vs. down for maintenance). High uptime = efficient operation.",
            quiz: {
              question: "What are the four main functions of manufacturing equipment?",
              answer: "Cut, shape, assemble, and test."
            }
          }
        ]
      },
      {
        title: "Manufacturing Vocabulary",
        description: "Essential terms you'll hear during a factory tour",
        lessons: [
          {
            title: "Production Metrics That Matter",
            content: "OEE (Overall Equipment Effectiveness) measures how efficiently equipment is used—aim for 85%+. Cycle time is how long it takes to complete one unit. Takt time is the rate at which you need to produce to meet customer demand. Lead time is the total time from order to delivery. When someone mentions '5S', they're talking about workplace organization: Sort, Set in Order, Shine, Standardize, Sustain. These aren't just buzzwords—they're how factories stay competitive.",
            quiz: {
              question: "What does OEE measure, and what's considered a good score?",
              answer: "Overall Equipment Effectiveness measures how efficiently equipment is used. 85% or higher is considered good."
            }
          },
          {
            title: "Quality Control Basics",
            content: "Six Sigma is a methodology for reducing defects to 3.4 per million. Kaizen means continuous improvement—small, incremental changes add up. PPM (parts per million) measures defect rates. When you see inspection stations, they're checking for spec compliance (does it meet design requirements?). Good questions to ask: 'What's your defect rate?' or 'How do you handle non-conforming parts?'",
            quiz: {
              question: "What does 'Kaizen' mean in manufacturing?",
              answer: "Continuous improvement through small, incremental changes."
            }
          }
        ]
      },
      {
        title: "Smart Questions to Ask",
        description: "Demonstrate curiosity and engagement during your visit",
        lessons: [
          {
            title: "Questions About Operations",
            content: "• 'What's your average cycle time for this product?' (shows you understand production metrics)\n• 'How do you handle bottlenecks in the line?' (demonstrates systems thinking)\n• 'What's the most recent improvement you've implemented?' (signals you value continuous improvement)\n• 'How do you track OEE, and what's your current performance?' (you know the metrics that matter)\n• 'What percentage of your processes are automated vs. manual?' (shows interest in operational strategy)"
          }
        ]
      }
    ],
    next_steps: [
      "Review these notes 30 minutes before your tour",
      "Bring a small notebook—taking notes shows engagement",
      "Ask follow-up questions when you hear unfamiliar terms",
      "After the tour, research any concepts that seemed particularly relevant"
    ]
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'linear-gradient(135deg, #e8f0f9 0%, #d0e2f4 100%)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Sample Badge */}
        <div className="bg-amber-50 border-l-4 p-4 mb-6 rounded-lg" style={{ borderColor: 'var(--royal-blue)' }}>
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" style={{ color: 'var(--royal-blue)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold" style={{ color: 'var(--royal-blue-dark)' }}>Sample Course</p>
              <p className="text-sm text-gray-600">This is an example of what you'll get. Real courses are personalized to your situation.</p>
            </div>
          </div>
        </div>

        {/* Course Header */}
        <div className="bg-white rounded-t-2xl shadow-xl p-6 md:p-8 border-b-4" style={{ borderColor: 'var(--royal-blue)' }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 font-serif">
            {sampleCourse.title}
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {sampleCourse.estimated_time}
          </p>
        </div>

        {/* Course Content */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-8">
          {sampleCourse.modules?.map((module: Module, idx: number) => (
            <div key={idx} className="mb-10 last:mb-0">
              <div className="flex items-start gap-3 mb-6">
                <div className="flex-shrink-0 w-10 h-10 text-white rounded-full flex items-center justify-center font-bold" style={{ background: 'var(--royal-blue)' }}>
                  {idx + 1}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 font-serif">
                    {module.title}
                  </h2>
                  {module.description && (
                    <p className="text-gray-600 mt-1">{module.description}</p>
                  )}
                </div>
              </div>

              {module.lessons?.map((lesson: Lesson, lessonIdx: number) => (
                <div key={lessonIdx} className="ml-0 md:ml-13 mb-8 last:mb-0 pl-6 border-l-2 border-gray-200">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">
                    {lesson.title}
                  </h3>
                  <div className="prose max-w-none text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                    {lesson.content}
                  </div>

                  {lesson.quiz && (
                    <div className="mt-4 p-5 rounded-xl border-l-4" style={{ background: 'rgba(0, 63, 135, 0.05)', borderColor: 'var(--royal-blue)' }}>
                      <p className="font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--royal-blue-dark)' }}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Quick Check:
                      </p>
                      <p className="text-gray-800">{lesson.quiz.question}</p>
                      {lesson.quiz.answer && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm font-medium" style={{ color: 'var(--royal-blue)' }}>
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
          {sampleCourse.next_steps && sampleCourse.next_steps.length > 0 && (
            <div className="mt-10 p-6 bg-green-50 rounded-xl border-l-4 border-green-600">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                What's Next?
              </h3>
              <ul className="space-y-2">
                {sampleCourse.next_steps.map((step: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <span className="text-green-600 font-bold mt-1">→</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 font-serif">Like what you see?</h2>
          <p className="text-gray-600 mb-6">
            Generate your own personalized course in 30 seconds. First one free, then $3.99.
          </p>
          <a
            href="/"
            className="inline-block text-white font-semibold px-8 py-4 rounded-xl transition-all text-lg shadow-lg hover:shadow-xl bg-[var(--royal-blue)] hover:bg-[var(--royal-blue-light)]"
          >
            Create My Course →
          </a>
        </div>
      </div>
    </div>
  );
}
