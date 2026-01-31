'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      // TODO: Verify payment and fetch course
      // For now, just show success message
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900">Processing your payment...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful! 🎉
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Your course is being generated right now. This usually takes 30-60 seconds.
        </p>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <p className="text-sm text-gray-700 mb-2">
            <strong>What happens next:</strong>
          </p>
          <ul className="text-left text-gray-600 space-y-2">
            <li>✅ Payment confirmed</li>
            <li>🤖 Claude is generating your custom course</li>
            <li>📧 You'll receive it via email in a few minutes</li>
            <li>📄 PDF download link will be included</li>
          </ul>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 transition"
          >
            Generate Another Course
          </button>
          
          <a
            href="mailto:support@adaptive-courses.com"
            className="block text-indigo-600 hover:text-indigo-700 text-sm"
          >
            Questions? Contact support
          </a>
        </div>

        {sessionId && (
          <p className="text-xs text-gray-400 mt-8">
            Session ID: {sessionId}
          </p>
        )}
      </div>
    </div>
  );
}
