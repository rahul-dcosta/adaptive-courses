'use client';

import { useState } from 'react';

// Mock user data - will be replaced with real data from Supabase
const mockUser = {
  email: 'user@example.com',
  plan: 'free' as 'free' | 'per_course' | 'pro',
  createdAt: '2026-01-15T10:00:00Z',
  coursesGenerated: 1,
  subscriptionStatus: null as 'active' | 'canceled' | 'past_due' | null,
  currentPeriodEnd: null as string | null,
};

const mockPurchases = [
  {
    id: '1',
    date: '2026-01-28T10:00:00Z',
    description: 'Supply Chain Fundamentals (Per-Course)',
    amount: '$3.99',
    status: 'paid',
  },
];

export default function AccountPage() {
  const [user] = useState(mockUser);
  const [purchases] = useState(mockPurchases);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getPlanDisplay = () => {
    switch (user.plan) {
      case 'pro':
        return { name: 'Pro', color: 'bg-blue-100 text-blue-700' };
      case 'per_course':
        return { name: 'Per-Course', color: 'bg-green-100 text-green-700' };
      default:
        return { name: 'Free', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const plan = getPlanDisplay();

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--royal-blue)' }}>
            Account Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your account and subscription
          </p>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Member since</p>
                <p className="font-medium text-gray-900">{formatDate(user.createdAt)}</p>
              </div>
            </div>
            <div className="flex justify-between items-center py-3">
              <div>
                <p className="text-sm text-gray-500">Courses generated</p>
                <p className="font-medium text-gray-900">{user.coursesGenerated}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h2>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${plan.color}`}>
                {plan.name}
              </span>
              {user.subscriptionStatus === 'active' && user.currentPeriodEnd && (
                <span className="text-sm text-gray-500">
                  Renews {formatDate(user.currentPeriodEnd)}
                </span>
              )}
            </div>
          </div>

          {user.plan === 'free' && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Upgrade to Pro
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Get unlimited course generation, 50 AI prompts/day, and priority support for just $9.99/month.
              </p>
              <a
                href="/pricing"
                className="inline-block px-6 py-2 text-white text-sm font-medium rounded-lg transition-all"
                style={{ background: 'var(--royal-blue)' }}
              >
                View Plans
              </a>
            </div>
          )}

          {user.plan === 'pro' && user.subscriptionStatus === 'active' && (
            <div className="space-y-3">
              <button className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all text-left">
                Manage Subscription (Stripe Portal)
              </button>
              <button className="w-full py-3 px-4 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-all text-left">
                Cancel Subscription
              </button>
            </div>
          )}
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h2>
          {purchases.length > 0 ? (
            <div className="space-y-3">
              {purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">{purchase.description}</p>
                    <p className="text-sm text-gray-500">{formatDate(purchase.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{purchase.amount}</p>
                    <p className="text-sm text-green-600 capitalize">{purchase.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">No purchases yet</p>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-red-100">
          <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-500">
                Permanently delete your account and all your data
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 text-red-600 font-medium rounded-lg border border-red-200 hover:bg-red-50 transition-all"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <a href="/dashboard" className="text-gray-500 hover:text-gray-700">
            ← Back to Dashboard
          </a>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Account?</h3>
              <p className="text-gray-600">
                This action cannot be undone. All your courses and data will be permanently deleted.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button className="w-full py-3 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all">
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
