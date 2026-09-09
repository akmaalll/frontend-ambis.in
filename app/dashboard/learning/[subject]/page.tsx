'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';
import { ModuleList } from '@/components/learning/ModuleList';
import { ProgressBar } from '@/components/learning/ProgressBar';

interface ModuleItem {
  id: string;
  title: string;
  chapterCount: number;
  completedChapters: number;
  description: string;
  progress?: number;
}

const moduleData: Record<string, ModuleItem[]> = {
  matematika: [
    {
      id: 'aljabar-dasar',
      title: 'Aljabar Dasar',
      chapterCount: 3,
      completedChapters: 3,
      description: 'Pelajari konsep dasar aljabar termasuk variabel, koefisien, dan konstanta',
      progress: 100,
    },
    {
      id: 'persamaan-linear',
      title: 'Persamaan Linear',
      chapterCount: 3,
      completedChapters: 2,
      description: 'Menyelesaikan persamaan linear satu variabel dan dua variabel',
      progress: 67,
    },
    {
      id: 'sistem-persamaan',
      title: 'Sistem Persamaan',
      chapterCount: 3,
      completedChapters: 0,
      description: 'Sistem persamaan dengan 2 atau lebih variabel',
      progress: 0,
    },
    {
      id: 'fungsi-dan-grafik',
      title: 'Fungsi & Grafik',
      chapterCount: 3,
      completedChapters: 1,
      description: 'Memahami fungsi dan cara menggambarnya pada koordinat Cartesius',
      progress: 25,
    },
  ],
  informatika: [
    {
      id: 'dasar-pemrograman',
      title: 'Dasar Pemrograman',
      chapterCount: 4,
      completedChapters: 4,
      description: 'Konsep dasar pemrograman: variabel, tipe data, dan operator',
      progress: 100,
    },
    {
      id: 'alur-kendali',
      title: 'Alur Kendali',
      chapterCount: 3,
      completedChapters: 2,
      description: 'Percabangan dan perulangan dalam pemrograman',
      progress: 67,
    },
    {
      id: 'fungsi-dan-prosedur',
      title: 'Fungsi & Prosedur',
      chapterCount: 3,
      completedChapters: 0,
      description: 'Membuat dan menggunakan fungsi dalam pemrograman',
      progress: 0,
    },
    {
      id: 'struktur-data',
      title: 'Struktur Data',
      chapterCount: 4,
      completedChapters: 0,
      description: 'Array, list, dan struktur data dasar lainnya',
      progress: 0,
    },
    {
      id: 'pemrograman-oo',
      title: 'OOP Dasar',
      chapterCount: 3,
      completedChapters: 0,
      description: 'Pendahuluan pemrograman berorientasi objek',
      progress: 0,
    },
  ],
};

const sampleSubjectNames: Record<string, string> = {
  matematika: 'Matematika',
  informatika: 'Informatika',
};

export default function LearningSubjectPage() {
  const params = useParams();
  const router = useRouter();
  const subject = params.subject as string || 'matematika';

  const modules: ModuleItem[] = moduleData[subject] || moduleData.matematika;
  const subjectTitle = sampleSubjectNames[subject] || 'Matematika';

  const totalChapters = modules.reduce((sum, m) => sum + m.chapterCount, 0);
  const completedChapters = modules.reduce((sum, m) => sum + m.completedChapters, 0);
  const totalProgress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  const handleModuleClick = (moduleId: string) => {
    // Navigate to the first chapter of the module
    const firstChapters: Record<string, Record<string, string>> = {
      matematika: {
        'aljabar-dasar': 'pengenalan-variabel',
        'persamaan-linear': 'pengenalan-persamaan',
      },
      informatika: {
        'dasar-pemrograman': 'pengenalan-variabel-prog',
      },
    };
    const firstChapter = firstChapters[subject]?.[moduleId] || 'chapter-1';
    router.push(`/dashboard/learning/${subject}/${moduleId}/${firstChapter}`);
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 md:mb-4 transition"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="text-sm md:text-base">Kembali ke Learning Path</span>
          </button>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
            {subjectTitle}
          </h1>
          <p className="text-sm md:text-base text-gray-600">Pilih module untuk memulai belajar</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Progress Keseluruhan
            </h2>
            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
              {totalProgress}%
            </span>
          </div>
          <ProgressBar
            value={totalProgress}
            label={`${completedChapters} dari ${totalChapters} chapter selesai`}
          />
        </div>

        <ModuleList
          modules={modules}
          onSelectModule={handleModuleClick}
          subjectTitle={subjectTitle}
        />
      </div>
    </MainLayout>
  );
}
