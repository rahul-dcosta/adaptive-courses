'use client';

import { useState, useEffect } from 'react';

const ACCESS_CODE = 'sixseven';
const STORAGE_KEY = 'ac_access_granted';

interface AccessGateProps {
  children: React.ReactNode;
}

export default function AccessGate({ children }: AccessGateProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check localStorage for existing access
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setHasAccess(true);
    } else {
      setHasAccess(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (code.toLowerCase().trim() === ACCESS_CODE) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setHasAccess(true);
      setError('');
    } else {
      setError('Invalid access code');
      setCode('');
    }
  };

  // Loading state
  if (hasAccess === null) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="animate-pulse text-[#003F87]">Loading...</div>
      </div>
    );
  }

  // Access granted
  if (hasAccess) {
    return <>{children}</>;
  }

  // Access gate UI
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-black/[0.08] p-8">
          <div className="text-center mb-8">
            <h1 className="font-merriweather text-2xl font-bold text-[#1a1a1a] mb-2">
              Adaptive Courses
            </h1>
            <p className="text-[#666] text-sm">
              Enter access code to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError('');
                }}
                placeholder="Access code"
                className="w-full px-4 py-3 rounded-xl border border-black/[0.12] focus:outline-none focus:ring-2 focus:ring-[#003F87]/20 focus:border-[#003F87] transition-all text-center text-lg tracking-widest"
                autoFocus
                autoComplete="off"
              />
              {error && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#003F87] text-white rounded-xl font-medium hover:bg-[#002D5F] transition-colors"
            >
              Enter
            </button>
          </form>

          <p className="text-center text-xs text-[#999] mt-6">
            Beta access only
          </p>
        </div>
      </div>
    </div>
  );
}
