'use client';

import { useEffect, useCallback, useRef, useState } from 'react';

/**
 * GlossaryTooltip hooks into [data-glossary] spans in the lesson content.
 * On desktop: hover shows tooltip. On mobile: tap toggles tooltip.
 * Must be mounted inside a container that has [data-glossary] spans.
 */
export function useGlossaryTooltips(containerRef: React.RefObject<HTMLElement | null>) {
  const [tooltip, setTooltip] = useState<{
    term: string;
    definition: string;
    x: number;
    y: number;
  } | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const showTooltip = useCallback((el: HTMLElement) => {
    const term = el.getAttribute('data-glossary-term') || '';
    const definition = el.getAttribute('data-glossary-def') || '';
    const rect = el.getBoundingClientRect();
    setTooltip({
      term,
      definition,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip(null);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseEnter = (e: Event) => {
      const target = (e.target as HTMLElement).closest('[data-glossary]');
      if (target) showTooltip(target as HTMLElement);
    };

    const handleMouseLeave = (e: Event) => {
      const target = (e.target as HTMLElement).closest('[data-glossary]');
      if (target) hideTooltip();
    };

    const handleClick = (e: Event) => {
      const target = (e.target as HTMLElement).closest('[data-glossary]');
      if (target) {
        e.preventDefault();
        if (tooltip && tooltip.term === target.getAttribute('data-glossary-term')) {
          hideTooltip();
        } else {
          showTooltip(target as HTMLElement);
        }
      } else {
        hideTooltip();
      }
    };

    container.addEventListener('mouseenter', handleMouseEnter, true);
    container.addEventListener('mouseleave', handleMouseLeave, true);
    container.addEventListener('click', handleClick, true);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter, true);
      container.removeEventListener('mouseleave', handleMouseLeave, true);
      container.removeEventListener('click', handleClick, true);
    };
  }, [containerRef, showTooltip, hideTooltip, tooltip]);

  const GlossaryTooltipPortal = tooltip ? (
    <div
      ref={tooltipRef}
      className="fixed z-50 max-w-xs animate-fade-in pointer-events-none"
      style={{
        left: `${tooltip.x}px`,
        top: `${tooltip.y - 8}px`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div
        className="rounded-lg px-4 py-3 shadow-lg text-sm"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-secondary)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        }}
      >
        <p className="font-semibold text-[var(--text-primary)] text-xs uppercase tracking-wider mb-1">
          {tooltip.term}
        </p>
        <p className="text-[var(--text-secondary)] leading-snug">{tooltip.definition}</p>
      </div>
      {/* Arrow */}
      <div
        className="w-2 h-2 mx-auto rotate-45"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRight: '1px solid var(--border-secondary)',
          borderBottom: '1px solid var(--border-secondary)',
          marginTop: '-5px',
        }}
      />
    </div>
  ) : null;

  return { GlossaryTooltipPortal };
}
