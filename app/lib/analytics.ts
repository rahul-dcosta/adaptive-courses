export async function track(event: string, properties?: Record<string, any>) {
  try {
    if (typeof window === 'undefined') return; // Server-side, skip
    
    // Send to our API
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, properties })
    });

    // TODO: Add Google Analytics tracking
    // if (window.gtag) {
    //   window.gtag('event', event, properties);
    // }
  } catch (error) {
    console.error('Tracking error:', error);
  }
}

// Convenience functions
export const analytics = {
  pageView: (page: string) => track('page_view', { page }),
  emailSignup: (email: string) => track('email_signup', { email }),
  courseStarted: (topic: string) => track('course_started', { topic }),
  courseGenerated: (topic: string, duration: number) => track('course_generated', { topic, duration }),
  paymentInitiated: (amount: number) => track('payment_initiated', { amount }),
  paymentCompleted: (amount: number) => track('payment_completed', { amount }),
};
