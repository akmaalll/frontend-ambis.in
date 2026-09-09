'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import Mascot from '@/components/Mascot/Mascot';
import PersonalityModal from '@/components/Mascot/PersonalityModal';

const learningPaths = [
  {
    id: 'matematika',
    title: 'Matematika',
    subject: 'matematika',
    description: 'Pembelajaran Matematika dari Dasar hingga Lanjutan. Pelajari aljabar, geometri, kalkulus, dan statistik dengan materi yang terstruktur.',
    moduleCount: 4,
    icon: '🔢',
  },
  {
    id: 'informatika',
    title: 'Informatika',
    subject: 'informatika',
    description: 'Pembelajaran Informatika dan Pemrograman. Pelajari dasar-dasar pemrograman, algoritma, struktur data, dan web development.',
    moduleCount: 5,
    icon: '💻',
  },
];

export default function LearningPathsPage() {
  const [showPersonalityModal, setShowPersonalityModal] = useState(false);
  const [mascotMessage, setMascotMessage] = useState('Pilih jalur belajar yang sesuai dengan minatmu! 📚');
  const [mascotMood, setMascotMood] = useState<'happy' | 'thinking' | 'waving' | 'idle'>('idle');

  const handlePathClick = (subject: string) => {
    window.location.href = `/dashboard/learning/${subject}`;
  };

  const handleNewChat = () => {
    window.location.href = '/';
  };

  const handlePersonalityComplete = (prefs: any) => {
    localStorage.setItem('learningPreferences', JSON.stringify(prefs));
    setShowPersonalityModal(false);
    setMascotMessage('Preferensi belajarmu tersimpan! 🎉');
    setMascotMood('happy');
  };

  return (
    <MainLayout onNewChat={handleNewChat}>
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 md:mb-10">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
              📚 Learning Path
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Pilih topik pembelajaran untuk memulai perjalanan belajarmu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {learningPaths.map((path) => (
              <div
                key={path.id}
                onClick={() => handlePathClick(path.subject)}
                className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 md:p-6 border-l-4 border-blue-500 hover:border-purple-500 cursor-pointer hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div className="text-4xl md:text-5xl group-hover:scale-110 transition-transform">
                    {path.icon}
                  </div>
                  <span className="text-xs md:text-sm bg-blue-100 text-blue-800 px-2 md:px-3 py-1 rounded-full font-medium">
                    {path.moduleCount} Module
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{path.title}</h3>
                <p className="text-gray-600 text-xs md:text-sm mb-4 md:mb-6">{path.description}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePathClick(path.subject);
                  }}
                  className="text-blue-600 font-medium text-xs md:text-sm hover:text-blue-700 transition flex items-center gap-1 group/btn"
                >
                  Mulai Belajar
                  <svg
                    className="w-3 h-3 md:w-4 md:h-4 group-hover/btn:translate-x-1 transition-transform"
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
            ))}
          </div>

          <div className="mt-8 md:mt-12 bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
              Bagaimana cara belajar?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-sm md:text-base">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Pilih Subject</h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    Pilih Matematika atau Informatika sesuai minatmu
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 text-sm md:text-base">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Pilih Module</h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    Setiap subject memiliki beberapa module yang terstruktur
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-sm md:text-base">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Baca & Kuis</h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    Baca materi lalu kerjakan quiz untuk menguji pemahamanmu
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Personalize CTA */}
          <button
            onClick={() => setShowPersonalityModal(true)}
            className="w-full mt-6 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <span className="text-2xl">🎯</span>
            <div className="text-left">
              <p className="font-semibold">Personalisasi Gaya Belajar</p>
              <p className="text-sm text-white/80">Sesuaikan pengalaman belajarmu</p>
            </div>
            <svg className="w-5 h-5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

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
