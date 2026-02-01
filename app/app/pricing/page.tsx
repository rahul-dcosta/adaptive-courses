'use client';

import { useState } from 'react';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Try before you buy',
    features: [
      '1 free course',
      'Course is yours forever',
      '5 AI prompts total',
      'Community support',
    ],
    notIncluded: [
      'PDF export',
      'Email delivery',
      'Priority generation',
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Per-Course',
    price: '$3.99',
    period: 'per course',
    description: 'Pay as you go',
    features: [
      'Course is yours forever',
      '10 AI prompts/day per course',
      'PDF export included',
      'Email delivery included',
    ],
    notIncluded: [
      'Priority generation',
    ],
    cta: 'Get Started',
    popular: true,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    yearlyPrice: '$99/year',
    yearlyNote: '(2 months free)',
    description: 'For regular learners',
    features: [
      'Unlimited course generation',
      '50 AI prompts/day global',
      'PDF export included',
      'Email delivery included',
      'Priority generation (faster)',
      'Early access to new features',
      'All courses yours if you cancel',
    ],
    notIncluded: [],
    cta: 'Go Pro',
    popular: false,
  },
];

const faqs = [
  {
    question: 'What happens to my courses if I cancel Pro?',
    answer: 'All courses you generate while subscribed remain yours forever. You just lose the ability to generate new ones and the higher AI prompt limit.',
  },
  {
    question: 'Can I get a refund?',
    answer: "Yes! If you're not satisfied, email us within 24 hours of purchase for a full refund. No questions asked.",
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, and Apple Pay/Google Pay via Stripe.',
  },
  {
    question: 'Is there a free trial for Pro?',
    answer: 'Every account gets one free course to start. This lets you experience the full product before committing.',
  },
  {
    question: 'What are AI prompts?',
    answer: 'After generating a course, you can ask our AI follow-up questions about the content. Each question uses one prompt. Prompts reset daily.',
  },
  {
    question: 'Can I upgrade from Per-Course to Pro?',
    answer: "Absolutely! If you find yourself buying 3+ courses per month, Pro saves you money. Upgrade anytime from your account settings.",
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight" style={{ color: 'var(--royal-blue)' }}>
          Simple, honest pricing
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start free. Pay only for what you use. No tricks, no hidden fees.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl p-8 ${
                tier.popular
                  ? 'bg-white shadow-xl border-2'
                  : 'bg-white/80 shadow-lg'
              }`}
              style={tier.popular ? { borderColor: 'var(--royal-blue)' } : {}}
            >
              {tier.popular && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 text-white text-sm font-medium rounded-full"
                  style={{ background: 'var(--royal-blue)' }}
                >
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-gray-600 text-sm">{tier.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black" style={{ color: 'var(--royal-blue)' }}>
                    {tier.name === 'Pro' && isAnnual ? '$99' : tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-gray-500">
                      {tier.name === 'Pro' && isAnnual ? '/year' : tier.period}
                    </span>
                  )}
                </div>
                {tier.yearlyPrice && !isAnnual && (
                  <button
                    onClick={() => setIsAnnual(true)}
                    className="text-sm text-gray-500 hover:text-gray-700 mt-1"
                  >
                    or {tier.yearlyPrice} {tier.yearlyNote}
                  </button>
                )}
                {tier.name === 'Pro' && isAnnual && (
                  <button
                    onClick={() => setIsAnnual(false)}
                    className="text-sm text-gray-500 hover:text-gray-700 mt-1"
                  >
                    or $9.99/month
                  </button>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      style={{ color: 'var(--royal-blue)' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
                {tier.notIncluded.map((feature, idx) => (
                  <li key={`not-${idx}`} className="flex items-start gap-3 opacity-50">
                    <svg
                      className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="text-gray-500">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/"
                className={`block w-full py-3 px-6 text-center font-medium rounded-xl transition-all ${
                  tier.popular
                    ? 'text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
                style={tier.popular ? { background: 'var(--royal-blue)' } : {}}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Annual toggle hint */}
        <p className="text-center text-gray-500 text-sm mt-8">
          Pro annual saves you $20/year (2 months free)
        </p>
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--royal-blue)' }}>
          Compare Plans
        </h2>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-6 font-medium text-gray-500">Feature</th>
                <th className="py-4 px-4 text-center font-medium text-gray-500">Free</th>
                <th className="py-4 px-4 text-center font-medium text-gray-500">Per-Course</th>
                <th className="py-4 px-4 text-center font-medium" style={{ color: 'var(--royal-blue)' }}>Pro</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Course generation', free: '1', perCourse: 'Per purchase', pro: 'Unlimited' },
                { feature: 'Course ownership', free: '✓', perCourse: '✓', pro: '✓' },
                { feature: 'AI prompts', free: '5 total', perCourse: '10/day/course', pro: '50/day' },
                { feature: 'PDF export', free: '—', perCourse: '✓', pro: '✓' },
                { feature: 'Email delivery', free: '—', perCourse: '✓', pro: '✓' },
                { feature: 'Priority generation', free: '—', perCourse: '—', pro: '✓' },
                { feature: 'Early access', free: '—', perCourse: '—', pro: '✓' },
              ].map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="py-4 px-6 font-medium text-gray-900">{row.feature}</td>
                  <td className="py-4 px-4 text-center text-gray-600">{row.free}</td>
                  <td className="py-4 px-4 text-center text-gray-600">{row.perCourse}</td>
                  <td className="py-4 px-4 text-center font-medium" style={{ color: 'var(--royal-blue)' }}>{row.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--royal-blue)' }}>
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="bg-white/80 rounded-2xl shadow-lg p-12">
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--royal-blue)' }}>
            Ready to start learning?
          </h2>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Your first course is completely free. No credit card required.
          </p>
          <a
            href="/"
            className="inline-block px-8 py-4 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
            style={{ background: 'var(--royal-blue)' }}
          >
            Create Your Free Course →
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--royal-blue)' }}
            >
              <span className="text-white font-bold text-sm font-serif">A</span>
            </div>
            <span className="font-semibold text-gray-900">Adaptive Courses</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <a href="/terms" className="hover:text-gray-700">Terms</a>
            <a href="/privacy" className="hover:text-gray-700">Privacy</a>
            <a href="/faq" className="hover:text-gray-700">FAQ</a>
            <a href="/about" className="hover:text-gray-700">About</a>
          </div>
          <p className="text-sm text-gray-500">© 2026 Adaptive Courses LLC</p>
        </div>
      </footer>
    </div>
  );
}
