'use client';

import { useState, useEffect } from 'react';

interface LearningPreferences {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | '';
  contentSpeed: 'fast' | 'normal' | 'detailed' | '';
  favoriteTopics: string[];
}

const STORAGE_KEY = 'ambisin_learning_preferences';

const topicOptions = [
  { id: 'algebra', label: 'Aljabar', icon: '🔢' },
  { id: 'geometry', label: 'Geometri', icon: '📐' },
  { id: 'calculus', label: 'Kalkulus', icon: '📊' },
  { id: 'programming', label: 'Pemrograman', icon: '💻' },
  { id: 'algorithms', label: 'Algoritma', icon: '🧮' },
  { id: 'webdev', label: 'Web Development', icon: '🌐' },
  { id: 'databases', label: 'Database', icon: '🗄️' },
  { id: 'ai', label: 'AI & Machine Learning', icon: '🤖' },
];

export function useLearningPreferences() {
  const [preferences, setPreferences] = useState<LearningPreferences>({
    learningStyle: '',
    contentSpeed: '',
    favoriteTopics: [],
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setPreferences(JSON.parse(stored));
    }
    setIsLoaded(true);
  }, []);

  const savePreferences = (prefs: LearningPreferences) => {
    setPreferences(prefs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  };

  const isComplete = preferences.learningStyle !== '' && 
                     preferences.contentSpeed !== '' && 
                     preferences.favoriteTopics.length > 0;

  return { preferences, savePreferences, isComplete, isLoaded };
}

interface PersonalityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (prefs: LearningPreferences) => void;
  initialPreferences?: LearningPreferences;
}

export default function PersonalityModal({ 
  isOpen, 
  onClose, 
  onComplete,
  initialPreferences 
}: PersonalityModalProps) {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState<LearningPreferences>({
    learningStyle: '',
    contentSpeed: '',
    favoriteTopics: [],
  });

  useEffect(() => {
    if (initialPreferences) {
      setPreferences(initialPreferences);
    }
  }, [initialPreferences]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onComplete(preferences);
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const toggleTopic = (topicId: string) => {
    setPreferences(prev => ({
      ...prev,
      favoriteTopics: prev.favoriteTopics.includes(topicId)
        ? prev.favoriteTopics.filter(t => t !== topicId)
        : [...prev.favoriteTopics, topicId]
    }));
  };

  const canProceed = 
    (step === 0 && preferences.learningStyle !== '') ||
    (step === 1 && preferences.contentSpeed !== '') ||
    (step === 2 && preferences.favoriteTopics.length > 0);

  const learningStyles = [
    { value: 'visual', label: 'Visual', icon: '👁️', desc: 'Belajar dengan gambar, diagram, dan video' },
    { value: 'auditory', label: 'Auditory', icon: '👂', desc: 'Belajar dengan mendengarkan dan berdiskusi' },
    { value: 'kinesthetic', label: 'Kinesthetic', icon: '🤲', desc: 'Belajar dengan praktik dan eksperimen' },
  ];

  const contentSpeeds = [
    { value: 'fast', label: 'Cepat', icon: '⚡', desc: 'Ringkasan singkat dan poin penting' },
    { value: 'normal', label: 'Normal', icon: '📖', desc: 'Penjelasan standar yang seimbang' },
    { value: 'detailed', label: 'Detail', icon: '🔬', desc: 'Penjelasan mendalam dan komprehensif' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-2xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
              🎯
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Personalisasi Belajar</h2>
              <p className="text-indigo-100 text-sm">Bantu kami memahami gaya belajar Anda</p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="flex gap-2">
            {[0, 1, 2].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  s <= step ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 0: Learning Style */}
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Gaya belajar Anda yang mana?
              </h3>
              <div className="space-y-3">
                {learningStyles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setPreferences(prev => ({ ...prev, learningStyle: style.value as any }))}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      preferences.learningStyle === style.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-3xl">{style.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{style.label}</p>
                      <p className="text-sm text-gray-500">{style.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Content Speed */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Preferensi kecepatan konten?
              </h3>
              <div className="space-y-3">
                {contentSpeeds.map((speed) => (
                  <button
                    key={speed.value}
                    onClick={() => setPreferences(prev => ({ ...prev, contentSpeed: speed.value as any }))}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      preferences.contentSpeed === speed.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-3xl">{speed.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{speed.label}</p>
                      <p className="text-sm text-gray-500">{speed.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Favorite Topics */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Topik favorit Anda? (Pilih minimal 1)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {topicOptions.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      preferences.favoriteTopics.includes(topic.id)
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{topic.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{topic.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-between">
          <button
            onClick={handleBack}
            className={`px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition ${
              step === 0 ? 'invisible' : ''
            }`}
          >
            Kembali
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
          >
            {step === 2 ? 'Selesai' : 'Lanjut'}
          </button>
        </div>
      </div>
    </div>
  );
}
