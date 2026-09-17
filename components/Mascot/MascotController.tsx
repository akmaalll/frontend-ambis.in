'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface MascotContextType {
  message: string;
  setMessage: (msg: string) => void;
  mood: 'happy' | 'thinking' | 'waving' | 'idle';
  setMood: (mood: 'happy' | 'thinking' | 'waving' | 'idle') => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  showChat: boolean;
  setShowChat: (show: boolean) => void;
}

const MascotContext = createContext<MascotContextType | undefined>(undefined);

export function MascotProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('Halo! Saya asisten belajar Anda 🎓');
  const [mood, setMood] = useState<'happy' | 'thinking' | 'waving' | 'idle'>('idle');
  const [isVisible, setIsVisible] = useState(true);
  const [showChat, setShowChat] = useState(true);

  // Auto-hide chat after 5 seconds
  useEffect(() => {
    if (showChat) {
      const timer = setTimeout(() => setShowChat(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showChat, message]);

  return (
    <MascotContext.Provider value={{
      message, setMessage,
      mood, setMood,
      isVisible, setIsVisible,
      showChat, setShowChat,
    }}>
      {children}
    </MascotContext.Provider>
  );
}

export function useMascot() {
  const context = useContext(MascotContext);
  if (!context) {
    throw new Error('useMascot must be used within MascotProvider');
  }
  return context;
}

// Page-specific mascot messages
export const mascotMessages = {
  home: {
    greeting: 'Halo! Saya asisten belajar Anda 🎓',
    chat: 'Tanya apa saja tentang pelajaran! 📚',
    learningPath: 'Mulai perjalanan belajarmu di sini! 🚀',
  },
  learningPath: {
    greeting: 'Pilih jalur belajar yang sesuai dengan minatmu! 📚',
    subject: 'Matematika atau Informatika? Pilih yang kamu suka! 🎯',
    module: 'Setiap module punya materi menarik! 📖',
  },
  chapter: {
    greeting: 'Mari kita pelajari materi ini bersama! 📖',
    quiz: 'Siap untuk menguji pemahamanmu? 🧠',
    complete: 'Selamat! Kamu sudah menyelesaikan chapter ini! 🎉',
  },
  quiz: {
    greeting: 'Waktunya quiz! Jawab dengan teliti ya! ✏️',
    correct: 'Benar! Kamu hebat! 🌟',
    wrong: 'Belum tepat, coba lagi! 💪',
    complete: 'Quiz selesai! Lihat hasilmu! 🎯',
  },
};
