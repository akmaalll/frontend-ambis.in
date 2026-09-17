'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import { SummaryView } from '@/components/learning/SummaryView';

interface ModuleSummary {
  id: string;
  title: string;
  completedChapters: number;
  totalChapters: number;
  progress: number;
  averageScore?: number;
  isCompleted: boolean;
}

interface SummaryData {
  pathTitle: string;
  totalProgress: number;
  completedModules: number;
  totalModules: number;
  studyTime: number;
  averageQuizScore: number;
  modules: ModuleSummary[];
}

const summaryData: Record<string, SummaryData> = {
  matematika: {
    pathTitle: 'Matematika',
    totalProgress: 60,
    completedModules: 1,
    totalModules: 4,
    studyTime: 5,
    averageQuizScore: 82,
    modules: [
      {
        id: 'aljabar-dasar',
        title: 'Aljabar Dasar',
        completedChapters: 3,
        totalChapters: 3,
        progress: 100,
        averageScore: 90,
        isCompleted: true,
      },
      {
        id: 'persamaan-linear',
        title: 'Persamaan Linear',
        completedChapters: 2,
        totalChapters: 3,
        progress: 67,
        averageScore: 80,
        isCompleted: false,
      },
      {
        id: 'sistem-persamaan',
        title: 'Sistem Persamaan',
        completedChapters: 0,
        totalChapters: 3,
        progress: 0,
        isCompleted: false,
      },
      {
        id: 'fungsi-dan-grafik',
        title: 'Fungsi & Grafik',
        completedChapters: 1,
        totalChapters: 3,
        progress: 25,
        averageScore: 75,
        isCompleted: false,
      },
    ],
  },
  informatika: {
    pathTitle: 'Informatika',
    totalProgress: 30,
    completedModules: 1,
    totalModules: 5,
    studyTime: 3,
    averageQuizScore: 85,
    modules: [
      {
        id: 'dasar-pemrograman',
        title: 'Dasar Pemrograman',
        completedChapters: 4,
        totalChapters: 4,
        progress: 100,
        averageScore: 92,
        isCompleted: true,
      },
      {
        id: 'alur-kendali',
        title: 'Alur Kendali',
        completedChapters: 2,
        totalChapters: 3,
        progress: 67,
        averageScore: 80,
        isCompleted: false,
      },
      {
        id: 'fungsi-dan-prosedur',
        title: 'Fungsi & Prosedur',
        completedChapters: 0,
        totalChapters: 3,
        progress: 0,
        isCompleted: false,
      },
      {
        id: 'struktur-data',
        title: 'Struktur Data',
        completedChapters: 0,
        totalChapters: 4,
        progress: 0,
        isCompleted: false,
      },
      {
        id: 'pemrograman-oo',
        title: 'OOP Dasar',
        completedChapters: 0,
        totalChapters: 3,
        progress: 0,
        isCompleted: false,
      },
    ],
  },
};

export default function LearningSummaryPage() {
  const params = useParams();
  const router = useRouter();
  const pathId = params.pathId as string || 'matematika';

  const data: SummaryData = summaryData[pathId] || summaryData.matematika;

  const handleViewModule = (moduleId: string) => {
    router.push(`/dashboard/learning/${pathId}/${moduleId}`);
  };

  return (
    <MainLayout>
      <SummaryView
        pathTitle={data.pathTitle}
        totalProgress={data.totalProgress}
        completedModules={data.completedModules}
        totalModules={data.totalModules}
        studyTime={data.studyTime}
        averageQuizScore={data.averageQuizScore}
        modules={data.modules}
        onViewModule={handleViewModule}
      />
    </MainLayout>
  );
}
