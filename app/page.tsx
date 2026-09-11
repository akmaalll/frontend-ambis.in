'use client';

import { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import FeatureSelector from '@/components/Chat/FeatureSelector';
import MessageList from '@/components/Chat/MessageList';
import { InitialQuestionsModal } from '@/components/Modal/InitialQuestionsModal';
import { LoginPromptModal } from '@/components/Modal/LoginPromptModal';
import Mascot from '@/components/Mascot/Mascot';
import PersonalityModal from '@/components/Mascot/PersonalityModal';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

const CHAT_HISTORY_KEY = 'ambisin_chat_history';

function loadChatHistory(): ChatHistory[] {
  try {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        messages: chat.messages.map((m: any) => ({
          ...m,
          createdAt: new Date(m.createdAt),
        })),
      }));
    }
  } catch (error) {
    console.error('Error loading chat history:', error);
  }
  return [];
}

function saveChatHistory(history: ChatHistory[]) {
  try {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
}

export default function HomePage() {
  const [showInitialModal, setShowInitialModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const [hasAnsweredQuestions, setHasAnsweredQuestions] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showPersonalityModal, setShowPersonalityModal] = useState(false);
  const [mascotMessage, setMascotMessage] = useState('Halo! Saya asisten belajar Anda 🎓');
  const [mascotMood, setMascotMood] = useState<'happy' | 'thinking' | 'waving' | 'idle'>('waving');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasLoaded = useRef(false);
  const isSaving = useRef(false);

  // Load chat history from localStorage on mount
  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const history = loadChatHistory();
    setChatHistory(history);

    const stored = localStorage.getItem('hasCompletedInitialQuestions');
    if (stored === 'true') {
      setHasAnsweredQuestions(true);
      setShowInitialModal(false);
    } else {
      setShowInitialModal(true);
    }
  }, []);

  // Save chat history to localStorage whenever it changes (after initial load)
  useEffect(() => {
    if (!hasLoaded.current || isSaving.current) return;
    saveChatHistory(chatHistory);
  }, [chatHistory]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [message]);

  useEffect(() => {
    if (chatCount === 3) {
      setShowLoginModal(true);
    }
  }, [chatCount]);

  const handleContinueLater = () => {
    setShowLoginModal(false);
    setIsBlocked(true);
  };

  const handlePersonalityComplete = (prefs: any) => {
    localStorage.setItem('learningPreferences', JSON.stringify(prefs));
    setShowPersonalityModal(false);
    setMascotMessage('Terima preferensi belajarmu! 🎉');
    setMascotMood('happy');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInitialQuestionsSubmit = (answers: { goal: string; interest: string; level: string }) => {
    localStorage.setItem('hasCompletedInitialQuestions', 'true');
    localStorage.setItem('initialAnswers', JSON.stringify(answers));
    setHasAnsweredQuestions(true);
    setShowInitialModal(false);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Block sending if user hasn't logged in after seeing the modal
    if (isBlocked) {
      setShowLoginModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      createdAt: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    const currentMessage = message;
    setMessage('');
    setIsLoading(true);
    setChatCount((prev) => prev + 1);

    // Create new chat if this is the first message
    const chatId = currentChatId || Date.now().toString();
    if (!currentChatId) {
      setCurrentChatId(chatId);
      const title = message.slice(0, 40) + (message.length > 40 ? '...' : '');
      const newHistory: ChatHistory = {
        id: chatId,
        title,
        messages: [userMessage],
        createdAt: new Date(),
      };
      isSaving.current = true;
      setChatHistory((prev) => {
        const updated = [newHistory, ...prev];
        saveChatHistory(updated);
        setTimeout(() => { isSaving.current = false; }, 0);
        return updated;
      });
    } else {
      // Update existing chat
      setChatHistory((prev) => {
        const updated = prev.map((chat) =>
          chat.id === chatId ? { ...chat, messages: updatedMessages } : chat
        );
        saveChatHistory(updated);
        return updated;
      });
    }

    // Simulate AI response for now (until API is ready)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Terima kasih atas pertanyaanmu: "${currentMessage}".\n\nAI Assistant sedang memproses jawaban... (Mode demo - belum terhubung ke backend AI)`,
        createdAt: new Date(),
      };
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      setIsLoading(false);

      // Update history with assistant response
      const finalChatId = currentChatId || chatId;
      setChatHistory((prev) => {
        const updated = prev.map((chat) =>
          chat.id === finalChatId ? { ...chat, messages: finalMessages } : chat
        );
        saveChatHistory(updated);
        return updated;
      });
    }, 1000);
  };

  const handleNewChat = () => {
    // Reset for new chat
    setMessages([]);
    setChatCount(0);
    setShowLoginModal(false);
    setMessage('');
    setCurrentChatId(null);
    setIsBlocked(false);
  };

  const handleSelectChat = (chatId: string) => {
    const chat = chatHistory.find((c) => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setChatCount(chat.messages.filter((m) => m.role === 'user').length);
      setCurrentChatId(chat.id);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes}m lalu`;
    if (hours < 24) return `${hours}h lalu`;
    return `${days}d lalu`;
  };

  const handleLearningPathClick = () => {
    if (hasAnsweredQuestions) {
      window.location.href = '/dashboard/learning';
    } else {
      setShowInitialModal(true);
    }
  };

  return (
    <MainLayout
      onNewChat={handleNewChat}
      onSelectChat={handleSelectChat}
      onLearningPathClick={handleLearningPathClick}
      chats={chatHistory.map((c) => ({
        id: c.id,
        title: c.title,
        preview: c.messages[c.messages.length - 1]?.content?.slice(0, 60),
        updatedAt: c.createdAt,
      }))}
    >
      <div className="flex flex-col h-full">
        {/* Header info - only show when no messages */}
        {messages.length === 0 && (
          <div className="text-center py-4 md:py-6 px-4 flex-shrink-0">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
              Halo! Apa yang ingin kamu lakukan hari ini?
            </h1>
            <p className="text-gray-500 text-xs md:text-sm">
              Pilih fitur atau langsung ketik pesan di bawah
            </p>
          </div>
        )}

        {/* Feature Selector - only when no messages */}
        {messages.length === 0 && (
          <div className="px-4 pb-4 flex-shrink-0">
            <FeatureSelector
              hasAnsweredQuestions={hasAnsweredQuestions}
              onLearningPathClick={() => setShowInitialModal(true)}
            />
            
            {/* Personalize CTA */}
            <button
              onClick={() => setShowPersonalityModal(true)}
              className="w-full mt-4 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                {/* <span className="text-2xl">🎯</span> */}
              <div className="text-left">
                <p className="font-semibold">Personalisasi Gaya Belajar</p>
                <p className="text-sm text-white/80">Sesuaikan pengalaman belajarmu</p>
              </div>
              <svg className="w-5 h-5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Message List - dynamic, scrollable */}
        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          <MessageList messages={messages} />
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-3 rounded-bl-none">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input - fixed at bottom */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 items-center">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ketik atau paste teks panjang... (Shift+Enter untuk baris baru)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400 min-h-[44px] max-h-[200px] overflow-y-auto no-scrollbar"
                style={{ color: '#111827', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition h-full"
              >
                {isLoading ? '...' : 'Kirim'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1.5 text-center">
              Chat {chatCount}/3 &middot; Ambis.In AI
            </p>
          </div>
        </div>
      </div>

      <InitialQuestionsModal
        isOpen={showInitialModal}
        onClose={() => setShowInitialModal(false)}
        onSkip={() => setShowInitialModal(false)}
        onSubmit={handleInitialQuestionsSubmit}
      />

      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={handleContinueLater}
      />

      {/* Mascot */}
      <Mascot 
        message={mascotMessage} 
        mood={mascotMood}
        showChat={true}
      />

      {/* Personality Modal */}
      <PersonalityModal
        isOpen={showPersonalityModal}
        onClose={() => setShowPersonalityModal(false)}
        onComplete={handlePersonalityComplete}
      />
    </MainLayout>
  );
}
