'use client';

import { useState } from 'react';

interface ReferralCardProps {
  referralCode?: string;
  referralsCount?: number;
  referralsNeeded?: number;
}

export default function ReferralCard({ 
  referralCode = 'RAHUL_2026', 
  referralsCount = 0,
  referralsNeeded = 2 
}: ReferralCardProps) {
  const [copied, setCopied] = useState(false);
  const referralUrl = `https://adaptive-courses.vercel.app/?ref=${referralCode}`;
  const progress = (referralsCount / referralsNeeded) * 100;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(
      `Just learned something new in 30 minutes with @AdaptiveCourses 🚀\n\nNo fluff, just what I needed. Try it:`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(referralUrl)}`, '_blank');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`, '_blank');
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      `Just learned something new in 30 minutes with Adaptive Courses! Check it out:`
    );
    window.open(`https://wa.me/?text=${text}%20${encodeURIComponent(referralUrl)}`, '_blank');
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 md:p-8 border border-indigo-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Get Your Next Course Free
          </h3>
          <p className="text-gray-600">
            Share with 2 friends who buy, your next course is on us!
          </p>
        </div>
        <div className="text-4xl">🎁</div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Your Progress</span>
          <span className="text-sm font-bold text-indigo-600">
            {referralsCount}/{referralsNeeded} friends
          </span>
        </div>
        <div className="relative">
          <div className="w-full bg-white rounded-full h-4 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-4 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              {progress >= 20 && (
                <span className="text-xs text-white font-bold">
                  {Math.round(progress)}%
                </span>
              )}
            </div>
          </div>
        </div>
        {referralsCount > 0 && (
          <p className="text-sm text-green-600 font-medium mt-2">
            🎉 {referralsCount} friend{referralsCount !== 1 ? 's' : ''} joined! 
            {referralsNeeded - referralsCount === 1 
              ? ' Just 1 more for a free course!'
              : ` ${referralsNeeded - referralsCount} more to go!`}
          </p>
        )}
      </div>

      {/* Referral link */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Your unique link
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralUrl}
            readOnly
            className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm font-mono text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button
            onClick={copyToClipboard}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all transform hover:scale-105 active:scale-95 font-medium flex items-center gap-2 whitespace-nowrap shadow-md"
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Share buttons */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Share on social</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={shareToTwitter}
            className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all transform hover:scale-105 active:scale-95 font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter
          </button>
          
          <button
            onClick={shareToLinkedIn}
            className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
            </svg>
            LinkedIn
          </button>
          
          <button
            onClick={shareToWhatsApp}
            className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all transform hover:scale-105 active:scale-95 font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp
          </button>
        </div>
      </div>

      {/* Reward preview */}
      {referralsCount >= referralsNeeded && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl text-white text-center animate-pulse-slow">
          <div className="text-3xl mb-2">🎉</div>
          <p className="font-bold">Congratulations!</p>
          <p className="text-sm opacity-90">Your next course is FREE! Use code: <strong>FRIEND2FREE</strong></p>
        </div>
      )}
    </div>
  );
}
