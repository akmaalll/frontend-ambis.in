'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface InitialQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip?: () => void;
  onSubmit: (answers: {
    goal: string;
    interest: string;
    level: string;
  }) => void;
}

interface Answers {
  goal: string;
  interest: string;
  level: string;
}

export function InitialQuestionsModal({
  isOpen,
  onClose,
  onSkip,
  onSubmit,
}: InitialQuestionsModalProps) {
  const [answers, setAnswers] = useState<Answers>({
    goal: '',
    interest: '',
    level: '',
  });
  const [step, setStep] = useState(0);
  const router = useRouter();

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Submit answers
      onSubmit(answers);
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    onClose();
    onSkip?.();
  };

  const goals = [
    'Pengembangan Karir',
    'Hobi Personal',
    'Kuliah',
    'Lainnya',
  ];

  const interests = [
    { value: 'matematika', label: 'Matematika' },
    { value: 'informatika', label: 'Informatika' },
    { value: 'keduanya', label: 'Keduanya' },
  ];

  const levels = ['Pemula', 'Menengah', 'Lanjutan'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm sm:text-base">
              🚀
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Mari Kita Mulai!
            </h2>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            Jawab 3 pertanyaan singkat untuk personalize pengalaman belajarmu
          </p>
        </div>

        {/* Progress Steps */}
        <div className="px-4 sm:px-6 py-4 bg-gray-50">
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all ${
                  s <= step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Questions */}
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          {/* Step 0: Tujuan Belajar */}
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                1. Apa tujuan utama Anda belajar?
              </h3>
              <div className="space-y-2">
                {goals.map((goal) => (
                  <label
                    key={goal}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition ${
                      answers.goal === goal
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="goal"
                      value={goal}
                      checked={answers.goal === goal}
                      onChange={(e) =>
                        setAnswers({ ...answers, goal: e.target.value })
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 text-gray-700">{goal}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Topik Interest */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                2. Topik apa yang paling Anda minati?
              </h3>
              <div className="space-y-2">
                {interests.map((interest) => (
                  <label
                    key={interest.value}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition ${
                      answers.interest === interest.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="interest"
                      value={interest.value}
                      checked={answers.interest === interest.value}
                      onChange={(e) =>
                        setAnswers({
                          ...answers,
                          interest: e.target.value,
                        })
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 text-gray-700">
                      {interest.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Level */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                3. Level kesulitan yang sesuai?
              </h3>
              <div className="space-y-2">
                {levels.map((level) => (
                  <label
                    key={level}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition ${
                      answers.level === level
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="level"
                      value={level}
                      checked={answers.level === level}
                      onChange={(e) =>
                        setAnswers({ ...answers, level: e.target.value })
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 text-gray-700">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition"
          >
            Lewati
          </button>

          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition"
              >
                Kembali
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={
                (step === 0 && !answers.goal) ||
                (step === 1 && !answers.interest) ||
                (step === 2 && !answers.level)
              }
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
            >
              {step === 2 ? 'Mulai Belajar →' : 'Lanjut'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
