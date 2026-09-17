'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
}

const quizData: Record<string, QuizQuestion[]> = {
  'pengenalan-variabel': [
    {
      id: 'q1',
      question: 'Apa itu variabel dalam aljabar?',
      options: [
        'Simbol yang mewakili nilai belum diketahui',
        'Angka dalam persamaan',
        'Operasi matematika',
        'Hasil dari perhitungan',
      ],
      correct: 0,
    },
    {
      id: 'q2',
      question: 'Dalam persamaan x + 5 = 10, x adalah?',
      options: ['Konstanta', 'Variabel', 'Koefisien', 'Hasil akhir'],
      correct: 1,
    },
    {
      id: 'q3',
      question: 'Manakah yang merupakan contoh variabel?',
      options: ['7', 'y', '+', '15'],
      correct: 1,
    },
  ],
  'konstanta-dan-koefisien': [
    {
      id: 'q1',
      question: 'Dalam ekspresi 3x + 7, berapakah koefisien dari x?',
      options: ['3', '7', 'x', '1'],
      correct: 0,
    },
    {
      id: 'q2',
      question: 'Manakah yang merupakan konstanta dalam 5y - 3?',
      options: ['5', 'y', '-3', 'Tidak ada'],
      correct: 2,
    },
    {
      id: 'q3',
      question: 'Berapakah koefisien dari x dalam x + 4?',
      options: ['0', '1', '4', 'Tidak ada'],
      correct: 1,
    },
  ],
  'operasi-pada-variabel': [
    {
      id: 'q1',
      question: 'Hasil dari 3x + 2x adalah?',
      options: ['5x', '6x', '5x²', 'x'],
      correct: 0,
    },
    {
      id: 'q2',
      question: 'Hasil dari 6x ÷ 2 adalah?',
      options: ['3x', '3', '4x', '12x'],
      correct: 0,
    },
    {
      id: 'q3',
      question: 'Manakah operasi yang benar?',
      options: ['x + y = xy', '2x + 3x = 5x', 'x + x = x²', '3x - x = 3'],
      correct: 1,
    },
  ],
  'pengenalan-persamaan': [
    {
      id: 'q1',
      question: 'Apa yang dimaksud dengan persamaan linear?',
      options: [
        'Persamaan dengan derajat 2',
        'Persamaan yang menyatakan kesamaan dua ekspresi dengan derajat 1',
        'Persamaan tanpa variabel',
        'Persamaan dengan banyak variabel',
      ],
      correct: 1,
    },
    {
      id: 'q2',
      question: 'Manakah yang merupakan persamaan linear?',
      options: ['x² + 3 = 7', '2x + 5 = 11', 'x³ = 8', '√x = 3'],
      correct: 1,
    },
    {
      id: 'q3',
      question: 'Dalam persamaan x + 3 = 7, apa ruas kirinya?',
      options: ['7', 'x + 3', 'x', '3'],
      correct: 1,
    },
  ],
  'menyelesaikan-plsv': [
    {
      id: 'q1',
      question: 'Penyelesaian dari x + 5 = 12 adalah?',
      options: ['x = 5', 'x = 7', 'x = 17', 'x = 2'],
      correct: 1,
    },
    {
      id: 'q2',
      question: 'Jika 2x - 3 = 7, maka x = ?',
      options: ['x = 2', 'x = 5', 'x = 4', 'x = 3'],
      correct: 1,
    },
    {
      id: 'q3',
      question: 'Langkah pertama menyelesaikan PLSV adalah?',
      options: [
        'Menghitung hasil',
        'Pisahkan variabel dan konstanta',
        'Mengalikan kedua ruas',
        'Membagi kedua ruas',
      ],
      correct: 1,
    },
  ],
  'pengenalan-variabel-prog': [
    {
      id: 'q1',
      question: 'Apa itu variabel dalam pemrograman?',
      options: [
        'Wadah untuk menyimpan data',
        'Tipe data',
        'Fungsi',
        'Operator',
      ],
      correct: 0,
    },
    {
      id: 'q2',
      question: 'Manakah penamaan variabel yang benar?',
      options: ['2nama', 'nama lengkap', 'namaLengkap', 'nama-lengkap'],
      correct: 2,
    },
    {
      id: 'q3',
      question: 'Apa tipe data dari "Hello World"?',
      options: ['Number', 'Boolean', 'String', 'Array'],
      correct: 2,
    },
  ],
  'tipe-data': [
    {
      id: 'q1',
      question: 'Tipe data untuk nilai true/false adalah?',
      options: ['Number', 'String', 'Boolean', 'Array'],
      correct: 2,
    },
    {
      id: 'q2',
      question: 'Manakah yang merupakan tipe data Number?',
      options: ['"Hello"', '42', 'true', '[1,2,3]'],
      correct: 1,
    },
    {
      id: 'q3',
      question: 'Apa yang terjadi jika variabel dideklarasikan tanpa diberi nilai?',
      options: ['Error', 'Null', 'Undefined', '0'],
      correct: 2,
    },
  ],
};

