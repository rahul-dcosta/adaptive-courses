// Payment and free course eligibility utilities

import { supabase } from './supabase';

// Get or create device fingerprint (client-side)
export function getDeviceFingerprint(): string {
  if (typeof window === 'undefined') return '';

  // Check localStorage first
  let fingerprint = localStorage.getItem('device_fingerprint');

  if (!fingerprint) {
    // Generate a simple fingerprint based on browser characteristics
    const components = [
      navigator.userAgent,
      navigator.language,
      new Date().getTimezoneOffset(),
      screen.width,
      screen.height,
      screen.colorDepth,
      navigator.hardwareConcurrency || 0,
    ];

    // Create a hash-like string
    fingerprint = btoa(components.join('|')).slice(0, 32);
    localStorage.setItem('device_fingerprint', fingerprint);
  }

  return fingerprint;
}

// Check if user is eligible for free course
export async function checkFreeEligibility(): Promise<{
  eligible: boolean;
  reason?: string;
  coursesGenerated: number;
}> {
  try {
    const fingerprint = getDeviceFingerprint();

    if (!fingerprint) {
      // Can't track, give benefit of the doubt
      return { eligible: true, coursesGenerated: 0 };
    }

    // Check device fingerprint in database
    const { data, error } = await supabase
      .from('device_fingerprints')
      .select('free_courses_generated, suspicious')
      .eq('fingerprint_hash', fingerprint)
      .single();

    if (error || !data) {
      // No record found = first time user = eligible
      return { eligible: true, coursesGenerated: 0 };
    }

    if (data.suspicious) {
      return {
        eligible: false,
        reason: 'Account flagged for review',
        coursesGenerated: data.free_courses_generated
      };
    }

    // First course is free
    if (data.free_courses_generated === 0) {
      return { eligible: true, coursesGenerated: 0 };
    }

    return {
      eligible: false,
      reason: 'Free course already used',
      coursesGenerated: data.free_courses_generated
    };

  } catch (err) {
    console.error('Error checking free eligibility:', err);
    // On error, allow the course (better UX than blocking)
    return { eligible: true, coursesGenerated: 0 };
  }
}

// Record that a free course was generated
export async function recordFreeCourse(): Promise<void> {
  try {
    const fingerprint = getDeviceFingerprint();

    if (!fingerprint) return;

    // Upsert device fingerprint record
    const { error } = await supabase
      .from('device_fingerprints')
      .upsert({
        fingerprint_hash: fingerprint,
        free_courses_generated: 1,
        last_seen_at: new Date().toISOString(),
      }, {
        onConflict: 'fingerprint_hash',
      });

    if (error) {
      console.error('Error recording free course:', error);
    }

  } catch (err) {
    console.error('Error recording free course:', err);
  }
}

// Increment free course count
export async function incrementFreeCourseCount(): Promise<void> {
  try {
    const fingerprint = getDeviceFingerprint();

    if (!fingerprint) return;

    // First, get current count
    const { data } = await supabase
      .from('device_fingerprints')
      .select('free_courses_generated')
      .eq('fingerprint_hash', fingerprint)
      .single();

    const currentCount = data?.free_courses_generated || 0;

    // Update with incremented count
    await supabase
      .from('device_fingerprints')
      .upsert({
        fingerprint_hash: fingerprint,
        free_courses_generated: currentCount + 1,
        last_seen_at: new Date().toISOString(),
      }, {
        onConflict: 'fingerprint_hash',
      });

  } catch (err) {
    console.error('Error incrementing free course count:', err);
  }
}

// Redirect to Stripe checkout
export async function redirectToCheckout(params: {
  topic: string;
  courseId?: string;
  email?: string;
  fingerprint?: string;
}): Promise<void> {
  try {
    const response = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create checkout');
    }

    if (data.url) {
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } else {
      throw new Error('No checkout URL returned');
    }

  } catch (err) {
    console.error('Checkout error:', err);
    throw err;
  }
}

// Format price for display
export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
