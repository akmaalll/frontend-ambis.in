'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProgressBar } from './ProgressBar';

interface ModuleItem {
  id: string;
  title: string;
  chapterCount: number;
  completedChapters: number;
  description: string;
  progress?: number;
}

interface ModuleListProps {
  modules: ModuleItem[];
  onSelectModule: (moduleId: string) => void;
  subjectTitle?: string;
}

export function ModuleList({ modules, onSelectModule, subjectTitle = '' }: ModuleListProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {modules.map((module, index) => {
        const progress = module.progress ?? (module.chapterCount > 0 ? Math.round((module.completedChapters / module.chapterCount) * 100) : 0);
        const isComplete = module.completedChapters === module.chapterCount;

        return (
          <div
            key={module.id}
            className="group bg-white rounded-xl shadow-md transition-all duration-300 p-4 sm:p-6 hover:shadow-lg hover:-translate-y-1 cursor-pointer border border-gray-100 hover:border-blue-200"
            onClick={() => onSelectModule(module.id)}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${
                  isComplete
                    ? 'bg-gradient-to-br from-green-400 to-green-600'
                    : 'bg-gradient-to-br from-blue-400 to-blue-600'
                }`}
              >
                {isComplete ? '✓' : index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                      {module.title}
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">{module.description}</p>
                  </div>

                  <div className="flex-shrink-0">
                    <span
                      className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-medium ${
                        isComplete
                          ? 'bg-green-100 text-green-800'
                          : progress > 0
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {module.completedChapters}/{module.chapterCount}
                    </span>
                  </div>
                </div>

                <ProgressBar
                  value={progress}
                  showPercentage={false}
                />

                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    {Math.round(progress)}% Selesai
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/learning/${subjectTitle.toLowerCase()}/${module.id}`);
                    }}
                    className="text-blue-600 text-sm font-medium hover:text-blue-700 transition flex items-center gap-1 opacity-0 group-hover:opacity-100"
                  >
                    Lihat Detail
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ModuleList;
