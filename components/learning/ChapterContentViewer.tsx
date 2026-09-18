'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface ChapterContentViewerProps {
  title: string;
  content: string;
  moduleTitle?: string;
  onComplete: () => void;
  hasQuiz: boolean;
  onStartQuiz: () => void;
  isCompleted?: boolean;
}

export function ChapterContentViewer({
  title,
  content,
  moduleTitle = '',
  onComplete,
  hasQuiz,
  onStartQuiz,
  isCompleted = false,
}: ChapterContentViewerProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button
            onClick={() => router.back()}
            className="hover:text-gray-700 transition"
          >
            ← Kembali
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700">{moduleTitle}</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{title}</span>
        </nav>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {content.split('\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 flex flex-wrap gap-4">
            <button
              onClick={onComplete}
              disabled={isCompleted}
              className={`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 ${
                isCompleted
                  ? 'bg-green-100 text-green-700 cursor-default'
                  : 'bg-green-50 text-green-700 border border-green-300 hover:bg-green-100'
              }`}
            >
              <svg
                className={`w-5 h-5 ${isCompleted ? 'text-green-600' : ''}`}
                fill={isCompleted ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {isCompleted ? (
                '✓ Selesai Membaca'
              ) : (
                '✓ Selesai Membaca'
              )}
            </button>

            {hasQuiz && (
              <button
                onClick={onStartQuiz}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                📝 Kerjakan Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChapterContentViewer;