const chapterNames: Record<string, string> = {
  'pengenalan-variabel': 'Pengenalan Variabel',
  'konstanta-dan-koefisien': 'Konstanta dan Koefisien',
  'operasi-pada-variabel': 'Operasi pada Variabel',
  'pengenalan-persamaan': 'Pengenalan Persamaan Linear',
  'menyelesaikan-plsv': 'Menyelesaikan PLSV',
  'pengenalan-variabel-prog': 'Pengenalan Variabel dalam Pemrograman',
  'tipe-data': 'Tipe Data Dasar',
};

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const subject = params.subject as string;
  const moduleId = params.module as string;
  const chapterId = params.chapter as string;

  const questions = quizData[chapterId] || [];
  const chapterTitle = chapterNames[chapterId] || chapterId;

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      alert('Harap jawab semua soal terlebih dahulu!');
      return;
    }
    setIsSubmitted(true);
    setShowResults(true);
  };

  const handleRetake = () => {
    setAnswers({});
    setIsSubmitted(false);
    setShowResults(false);
  };

  const handleBackToChapter = () => {
    router.push(`/dashboard/learning/${subject}/${moduleId}/${chapterId}`);
  };

  const calculateScore = () => {
    if (!isSubmitted) return 0;
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  };

  const score = calculateScore();
  const passed = score >= 70;

  if (questions.length === 0) {
    return (
      <MainLayout>
        <div className="p-8 text-center">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Tidak Tersedia</h2>
          <p className="text-gray-600 mb-4">Quiz untuk chapter ini belum tersedia.</p>
          <button
            onClick={handleBackToChapter}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Kembali ke Chapter
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto p-4 md:p-8 pb-16">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={handleBackToChapter}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 md:mb-4 transition text-sm md:text-base"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Chapter
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Quiz: {chapterTitle}</h1>
          <p className="text-sm md:text-base text-gray-600">
            Jawab semua soal di bawah ini. Nilai minimum untuk lulus adalah 70%.
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question, qIdx) => {
            const selectedAnswer = answers[question.id];
            const isCorrect = selectedAnswer === question.correct;

            return (
              <div
                key={question.id}
                className={`bg-white rounded-xl shadow-sm border p-6 ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-green-300 bg-green-50'
                      : 'border-red-300 bg-red-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {qIdx + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {question.question}
                  </h3>
                </div>

                <div className="space-y-3 ml-11">
                  {question.options.map((option, oIdx) => {
                    const isSelected = selectedAnswer === oIdx;
                    const isCorrectOption = question.correct === oIdx;

                    let optionClass = 'border-gray-200 hover:border-blue-300 hover:bg-blue-50';
                    if (isSelected && !isSubmitted) {
                      optionClass = 'border-blue-500 bg-blue-50';
                    } else if (isSubmitted) {
                      if (isCorrectOption) {
                        optionClass = 'border-green-500 bg-green-100';
                      } else if (isSelected && !isCorrectOption) {
                        optionClass = 'border-red-500 bg-red-100';
                      } else {
                        optionClass = 'border-gray-200 opacity-50';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleAnswerSelect(question.id, oIdx)}
                        disabled={isSubmitted}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition flex items-center gap-3 ${optionClass}`}
                      >
                        <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                          isSelected && !isSubmitted
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : isSubmitted && isCorrectOption
                            ? 'border-green-500 bg-green-500 text-white'
                            : isSubmitted && isSelected && !isCorrectOption
                            ? 'border-red-500 bg-red-500 text-white'
                            : 'border-gray-300'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="text-sm text-gray-700">{option}</span>
                        {isSubmitted && isCorrectOption && (
                          <span className="ml-auto text-green-600">✓</span>
                        )}
                        {isSubmitted && isSelected && !isCorrectOption && (
                          <span className="ml-auto text-red-600">✗</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback after submit */}
                {isSubmitted && (
                  <div className={`mt-4 ml-11 p-3 rounded-lg text-sm ${
                    isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {isCorrect ? (
                      <p>✓ Jawaban benar!</p>
                    ) : (
                      <p>✗ Jawaban salah. Jawaban yang benar adalah: <strong>{question.options[question.correct]}</strong></p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit / Results */}
        {!isSubmitted ? (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < questions.length}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition"
            >
              Submit Jawaban ({Object.keys(answers).length}/{questions.length} terjawab)
            </button>
          </div>
        ) : (
          <div className="mt-8">
            {/* Score Card */}
            <div className={`rounded-xl p-6 text-center mb-6 ${
              passed ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'
            }`}>
              <div className="text-5xl mb-3">{passed ? '🎉' : '😅'}</div>
              <h2 className={`text-2xl font-bold mb-2 ${passed ? 'text-green-800' : 'text-red-800'}`}>
                {passed ? 'Selamat! Kamu Lulus!' : 'Belum Lulus'}
              </h2>
              <p className={`text-lg ${passed ? 'text-green-700' : 'text-red-700'}`}>
                Nilai kamu: <strong>{score}%</strong>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {passed
                  ? 'Kamu telah berhasil menyelesaikan quiz ini!'
                  : 'Coba lagi! Nilai minimum untuk lulus adalah 70%.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              {!passed && (
                <button
                  onClick={handleRetake}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                >
                  🔄 Coba Lagi
                </button>
              )}
              <button
                onClick={handleBackToChapter}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
              >
                ← Kembali ke Chapter
              </button>
              {passed && (
                <button
                  onClick={() => router.push(`/dashboard/learning/${subject}`)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
                >
                  Lanjutkan Belajar →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
