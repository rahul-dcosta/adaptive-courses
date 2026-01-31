'use client';

/**
 * Mobile-specific CSS optimizations
 * Fixes common iOS/Android rendering issues
 */
export default function MobileOptimized({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style jsx global>{`
        /* Fix iOS zoom on input focus */
        @supports (-webkit-touch-callout: none) {
          input[type="text"],
          input[type="email"],
          input[type="number"],
          textarea,
          select {
            font-size: 16px !important;
          }
        }

        /* Prevent zoom on double-tap */
        * {
          touch-action: manipulation;
        }

        /* Smooth scroll on iOS */
        html {
          -webkit-overflow-scrolling: touch;
        }

        /* Better tap highlighting */
        * {
          -webkit-tap-highlight-color: rgba(79, 70, 229, 0.1);
        }

        /* Fix iOS button styling */
        button,
        input[type="button"],
        input[type="submit"] {
          -webkit-appearance: none;
          appearance: none;
        }

        /* Improve touch target sizes */
        button,
        a {
          min-height: 44px;
          min-width: 44px;
        }

        /* Better viewport units on mobile */
        .min-h-screen {
          min-height: 100vh;
          min-height: -webkit-fill-available;
        }

        /* Prevent text size adjustment on orientation change */
        html {
          -webkit-text-size-adjust: 100%;
          text-size-adjust: 100%;
        }

        /* Hide scrollbar on mobile for cleaner look */
        @media (max-width: 768px) {
          ::-webkit-scrollbar {
            display: none;
          }
          * {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `}</style>
      {children}
    </>
  );
}
