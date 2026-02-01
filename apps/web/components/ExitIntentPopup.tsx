'use client';

import { useState, useEffect } from 'react';

interface ExitIntentPopupProps {
  onCapture?: (email: string) => void;
  delay?: number; // Show after X seconds even without exit intent
}

export default function ExitIntentPopup({ onCapture, delay = 30000 }: ExitIntentPopupProps) {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed in this session
    if (sessionStorage.getItem('exitPopupDismissed')) {
      setDismissed(true);
      return;
    }

    let delayTimer: NodeJS.Timeout;

    // Exit intent detection (mouse leaves viewport at top)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed && !show) {
        setShow(true);
      }
    };

    // Fallback: Show after delay if user hasn't left
    delayTimer = setTimeout(() => {
      if (!dismissed && !show) {
        setShow(true);
      }
    }, delay);

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(delayTimer);
    };
  }, [dismissed, show, delay]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email.trim()) {
      // Save to database
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        );
        
        await supabase.from('email_signups').insert({
          email,
          source: 'exit_intent_popup'
        });
      } catch (error) {
        console.error('Failed to save email:', error);
      }

      onCapture?.(email);
      handleClose();
    }
  };

  const handleClose = () => {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem('exitPopupDismissed', 'true');
  };

  if (!show || dismissed) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 md:p-12 pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">✋</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Wait! Before you go...
            </h2>
            <p className="text-lg text-gray-600">
              Get your <strong className="text-indigo-600">first course FREE</strong> + 
              early access to new features
            </p>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all"
              required
              autoFocus
            />
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg py-4 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              Get My Free Course →
            </button>
          </form>

          {/* Trust signals */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="text-green-600">✓</span>
              <span>No spam</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-600">✓</span>
              <span>Unsubscribe anytime</span>
            </div>
          </div>

          {/* Early access */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              🚀 <strong>Early Access</strong> • Limited time offer
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
