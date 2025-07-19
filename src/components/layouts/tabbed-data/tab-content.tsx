// components/TabContent.tsx
import { useTabStore } from '@/lib/tab-store';
import React, { useEffect } from 'react';

interface TabContentProps {
  content: React.ReactNode;
  prevContent: React.ReactNode;
  context: string; // Context identifier for tab state
}

const TabContent: React.FC<TabContentProps> = ({ content, prevContent, context }) => {
  const { contexts, resetSliding } = useTabStore();
  const currentContext = contexts[context];
  const activeTab = currentContext?.activeTab || '';
  const prevTab = currentContext?.prevTab || '';
  const isSliding = currentContext?.isSliding || false;
  const slideDirection = currentContext?.slideDirection || null;

  useEffect(() => {
    if (isSliding) {
      const timer = setTimeout(() => {
        resetSliding(context);
      }, 500); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isSliding, context, resetSliding]);

  const getIncomingSlideClass = () => {
    if (!isSliding) return "transform translate-x-0";
    return slideDirection === "right"
      ? "animate-slide-to-right-incoming"
      : "animate-slide-to-left-incoming";
  };

  return (
    <>
      <style jsx>{`
        @keyframes slide-to-left-incoming {
          0% { transform: translateX(-100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-to-right-incoming {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-to-left-incoming {
          animation: slide-to-left-incoming 0.5s ease-in-out;
        }
        .animate-slide-to-right-incoming {
          animation: slide-to-right-incoming 0.5s ease-in-out;
        }
      `}</style>
      <div className={`relative w-full ${isSliding && ("overflow-hidden")}`}>
        {/* Outgoing content (previous tab) */}
        {isSliding && (
          <div
            className="absolute top-0 left-0 w-full hidden"
            key={`outgoing-${prevTab}`}
          >
            {prevContent}
          </div>
        )}
        {/* Incoming content (current tab) */}
        <div
          className={`relative w-full ${getIncomingSlideClass()}`}
          key={`incoming-${activeTab}`}
        >
          {content}
        </div>
      </div>
    </>
  );
};

export default TabContent;
