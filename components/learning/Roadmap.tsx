'use client';

import { useState, useEffect } from 'react';

interface RoadmapNode {
  id: string;
  title: string;
  icon: string;
  description: string;
  status: 'locked' | 'in-progress' | 'completed';
  subjectId?: string;
  moduleId?: string;
}

interface LearningRoadmapProps {
  onNodeClick?: (node: RoadmapNode) => void;
}

const ROADMAP_STORAGE_KEY = 'ambisin_roadmap_progress';

function loadRoadmapProgress(): Record<string, string> {
  try {
    const stored = localStorage.getItem(ROADMAP_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveRoadmapProgress(progress: Record<string, string>) {
  localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(progress));
}

const initialRoadmap: RoadmapNode[] = [
  {
    id: 'mulai-belajar',
    title: 'Mulai Belajar',
    icon: '🚀',
    description: 'Tentukan tujuan belajarmu',
    status: 'in-progress',
  },
  {
    id: 'matematika',
    title: 'Matematika',
    icon: '🔢',
    description: 'Pelajari dasar-dasar Matematika',
    status: 'locked',
    subjectId: 'matematika',
  },
  {
    id: 'informatika',
    title: 'Informatika',
    icon: '💻',
    description: 'Belajar pemrograman dasar',
    status: 'locked',
    subjectId: 'informatika',
  },
  {
    id: 'matematika-lanjut',
    title: 'Matematika Lanjut',
    icon: '📊',
    description: 'Kalkulus dan statistika',
    status: 'locked',
    subjectId: 'matematika',
    moduleId: 'kalkulus',
  },
  {
    id: 'proyek-akhir',
    title: 'Proyek Akhir',
    icon: '🏆',
    description: 'Buat proyek dari semua yang dipelajari',
    status: 'locked',
  },
];

export default function LearningRoadmap({ onNodeClick }: LearningRoadmapProps) {
  const [nodes, setNodes] = useState<RoadmapNode[]>(initialRoadmap);

  useEffect(() => {
    const progress = loadRoadmapProgress();
    setNodes((prev) =>
      prev.map((node) => ({
        ...node,
        status: (progress[node.id] as any) || node.status,
      }))
    );
  }, []);

  const handleNodeClick = (node: RoadmapNode) => {
    if (node.status === 'locked') return;
    
    const progress = loadRoadmapProgress();
    if (node.status === 'in-progress') {
      progress[node.id] = 'completed';
      const nodeIndex = nodes.findIndex((n) => n.id === node.id);
      if (nodeIndex < nodes.length - 1) {
        progress[nodes[nodeIndex + 1].id] = 'in-progress';
      }
    }
    saveRoadmapProgress(progress);
    
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        status: (progress[n.id] as any) || n.status,
      }))
    );

    onNodeClick?.(node);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 border-green-600 text-white shadow-green-200';
      case 'in-progress':
        return 'bg-blue-500 border-blue-600 text-white shadow-blue-200 animate-pulse';
      case 'locked':
      default:
        return 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed';
    }
  };

  const getIconStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return '';
      case 'in-progress':
        return '';
      case 'locked':
      default:
        return 'grayscale opacity-50';
    }
  };

  const getConnectorStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-gradient-to-b from-blue-500 to-gray-300';
      case 'locked':
      default:
        return 'bg-gray-300';
    }
  };

  const getBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in-progress':
        return '►';
      case 'locked':
      default:
        return '🔒';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
        🗺️ Peta Jalur Belajar
      </h2>

      <div className="relative">
        {nodes.map((node, index) => (
          <div key={node.id} className="relative">
            {/* Connector Line */}
            {index < nodes.length - 1 && (
              <div className="flex justify-center">
                <div
                  className={`w-1 h-16 ${getConnectorStyles(node.status)} transition-all duration-300`}
                />
              </div>
            )}

            {/* Node */}
            <button
              onClick={() => handleNodeClick(node)}
              disabled={node.status === 'locked'}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-120 ${getStatusStyles(
                node.status
              )} ${node.status !== 'locked' ? 'hover:scale-105 cursor-pointer' : ''} active:scale-95`}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${getIconStyles(node.status)}`}>
                {node.icon}
              </div>

              {/* Content */}
              <div className="flex-1 text-left">
                <h3 className="font-bold text-lg">{node.title}</h3>
                <p className={`text-sm ${node.status === 'locked' ? 'text-gray-400' : 'text-white/80'}`}>
                  {node.description}
                </p>
              </div>

              {/* Status Badge */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                node.status === 'completed' ? 'bg-green-600' : 
                node.status === 'in-progress' ? 'bg-blue-600' : 'bg-gray-400'
              }`}>
                {getBadge(node.status)}
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="mt-8 p-4 bg-gray-50 rounded-xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Progress</span>
          <span className="text-sm font-bold text-gray-900">
            {nodes.filter((n) => n.status === 'completed').length}/{nodes.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${(nodes.filter((n) => n.status === 'completed').length / nodes.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
