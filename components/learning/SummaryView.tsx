'use client';

import React from 'react';
import { ProgressBar } from './ProgressBar';

interface SummaryViewProps {
  pathTitle: string;
  totalProgress: number;
  completedModules: number;
  totalModules: number;
  studyTime: number;
  averageQuizScore: number;
  modules: Array<{
    id: string;
    title: string;
    completedChapters: number;
    totalChapters: number;
    progress: number;
    averageScore?: number;
    isCompleted: boolean;
  }>;
  onViewModule?: (moduleId: string) => void;
}

export function SummaryView({
  pathTitle,
  totalProgress,
  completedModules,
  totalModules,
  studyTime,
  averageQuizScore,
  modules,
  onViewModule,
}: SummaryViewProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          PEMBELAJARAN {pathTitle.toUpperCase()}
        </h1>
        <p className="text-gray-600 mb-8">Overview kemajuan belajarmu</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
            <p className="text-sm opacity-90 mb-1">Progres Keseluruhan</p>
            <p className="text-3xl font-bold">{totalProgress}%</p>
            <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${totalProgress}%` }} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
            <p className="text-sm opacity-90 mb-1">Module Selesai</p>
            <p className="text-3xl font-bold">{completedModules}/{totalModules}</p>
            <p className="text-xs opacity-80 mt-1">semua module</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
            <p className="text-sm opacity-90 mb-1">Waktu Belajar</p>
            <p className="text-3xl font-bold">{studyTime}h</p>
            <p className="text-xs opacity-80 mt-1">total jam</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
            <p className="text-sm opacity-90 mb-1">Rata-rata Quiz</p>
            <p className="text-3xl font-bold">{averageQuizScore}%</p>
            <p className="text-xs opacity-80 mt-1">skor rata-rata</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Progress Module
          </h2>

          <div className="space-y-6">
            {modules.map((module) => (
              <div
                key={module.id}
                className="border-b border-gray-100 pb-4 last:border-b-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{module.title}</h3>
                    <p className="text-xs text-gray-500">
                      {module.completedChapters}/{module.totalChapters} chapter
                    </p>
                  </div>
                  {module.isCompleted && (
                    <span className="text-green-600 font-medium">✓ Selesai</span>
                  )}
                </div>

                <ProgressBar
                  value={module.progress}
                  label={`Progress: ${module.completedChapters} dari ${module.totalChapters} chapter`}
                  showPercentage={false}
                />

                {module.averageScore !== undefined && (
                  <p className="text-xs text-gray-500 mt-2">
                    Rata-rata quiz: {module.averageScore}%
                  </p>
                )}
                {onViewModule && (
                  <button
                    onClick={() => onViewModule(module.id)}
                    className="mt-2 text-blue-600 text-sm font-medium hover:text-blue-700 transition flex items-center gap-1"
                  >
                    Lihat Detail
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {completedModules === totalModules && totalModules > 0 && (
          <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Selamat! Kamu Telah Menyelesaikan {pathTitle}!
            </h2>
            <p className="text-green-700">
              Kamu telah menyelesaikan semua module dan chapter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SummaryView;
