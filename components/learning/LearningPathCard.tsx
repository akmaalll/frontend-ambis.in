import React from 'react';

interface LearningPathCardProps {
  title: string;
  subject: string;
  description: string;
  moduleCount: number;
  onClick: () => void;
  icon?: string;
}

export function LearningPathCard({
  title,
  subject,
  description,
  moduleCount,
  onClick,
  icon = '📚',
}: LearningPathCardProps) {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border-l-4 border-blue-500 hover:border-purple-500 cursor-pointer hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-5xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
          {moduleCount} Module
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-6">{description}</p>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="text-blue-600 font-medium text-sm hover:text-blue-700 transition flex items-center gap-1 group/btn"
      >
        Mulai Belajar
        <svg
          className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </button>
    </div>
  );
}

export default LearningPathCard;
