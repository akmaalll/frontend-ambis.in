'use client';

import { useState, useEffect, useRef } from 'react';

interface MascotProps {
  message?: string;
  mood?: 'happy' | 'thinking' | 'waving' | 'idle';
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-left';
  showChat?: boolean;
  onToggle?: () => void;
}

export default function Mascot({ 
  message = 'Halo! Saya asisten belajar Anda 🎓', 
  mood = 'idle',
  size = 'md',
  position = 'bottom-right',
  showChat = false,
  onToggle
}: MascotProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isBlinking, setIsBlinking] = useState(false);
  const [currentMood, setCurrentMood] = useState(mood);
  const [mounted, setMounted] = useState(false);
  const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mark as mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Blink animation - only after mount
  useEffect(() => {
    if (!mounted) return;
    
    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 2000;
      blinkTimeoutRef.current = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 200);
      }, delay);
    };
    
    scheduleBlink();
    return () => {
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current);
      }
    };
  }, [mounted]);

  // Wave animation on mount
  useEffect(() => {
    if (!mounted) return;
    setCurrentMood('waving');
    const timer = setTimeout(() => setCurrentMood('idle'), 2000);
    return () => clearTimeout(timer);
  }, [mounted]);

  if (!isVisible) {
    return (
      <button
        onClick={() => { setIsVisible(true); onToggle?.(); }}
        className={`fixed ${position === 'bottom-right' ? 'right-4' : 'left-4'} bottom-4 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform`}
      >
        🤖
      </button>
    );
  }

  const sizeClasses = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-20 h-20 text-4xl'
  };

  const positionClasses = position === 'bottom-right' 
    ? 'right-4 bottom-4' 
    : 'left-4 bottom-4';

  return (
    <div className={`fixed ${positionClasses} z-50 flex flex-col items-end gap-2`}>
      {/* Chat bubble */}
      {showChat && message && (
        <div className="bg-white rounded-2xl shadow-xl p-4 max-w-[280px] border border-gray-100 animate-fade-in">
          <p className="text-sm text-gray-700">{message}</p>
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-gray-100 transform rotate-45"></div>
        </div>
      )}

      {/* Mascot button */}
      <button
        onClick={() => { setIsVisible(false); onToggle?.(); }}
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center hover:scale-110 transition-transform relative overflow-hidden`}
      >
        {/* Face */}
        <div className="relative z-10">
          {currentMood === 'waving' ? (
            <span className="animate-wave inline-block">👋</span>
          ) : currentMood === 'thinking' ? (
            <span className="inline-block">🤔</span>
          ) : currentMood === 'happy' ? (
            <span className="inline-block">😊</span>
          ) : (
            <span 
              className="inline-block" 
              style={{ 
                transform: mounted && isBlinking ? 'scaleY(0)' : 'scaleY(1)',
                transition: 'transform 0.1s'
              }}
            >
              {mounted && isBlinking ? '😌' : '🤖'}
            </span>
          )}
        </div>

        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
      </button>
    </div>
  );
}
