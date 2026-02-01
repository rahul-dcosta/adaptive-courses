'use client';

import { useEffect, useState } from 'react';

interface ShortcutAction {
  key: string;
  label: string;
  action: () => void;
  ctrl?: boolean;
  shift?: boolean;
}

export default function KeyboardShortcuts({ shortcuts }: { shortcuts: ShortcutAction[] }) {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Show/hide help with ?
      if (e.key === '?' && !e.ctrlKey && !e.shiftKey) {
        e.preventDefault();
        setShowHelp(!showHelp);
        return;
      }

      // Execute shortcuts
      shortcuts.forEach(shortcut => {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        
        if (e.key === shortcut.key && ctrlMatch && shiftMatch) {
          e.preventDefault();
          shortcut.action();
        }
      });

      // Close help with Escape
      if (e.key === 'Escape' && showHelp) {
        setShowHelp(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [shortcuts, showHelp]);

  if (!showHelp) {
    return (
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 right-4 w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-all hover:scale-110 shadow-lg z-50 text-sm font-bold"
        title="Keyboard shortcuts"
      >
        ?
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={() => setShowHelp(false)}
      />
      
      {/* Help modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Keyboard Shortcuts</h2>
            <button
              onClick={() => setShowHelp(false)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-gray-700">{shortcut.label}</span>
                <div className="flex items-center gap-1">
                  {shortcut.ctrl && (
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-mono">
                      ⌘/Ctrl
                    </kbd>
                  )}
                  {shortcut.shift && (
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-mono">
                      ⇧
                    </kbd>
                  )}
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-mono">
                    {shortcut.key.toUpperCase()}
                  </kbd>
                </div>
              </div>
            ))}
            
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-700">Show this help</span>
              <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-mono">
                ?
              </kbd>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-700">Close</span>
              <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-mono">
                ESC
              </kbd>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
