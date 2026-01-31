'use client';

import { useState } from 'react';

interface Props {
  source?: string;
  onSuccess?: () => void;
}

export default function NewsletterSignup({ source = 'footer', onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/email-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source })
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setMessage(data.alreadyExists ? 'Already subscribed!' : 'Thanks for subscribing!');
        setEmail('');
        if (onSuccess) onSuccess();
      } else {
        setMessage(data.error || 'Something went wrong');
      }
    } catch (error) {
      setMessage('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none text-gray-900"
          required
          disabled={loading || success}
        />
        <button
          type="submit"
          disabled={loading || success || !email.includes('@')}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 whitespace-nowrap"
        >
          {loading ? 'Subscribing...' : success ? '✓ Subscribed' : 'Subscribe'}
        </button>
      </form>
      {message && (
        <p className={`mt-2 text-sm ${success ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
