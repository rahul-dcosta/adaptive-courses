'use client';

import { useEffect, useRef } from 'react';

export interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  divider?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
  context?: {
    type: 'lesson' | 'diagram' | 'text' | 'quiz';
    data?: unknown;
  };
}

export default function ContextMenu({ x, y, items, onClose, context }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Adjust position if menu would go off screen
    if (menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();

      // Adjust horizontal position
      if (x + rect.width > window.innerWidth - 16) {
        menu.style.left = `${window.innerWidth - rect.width - 16}px`;
      }

      // Adjust vertical position
      if (y + rect.height > window.innerHeight - 16) {
        menu.style.top = `${window.innerHeight - rect.height - 16}px`;
      }
    }

    // Close on click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    // Close on escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Close on scroll
    const handleScroll = () => {
      onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 min-w-[200px] py-2 bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-150"
      style={{
        left: x,
        top: y,
        border: '1px solid rgba(0, 63, 135, 0.12)',
        boxShadow: '0 8px 32px rgba(0, 63, 135, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Context header */}
      {context && (
        <div
          className="px-4 py-2 mb-1 text-xs font-semibold uppercase tracking-wider border-b"
          style={{
            color: 'var(--royal-blue)',
            borderColor: 'rgba(0, 63, 135, 0.08)',
            backgroundColor: 'rgba(0, 63, 135, 0.03)'
          }}
        >
          {context.type === 'lesson' && 'Lesson Options'}
          {context.type === 'diagram' && 'Diagram Options'}
          {context.type === 'text' && 'Content Options'}
          {context.type === 'quiz' && 'Quiz Options'}
        </div>
      )}

      {items.map((item, index) => (
        <div key={index}>
          {item.divider ? (
            <div
              className="my-1 mx-3 border-t"
              style={{ borderColor: 'rgba(0, 63, 135, 0.08)' }}
            />
          ) : (
            <button
              onClick={() => {
                if (!item.disabled) {
                  item.onClick();
                  onClose();
                }
              }}
              disabled={item.disabled}
              className={`
                w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors duration-150
                ${item.disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900'
                }
              `}
              style={{
                backgroundColor: item.disabled ? 'transparent' : undefined,
              }}
              onMouseEnter={(e) => {
                if (!item.disabled) {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 63, 135, 0.06)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {item.icon && (
                <span className="w-5 h-5 flex items-center justify-center opacity-70">
                  {item.icon}
                </span>
              )}
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          )}
        </div>
      ))}

      {/* Branding footer */}
      <div
        className="mt-1 pt-2 px-4 pb-1 border-t flex items-center gap-2"
        style={{ borderColor: 'rgba(0, 63, 135, 0.08)' }}
      >
        <div
          className="w-4 h-4 rounded flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: 'var(--royal-blue)' }}
        >
          A
        </div>
        <span className="text-xs text-gray-400">Adaptive Courses</span>
      </div>
    </div>
  );
}

// Icon components for menu items
export const Icons = {
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Chat: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  Copy: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  Bookmark: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  ),
  Expand: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  ),
  Highlight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
  Share: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  ),
  Reset: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
};
