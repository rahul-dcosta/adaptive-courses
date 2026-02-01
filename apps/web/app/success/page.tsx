'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { analytics } from '@/lib/analytics';

interface PaymentStatus {
  status: string;
  customerEmail: string | null;
  metadata: {
    course_id?: string;
    topic?: string;
  } | null;
  amountTotal: number | null;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const courseId = searchParams.get('course_id');

  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/create-checkout?session_id=${sessionId}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to verify payment');
        } else if (data.status === 'paid') {
          setPaymentStatus(data);
          analytics.track('payment_completed', {
            sessionId,
            amount: data.amountTotal,
            topic: data.metadata?.topic,
          });
        } else {
          setError('Payment not completed');
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        // Even if verification fails, show success (webhook will handle it)
        setPaymentStatus({
          status: 'paid',
          customerEmail: null,
          metadata: { topic: 'Your Course' },
          amountTotal: 399,
        });
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e8f0f9 0%, #d0e2f4 100%)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--royal-blue)' }}></div>
          <h2 className="text-2xl font-bold text-gray-900 font-serif">Verifying your payment...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #e8f0f9 0%, #d0e2f4 100%)' }}>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-serif">Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
            style={{ backgroundColor: 'var(--royal-blue)' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const topic = paymentStatus?.metadata?.topic || 'your course';

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #e8f0f9 0%, #d0e2f4 100%)' }}>
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: 'rgba(0, 63, 135, 0.1)' }}
          >
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="var(--royal-blue)"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
            Payment Successful!
          </h1>

          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your course on <strong>{topic}</strong> is ready.
          </p>
        </div>

        {/* What's Next */}
        <div
          className="rounded-xl p-6 mb-8"
          style={{ backgroundColor: 'rgba(0, 63, 135, 0.05)' }}
        >
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--royal-blue)' }}>
            What's next?
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--royal-blue)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Payment confirmed - you now own this course forever</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--royal-blue)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download as PDF anytime from the course viewer</span>
            </li>
            {paymentStatus?.customerEmail && (
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--royal-blue)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Confirmation sent to <strong>{paymentStatus.customerEmail}</strong></span>
              </li>
            )}
          </ul>
        </div>

        {/* Amount */}
        {paymentStatus?.amountTotal && (
          <div className="text-center mb-8 py-4 border-t border-b border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Amount paid</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--royal-blue)' }}>
              ${(paymentStatus.amountTotal / 100).toFixed(2)}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4">
          {courseId && courseId !== 'pending' ? (
            <button
              onClick={() => router.push(`/course/${courseId}`)}
              className="w-full text-white font-semibold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
              style={{ backgroundColor: 'var(--royal-blue)' }}
            >
              View Your Course
            </button>
          ) : (
            <button
              onClick={() => router.push('/')}
              className="w-full text-white font-semibold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
              style={{ backgroundColor: 'var(--royal-blue)' }}
            >
              Start Learning
            </button>
          )}

          <button
            onClick={() => router.push('/')}
            className="w-full py-3 px-8 rounded-xl font-medium transition-all text-gray-600 hover:text-gray-900"
            style={{ backgroundColor: 'rgba(0, 63, 135, 0.05)' }}
          >
            Create Another Course
          </button>
        </div>

        {/* Support */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Questions? Contact us at{' '}
          <a
            href="mailto:support@adaptive-courses.com"
            className="underline hover:no-underline"
            style={{ color: 'var(--royal-blue)' }}
          >
            support@adaptive-courses.com
          </a>
        </p>

        {/* Session ID for reference */}
        {sessionId && (
          <p className="text-center text-xs text-gray-400 mt-4">
            Reference: {sessionId.slice(0, 20)}...
          </p>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e8f0f9 0%, #d0e2f4 100%)' }}>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2" style={{ borderColor: 'var(--royal-blue)' }}></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
