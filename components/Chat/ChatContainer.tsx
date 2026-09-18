'use client';

import { useState, useEffect, useRef } from 'react';
import MessageList from '@/components/Chat/MessageList';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

interface ChatContainerProps {
  messages: Message[];
  message: string;
  isLoading: boolean;
  mode: 'ask' | 'learning-path';
  onMessageChange: (msg: string) => void;
  onSendMessage: () => void;
}

export default function ChatContainer({
  messages,
  message,
  isLoading,
  mode,
  onMessageChange,
  onSendMessage,
}: ChatContainerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [message]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const placeholder = mode === 'learning-path'
    ? 'Tanya tentang materi yang kamu pelajari... (Shift+Enter untuk baris baru)'
    : 'Ketik atau paste teks panjang... (Shift+Enter untuk baris baru)';

  return (
    <div className="flex flex-col h-full">
      {/* Message List - dynamic, scrollable */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4">
        <MessageList messages={messages} mode={mode} />
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3 rounded-bl-none">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSendMessage();
                }
              }}
              placeholder={placeholder}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400 min-h-[44px] max-h-[200px] overflow-y-auto no-scrollbar"
              style={{ color: '#111827', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            />
            <button
              onClick={onSendMessage}
              disabled={!message.trim() || isLoading}
              className="px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition h-full"
            >
              {isLoading ? '...' : 'Kirim'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
