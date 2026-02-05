'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

// Clean up any orphaned Mermaid error elements from the DOM
function cleanupMermaidErrors() {
  if (typeof document === 'undefined') return;

  // Remove any stray Mermaid error SVGs or elements
  const errorElements = document.querySelectorAll(
    '[id^="dmermaid"], svg[aria-roledescription="error"], .mermaid-error'
  );
  errorElements.forEach(el => el.remove());
}

export default function MermaidDiagram({ chart, className = '' }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // Initialize mermaid with suppressed errors
    // SECURITY: Use 'strict' to prevent XSS via diagram content
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'strict',
      fontFamily: 'inherit',
      suppressErrorRendering: true,
    });

    const renderDiagram = async () => {
      if (containerRef.current && chart) {
        try {
          // Clear previous content
          containerRef.current.innerHTML = '';

          // Clean up any stray error elements before rendering
          cleanupMermaidErrors();

          // Render the diagram
          const { svg } = await mermaid.render(idRef.current, chart);
          containerRef.current.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          // Clean up error elements that Mermaid may have created
          cleanupMermaidErrors();

          // Show a clean error message
          containerRef.current.innerHTML = `
            <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm">
              <p>Diagram could not be rendered</p>
            </div>
          `;
        }
      }
    };

    renderDiagram();

    // Cleanup on unmount
    return () => {
      cleanupMermaidErrors();
    };
  }, [chart]);

  return (
    <div
      ref={containerRef}
      className={`mermaid-container my-6 flex justify-center items-center ${className}`}
    />
  );
}
