/**
 * Simple A/B Testing Framework
 * 
 * Usage:
 * const variant = getVariant('pricing_test');
 * if (variant === 'A') { ... } else { ... }
 */

interface Experiment {
  id: string;
  variants: string[];
  weights?: number[]; // Optional weights (defaults to equal distribution)
}

const EXPERIMENTS: Record<string, Experiment> = {
  // Pricing test: $5 vs $7.99 vs $9.99
  pricing_test: {
    id: 'pricing_test',
    variants: ['control_5', 'variant_799', 'variant_999'],
    weights: [0.5, 0.25, 0.25] // 50% control, 25% each variant
  },
  
  // Headline test
  headline_test: {
    id: 'headline_test',
    variants: ['learn_anything', 'master_any_skill', 'get_expert_fast'],
  },
  
  // CTA button copy
  cta_test: {
    id: 'cta_test',
    variants: ['start_learning', 'generate_course', 'get_started'],
  },
  
  // Urgency type
  urgency_test: {
    id: 'urgency_test',
    variants: ['countdown', 'limited_slots', 'both', 'none'],
  },
  
  // First course pricing
  first_course_test: {
    id: 'first_course_test',
    variants: ['free', 'pay_5'],
    weights: [0.8, 0.2] // 80% free, 20% paid (to test if free is necessary)
  }
};

/**
 * Get variant for a user (uses localStorage for consistency)
 */
export function getVariant(experimentId: string): string {
  if (typeof window === 'undefined') {
    // Server-side: return control
    const experiment = EXPERIMENTS[experimentId];
    return experiment?.variants[0] || 'control';
  }

  const experiment = EXPERIMENTS[experimentId];
  if (!experiment) {
    console.warn(`Experiment ${experimentId} not found`);
    return 'control';
  }

  // Check if user already has a variant assigned
  const storageKey = `ab_${experimentId}`;
  const existing = localStorage.getItem(storageKey);
  if (existing && experiment.variants.includes(existing)) {
    return existing;
  }

  // Assign new variant
  const variant = selectVariant(experiment);
  localStorage.setItem(storageKey, variant);
  
  // Track assignment
  trackExperiment(experimentId, variant);
  
  return variant;
}

/**
 * Select variant based on weights
 */
function selectVariant(experiment: Experiment): string {
  const { variants, weights } = experiment;
  
  if (!weights || weights.length !== variants.length) {
    // Equal distribution
    const randomIndex = Math.floor(Math.random() * variants.length);
    return variants[randomIndex];
  }

  // Weighted distribution
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < variants.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return variants[i];
    }
  }
  
  return variants[0];
}

/**
 * Track experiment assignment
 */
function trackExperiment(experimentId: string, variant: string) {
  if (typeof window !== 'undefined') {
    // Send to analytics
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'experiment_assigned',
        properties: {
          experiment_id: experimentId,
          variant: variant,
          timestamp: new Date().toISOString()
        }
      })
    }).catch(err => console.error('Failed to track experiment:', err));
  }
}

/**
 * Track conversion for experiment
 */
export function trackConversion(experimentId: string, conversionType: string, value?: number) {
  if (typeof window === 'undefined') return;
  
  const variant = getVariant(experimentId);
  
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'experiment_conversion',
      properties: {
        experiment_id: experimentId,
        variant: variant,
        conversion_type: conversionType,
        value: value,
        timestamp: new Date().toISOString()
      }
    })
  }).catch(err => console.error('Failed to track conversion:', err));
}

/**
 * Hook for React components
 */
export function useVariant(experimentId: string): string {
  if (typeof window === 'undefined') {
    const experiment = EXPERIMENTS[experimentId];
    return experiment?.variants[0] || 'control';
  }
  
  return getVariant(experimentId);
}

/**
 * Get all active experiments (for debugging)
 */
export function getActiveExperiments(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  
  const active: Record<string, string> = {};
  
  Object.keys(EXPERIMENTS).forEach(expId => {
    const variant = localStorage.getItem(`ab_${expId}`);
    if (variant) {
      active[expId] = variant;
    }
  });
  
  return active;
}

/**
 * Reset all experiments (for testing)
 */
export function resetExperiments() {
  if (typeof window === 'undefined') return;
  
  Object.keys(EXPERIMENTS).forEach(expId => {
    localStorage.removeItem(`ab_${expId}`);
  });
}
