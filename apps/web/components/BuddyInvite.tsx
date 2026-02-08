'use client';

import { useState } from 'react';

interface BuddyInviteProps {
  className?: string;
}

export function BuddyInvite({ className = '' }: BuddyInviteProps) {
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCreateInvite = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/buddies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-invite' }),
      });
      const data = await res.json();
      if (data.inviteUrl) {
        setInviteUrl(data.inviteUrl);
      }
    } catch {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <div
      className={`rounded-xl p-5 ${className}`}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-secondary)',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 63, 135, 0.1)' }}
        >
          <svg
            className="w-5 h-5"
            style={{ color: 'var(--royal-blue)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-[var(--text-primary)]">Learning Buddies</h3>
          <p className="text-xs text-[var(--text-muted)]">Invite friends to learn together</p>
        </div>
      </div>

      {!inviteUrl ? (
        <button
          onClick={handleCreateInvite}
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:shadow-md disabled:opacity-50"
          style={{ backgroundColor: 'var(--royal-blue)' }}
        >
          {loading ? 'Generating...' : 'Create Invite Link'}
        </button>
      ) : (
        <div className="space-y-3">
          <div
            className="flex items-center gap-2 p-2 rounded-lg text-xs"
            style={{
              backgroundColor: 'rgba(0, 63, 135, 0.04)',
              border: '1px solid rgba(0, 63, 135, 0.1)',
            }}
          >
            <span className="flex-1 truncate text-[var(--text-secondary)]">{inviteUrl}</span>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 px-3 py-1 rounded text-xs font-medium text-white"
              style={{ backgroundColor: 'var(--royal-blue)' }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-[var(--text-muted)] text-center">
            Share this link with a friend to connect
          </p>
        </div>
      )}
    </div>
  );
}

export default BuddyInvite;
