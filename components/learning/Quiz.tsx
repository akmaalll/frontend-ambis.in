'use client';

interface QuizProps {
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correct: number;
  }>;
  onSubmit: () => void;
  passingScore: number;
  answers: (number | null)[];
  setAnswers: React.Dispatch<React.SetStateAction<(number | null)[]>>;
  submitted: boolean;
  score: number | null;
  onRetake: () => void;
}

export function Quiz({
  questions,
  onSubmit,
  passingScore,
  answers,
  setAnswers,
  submitted,
  score,
  onRetake,
}: QuizProps) {
  const handleSelectAnswer = (questionIdx: number, optionIdx: number) => {
    if (!submitted) {
      setAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[questionIdx] = optionIdx;
        return newAnswers;
      });
    }
  };

  const isAllAnswered = !answers.includes(null);
  const passed = score !== null && score >= passingScore;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quiz</h2>
        <span className="text-sm text-gray-500">
          {questions.length} pertanyaan
        </span>
      </div>

      <div className="space-y-6">
        {questions.map((q, qIdx) => (
          <div
            key={q.id}
            className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
          >
            <div className="flex items-start gap-3 mb-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                {qIdx + 1}
              </span>
              <p className="font-semibold text-gray-900">{q.question}</p>
            </div>

            <div className="space-y-3">
              {q.options.map((option, oIdx) => {
                const isSelected = answers[qIdx] === oIdx;
                const isCorrect = submitted && q.correct === oIdx;
                const isWrong = submitted && isSelected && !isCorrect;

                return (
                  <label
                    key={oIdx}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      submitted
                        ? isCorrect
                          ? 'border-green-500 bg-green-50'
                          : isWrong
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        : isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${qIdx}`}
                      checked={isSelected}
                      onChange={() => handleSelectAnswer(qIdx, oIdx)}
                      disabled={submitted}
                      className="w-4 h-4 text-blue-600 mr-3 accent-blue-600"
                    />
                    <span className={`flex-1 ${submitted && isCorrect ? 'text-green-700 font-medium' : submitted && isWrong ? 'text-red-700' : 'text-gray-700'}`}>
                      {option}
                      {submitted && isCorrect && ' ✅'}
                      {submitted && isWrong && ' ❌'}
                    </span>
                    {submitted && isCorrect && (
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        {!submitted ? (
          <div className="flex gap-4">
            <button
              onClick={onSubmit}
              disabled={!isAllAnswered}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-bold transition"
            >
              Periksa Jawaban
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition"
            >
              Batal
            </button>
          </div>
        ) : (
          <div className={`text-center p-6 rounded-lg ${passed ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
            <div className={`text-5xl mb-4 ${passed ? 'text-green-500' : 'text-red-500'}`}>
              {passed ? '🎉' : '😔'}
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${passed ? 'text-green-700' : 'text-red-700'}`}>
              {passed ? 'Selamat! Kamu Lolos!' : 'Coba Lagi!'}
            </h2>
            <p className="text-gray-600 mb-4">
              Skor kamu: <span className="font-bold">{score}%</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Passing score: {passingScore}%
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Keluar
              </button>
              <button
                onClick={onRetake}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
              >
                🔄 Coba Lagi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;
