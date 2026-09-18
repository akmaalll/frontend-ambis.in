'use client';

import { useState, useEffect } from 'react';

interface MascotChatProps {
  message: string;
  isVisible: boolean;
  onDismiss: () => void;
  position?: 'bottom-right' | 'bottom-left';
}

export default function MascotChat({ message, isVisible, onDismiss, position = 'bottom-right' }: MascotChatProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, message]);

  if (!isVisible) return null;

  const positionClasses = position === 'bottom-right' 
    ? 'right-24 bottom-24' 
    : 'left-24 bottom-24';

  return (
    <div className={`fixed ${positionClasses} z-50 max-w-[280px] animate-scale-in`}>
      <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
        <button
          onClick={onDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl flex-shrink-0">
            🤖
          </div>
          <div>
            <p className="text-sm text-gray-700">{message}</p>
          </div>
        </div>
        <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-r border-b border-gray-100 transform rotate-45"></div>
      </div>
    </div>
  );
}
