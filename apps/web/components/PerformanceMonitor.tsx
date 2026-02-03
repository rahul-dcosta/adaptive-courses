'use client';

import { useEffect } from 'react';

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

/**
 * Performance monitoring component
 * Tracks Core Web Vitals and sends to analytics
 */
export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // Track page load time
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

      if (perfData) {
        const metrics = {
          dns: perfData.domainLookupEnd - perfData.domainLookupStart,
          tcp: perfData.connectEnd - perfData.connectStart,
          ttfb: perfData.responseStart - perfData.requestStart,
          download: perfData.responseEnd - perfData.responseStart,
          domInteractive: perfData.domInteractive - perfData.fetchStart,
          domComplete: perfData.domComplete - perfData.fetchStart,
          loadComplete: perfData.loadEventEnd - perfData.fetchStart
        };

        // Send to analytics
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'performance_metrics',
            properties: metrics
          })
        }).catch(() => {});
      }
    });

    // Track Core Web Vitals using web-vitals library pattern
    const reportWebVitals = (metric: WebVitalMetric) => {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'web_vital',
          properties: {
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta,
            id: metric.id
          }
        })
      }).catch(() => {});
    };

    // Simple LCP tracking (Largest Contentful Paint)
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };

      if (lastEntry) {
        const lcpTime = lastEntry.renderTime || lastEntry.loadTime || 0;
        reportWebVitals({
          name: 'LCP',
          value: lcpTime,
          rating: lcpTime < 2500 ? 'good' : lcpTime < 4000 ? 'needs-improvement' : 'poor',
          delta: lcpTime,
          id: `lcp-${Date.now()}`
        });
      }
    });

    try {
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      // LCP not supported
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
}
