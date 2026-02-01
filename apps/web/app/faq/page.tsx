'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How is this different from ChatGPT?",
    answer: "ChatGPT gives you text responses. We give you structured courses with modules, lessons, quizzes, and a learning path. Plus, we ask the RIGHT questions to understand your context — not just 'what do you want to learn?'"
  },
  {
    question: "What topics can I learn?",
    answer: "Anything! Manufacturing, supply chain, nuclear energy, sales frameworks, programming languages, cooking techniques — you name it. If you can describe it, we can teach it."
  },
  {
    question: "How long are the courses?",
    answer: "It depends on your timeline selection. 'Tomorrow' courses are shorter and more tactical (30-60 minutes of content). 'No rush' courses go deeper (2-3 hours). You can always request more depth after purchasing."
  },
  {
    question: "Can I get a refund?",
    answer: "Yes! If you're not happy with your course, email us within 24 hours at support@adaptive-courses.com for a full refund. No questions asked."
  },
  {
    question: "How does the AI work?",
    answer: "We use Claude Sonnet 4.5 by Anthropic, one of the most advanced AI models available. Your topic and context are sent to Claude, which generates a custom curriculum tailored to your specific situation and goals."
  },
  {
    question: "Do you save my data?",
    answer: "We save your email and generated courses so you can access them later. We don't sell your data or spam you. See our Privacy Policy for details."
  },
  {
    question: "Can I share my course with others?",
    answer: "Yes! Once you purchase a course, you can share the PDF with anyone. We might add a 'public course library' in the future where users can publish their courses."
  },
  {
    question: "Will you add subscriptions?",
    answer: "Not planning to. We like the 'pay per course' model — it's simple and fair. You only pay for what you use."
  },
  {
    question: "What if the course has errors?",
    answer: "AI-generated content may occasionally contain inaccuracies. If you find a significant error, let us know and we'll either fix it or refund you. We're constantly improving our prompts to minimize errors."
  },
  {
    question: "How fast is course generation?",
    answer: "Usually 30-60 seconds. Occasionally it might take up to 2 minutes if Claude is processing a complex topic or high traffic."
  },
  {
    question: "Can I request custom modifications?",
    answer: "Not yet, but we're working on it! For now, you can generate multiple courses on the same topic with different goals/timelines to see different angles."
  },
  {
    question: "Do you offer bulk pricing?",
    answer: "Not yet, but if you need 10+ courses, email us at support@adaptive-courses.com and we can work something out."
  }
];

function FAQAccordion({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left hover:bg-gray-50 px-4 transition"
      >
        <span className="text-lg font-medium text-gray-900 pr-4">
          {item.question}
        </span>
        <svg
          className={`w-6 h-6 text-gray-500 transition-transform flex-shrink-0 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 pb-6">
          <p className="text-gray-600 leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600">
              Everything you need to know about Adaptive Courses
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {faqs.map((faq, index) => (
              <FAQAccordion key={index} item={faq} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Still have questions?
            </p>
            <a
              href="mailto:support@adaptive-courses.com"
              className="inline-block bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Contact Support
            </a>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
