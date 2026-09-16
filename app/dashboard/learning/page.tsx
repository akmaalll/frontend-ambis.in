'use client';

import { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import ChatContainer from '@/components/Chat/ChatContainer';
import { InitialQuestionsModal } from '@/components/Modal/InitialQuestionsModal';
import Mascot from '@/components/Mascot/Mascot';
import Quiz from '@/components/learning/Quiz';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  type: 'ask' | 'learning-path';
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  hasQuiz: boolean;
  quizPassed: boolean;
  quizQuestions: QuizQuestion[];
}

interface LearningPathData {
  goal: string;
  topic: string;
  subtopic: string;
  difficulty: string;
  roadmap: RoadmapStep[];
}

const CHAT_HISTORY_KEY = 'ambisin_chat_history';
const LEARNING_PATH_DATA_KEY = 'ambisin_learning_path_data';

function loadChatHistory(filterType?: 'ask' | 'learning-path'): ChatHistory[] {
  try {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    if (stored) {
      const parsed: ChatHistory[] = JSON.parse(stored);
      const chats = parsed.map((chat) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        messages: chat.messages.map((m: any) => ({ ...m, createdAt: new Date(m.createdAt) })),
      }));
      return filterType ? chats.filter((c) => c.type === filterType) : chats;
    }
  } catch { /* ignore */ }
  return [];
}

function saveChatHistory(history: ChatHistory[]) {
  try { localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history)); } catch { /* ignore */ }
}

function loadLearningPathData(): LearningPathData | null {
  try {
    const stored = localStorage.getItem(LEARNING_PATH_DATA_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

function saveLearningPathData(data: LearningPathData) {
  localStorage.setItem(LEARNING_PATH_DATA_KEY, JSON.stringify(data));
}

function getQuizForStep(stepId: string): QuizQuestion[] {
  const quizzes: Record<string, QuizQuestion[]> = {
    '1': [
      { id: 'q1', question: 'Apa yang dimaksud dengan konsep dasar?', options: ['Hal tidak penting', 'Fondasi untuk memahami materi lanjut', 'Hafalan semata', 'Tidak perlu dipahami'], correct: 1, explanation: 'Konsep dasar adalah fondasi penting untuk memahami materi lanjut.' },
      { id: 'q2', question: 'Mengapa memahami konsep dasar penting?', options: ['Agar bisa menghafal', 'Untuk mengerjakan soal dengan benar', 'Tidak penting', 'Hanya untuk nilai'], correct: 1, explanation: 'Dengan memahami konsep dasar, kita bisa mengerjakan soal dengan benar.' },
      { id: 'q3', question: 'Manakah yang termasuk konsep dasar?', options: ['Rumus rumit', 'Definisi dan prinsip dasar', 'Soal sulit', 'Materi lanjutan'], correct: 1, explanation: 'Definisi dan prinsip dasar termasuk konsep dasar.' }
    ],
    '2': [
      { id: 'q1', question: 'Apa fungsi teori fundamental?', options: ['Memperumit pemahaman', 'Menjelaskan prinsip dasar topik', 'Tidak berguna', 'Hanya teori'], correct: 1, explanation: 'Teori fundamental menjelaskan prinsip-prinsip dasar.' },
      { id: 'q2', question: 'Cara memahami teori fundamental?', options: ['Hanya membaca', 'Membaca, berlatih, dan bertanya', 'Menghafal saja', 'Tidak perlu dipahami'], correct: 1, explanation: 'Perlu membaca, berlatih soal, dan bertanya.' },
      { id: 'q3', question: 'Hubungan teori dengan praktik?', options: ['Tidak ada hubungan', 'Teori jadi dasar untuk praktik', 'Praktik lebih penting', 'Teori tidak perlu'], correct: 1, explanation: 'Teori fundamental menjadi dasar untuk praktik.' }
    ],
    '3': [
      { id: 'q1', question: 'Apa manfaat latihan soal?', options: ['Tidak ada gunanya', 'Menguji pemahaman konsep', 'Buang waktu', 'Bikin stres'], correct: 1, explanation: 'Latihan soal menguji seberapa jauh pemahaman kita.' },
      { id: 'q2', question: 'Langkah sebelum mengerjakan soal?', options: ['Langsung jawab', 'Baca soal dengan teliti dan pahami', 'Tebak saja', 'Tanya teman'], correct: 1, explanation: 'Baca soal dengan teliti sebelum menjawab.' },
      { id: 'q3', question: 'Kalau jawaban salah, apa yang harus dilakukan?', options: ['Menyerah', 'Cek pembahasan dan pahami', 'Biarkan saja', 'Tanya jawaban teman'], correct: 1, explanation: 'Cek pembahasan dan pahami di mana kesalahannya.' }
    ],
    '4': [
      { id: 'q1', question: 'Karakteristik soal tingkat menengah?', options: ['Sangat mudah', 'Perlu pemahaman lebih dalam', 'Sulit sekali', 'Tidak mungkin dikerjakan'], correct: 1, explanation: 'Soal menengah perlu pemahaman lebih dalam.' },
      { id: 'q2', question: 'Strategi hadapi soal menengah?', options: ['Langsung menyerah', 'Pecah masalah jadi bagian kecil', 'Tebak saja', 'Skip semua'], correct: 1, explanation: 'Pecah masalah menjadi bagian kecil agar lebih mudah.' },
      { id: 'q3', question: 'Kalau stuck di soal menengah?', options: ['Tetap stuck', 'Coba pendekatan lain atau tanya', 'Menyerah', 'Salin teman'], correct: 1, explanation: 'Coba pendekatan lain atau minta bantuan.' }
    ],
    '5': [
      { id: 'q1', question: 'Aplikasi konsep dalam kasus nyata berguna untuk?', options: ['Tidak berguna', 'Melihat relevansi konsep dengan dunia nyata', 'Memusingkan', 'Buat pamer'], correct: 1, explanation: 'Aplikasi nyata membantu melihat relevansi konsep.' },
      { id: 'q2', question: 'Contoh penerapan konsep sehari-hari?', options: ['Tidak ada', 'Menghitung diskon belanja', 'Hanya di sekolah', 'Tidak relevan'], correct: 1, explanation: 'Konsep matematika/informatika sering dipakai sehari-hari.' },
      { id: 'q3', question: 'Setelah tahu aplikasi nyata, manfaatnya?', options: ['Tidak ada', 'Lebih termotivasi belajar', 'Bikin malas', 'Tidak peduli'], correct: 1, explanation: 'Melihat aplikasi nyata bikin lebih termotivasi.' }
    ],
    '6': [
      { id: 'q1', question: 'Tujuan evaluasi akhir?', options: ['Bikin stres', 'Mengevaluasi pemahaman keseluruhan', 'Buat nilai', 'Tidak perlu'], correct: 1, explanation: 'Evaluasi mengevaluasi sejauh mana pemahaman kita.' },
      { id: 'q2', question: 'Kalau ada materi yang belum paham saat evaluasi?', options: ['Abaikan', 'Review lagi materi tersebut', 'Menyerah', 'Tanya teman'], correct: 1, explanation: 'Review materi yang belum dipahami.' },
      { id: 'q3', question: 'Setelah evaluasi, langkah selanjutnya?', options: ['Berhenti belajar', 'Lanjut ke topik baru atau perdalam', 'Tidak perlu apa-apa'], correct: 1, explanation: 'Lanjut ke topik baru atau perdalam yang masih lemah.' }
    ],
  };
  return quizzes[stepId] || quizzes['1'];
}

function generateRoadmap(topic: string): RoadmapStep[] {
  const templates: Record<string, RoadmapStep[]> = {
    matematika: [
      { id: '1', title: 'Pengenalan', description: 'Konsep dasar Matematika', completed: false, current: true, hasQuiz: true, quizPassed: false, quizQuestions: getQuizForStep('1') },
      { id: '2', title: 'Teori Dasar', description: 'Teori fundamental Matematika', completed: false, current: false, hasQuiz: true, quizPassed: false, quizQuestions: getQuizForStep('2') },
      { id: '3', title: 'Latihan Dasar', description: 'Soal tingkat pemula', completed: false, current: false, hasQuiz: true, quizPassed: false, quizQuestions: getQuizForStep('3') },
      { id: '4', title: 'Latihan Menengah', description: 'Soal tingkat menengah', completed: false, current: false, hasQuiz: true, quizPassed: false, quizQuestions: getQuizForStep('4') },
      { id: '5', title: 'Aplikasi', description: 'Penerapan kasus nyata', completed: false, current: false, hasQuiz: true, quizPassed: false, quizQuestions: getQuizForStep('5') },
      { id: '6', title: 'Evaluasi', description: 'Review & evaluasi akhir', completed: false, current: false, hasQuiz: true, quizPassed: false, quizQuestions: getQuizForStep('6') },
    ],
    informatika: [
      { id: '1', title: 'Pengenalan', description: 'Dasar-dasar pemrograman', completed: false, current: true, hasQuiz: true, quizPassed: false, quizQuestions: getQuizForStep('1') },
      { id: '2', title: 'Variabel & Tipe Data', description: 'Memahami variabel dan tipe data', completed: false, current: false, hasQuiz: true, quizPassed: false, quizQuestions: getQuizForStep('2') },
      { id: '3', title: 'Struktur Kontrol', description: 'Percabangan dan perulangan', completed: false, current: false, hasQuiz: true, quizPassed: false, quizQuestions: getQuizForStep('3') },
      { id: '4', title: 'Fungsi', description: 'Membuat dan menggunakan fungsi', completed: false, current: false, hasQuiz: true, quizPassed: false, quizQuestions: getQuizForStep('4') },
      { id: '5', title: 'Proyek Kecil', description: 'Membuat proyek sederhana', completed: false, current: false, hasQuiz: true, quizPassed: false, quizQuestions: getQuizForStep('5') },
      { id: '6', title: 'Evaluasi', description: 'Review & evaluasi akhir', completed: false, current: false, hasQuiz: true, quizPassed: false, quizQuestions: getQuizForStep('6') },
    ],
  };
  return templates[topic] || templates.matematika;
}

export default function LearningPathsPage() {
  const [showInitialModal, setShowInitialModal] = useState(false);
  const [hasAnsweredQuestions, setHasAnsweredQuestions] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [mascotMessage, setMascotMessage] = useState('Selamat datang di Learning Path! 🎓');
  const [mascotMood, setMascotMood] = useState<'happy' | 'thinking' | 'waving' | 'idle'>('waving');
  const [learningPathData, setLearningPathData] = useState<LearningPathData | null>(null);
  const [showRoadmap, setShowRoadmap] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizStep, setCurrentQuizStep] = useState<RoadmapStep | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const hasLoaded = useRef(false);
  const isSaving = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    const history = loadChatHistory('learning-path');
    setChatHistory(history);
    const pathData = loadLearningPathData();
    if (pathData) {
      setLearningPathData(pathData);
      setHasAnsweredQuestions(true);
      setMascotMessage(`Kamu sedang belajar ${pathData.subtopic}. Silahkan tanya kalau ada yang kurang paham! 💡`);
    } else {
      setShowInitialModal(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded.current || isSaving.current) return;
    saveChatHistory(chatHistory);
  }, [chatHistory]);

  const handleInitialQuestionsSubmit = (answers: { goal: string; topic: string; subtopic: string; difficulty: string }) => {
    localStorage.setItem('hasCompletedInitialQuestions', 'true');
    localStorage.setItem('initialAnswers', JSON.stringify(answers));
    setHasAnsweredQuestions(true);
    setShowInitialModal(false);
    const roadmap = generateRoadmap(answers.topic);
    const pathData: LearningPathData = { ...answers, roadmap };
    setLearningPathData(pathData);
    saveLearningPathData(pathData);
    setShowRoadmap(true);
    setMascotMessage(`Roadmap untuk ${answers.subtopic} sudah dibuat! Yuk mulai belajar! 🚀`);
    setMascotMood('happy');
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: message, createdAt: new Date() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    const currentMessage = message;
    setMessage('');
    setIsLoading(true);
    const chatId = currentChatId || Date.now().toString();
    if (!currentChatId) {
      setCurrentChatId(chatId);
      const title = message.slice(0, 40) + (message.length > 40 ? '...' : '');
      const newHistory: ChatHistory = { id: chatId, title, messages: [userMessage], createdAt: new Date(), type: 'learning-path' };
      isSaving.current = true;
      setChatHistory((prev) => { const updated = [newHistory, ...prev]; saveChatHistory(updated); setTimeout(() => { isSaving.current = false; }, 0); return updated; });
    } else {
      setChatHistory((prev) => { const updated = prev.map((chat) => chat.id === chatId ? { ...chat, messages: updatedMessages } : chat); saveChatHistory(updated); return updated; });
    }
    const currentStep = learningPathData?.roadmap.find(s => s.current);
    const roadmapContext = currentStep ? `Kamu sedang di tahap: ${currentStep.title}. ${currentStep.description}.` : 'Kamu bisa tanya tentang materi yang sedang kamu pelajari.';
    setTimeout(() => {
      const assistantMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: `Terima kasih atas pertanyaanmu: "${currentMessage}"\n\n${roadmapContext}\n\nAI Assistant sedang memproses jawaban... (Mode demo)`, createdAt: new Date() };
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      setIsLoading(false);
      const finalChatId = currentChatId || chatId;
      setChatHistory((prev) => { const updated = prev.map((chat) => chat.id === finalChatId ? { ...chat, messages: finalMessages } : chat); saveChatHistory(updated); return updated; });
    }, 1000);
  };

  const handleNewChat = () => { window.location.href = '/'; };
  const handleSelectChat = (chatId: string) => { const chat = chatHistory.find((c) => c.id === chatId); if (chat) { setMessages(chat.messages); setCurrentChatId(chat.id); } };
  const handleLearningPathClick = () => {};

  const handleTakeQuiz = (step: RoadmapStep) => {
    setCurrentQuizStep(step);
    setShowQuiz(true);
    setQuizAnswers(new Array(step.quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(null);
    setMascotMessage(`Waktunya quiz ${step.title}! Semangat! 💪`);
  };

  const handleQuizSubmit = () => {
    if (!currentQuizStep || !learningPathData) return;
    const correctCount = currentQuizStep.quizQuestions.filter((q, i) => quizAnswers[i] === q.correct).length;
    const score = Math.round((correctCount / currentQuizStep.quizQuestions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    const passed = score >= 70;
    if (passed) {
      const updatedRoadmap = learningPathData.roadmap.map((step, index) => {
        if (step.id === currentQuizStep.id) return { ...step, completed: true, current: false, quizPassed: true };
        const currentIndex = learningPathData.roadmap.findIndex(s => s.id === currentQuizStep.id);
        if (index === currentIndex + 1) return { ...step, current: true };
        return step;
      });
      const updatedData = { ...learningPathData, roadmap: updatedRoadmap };
      setLearningPathData(updatedData);
      saveLearningPathData(updatedData);
      setMascotMessage(`Selamat! Kamu lulus quiz ${currentQuizStep.title}! 🎉 Lanjut ke tahap berikutnya!`);
    } else {
      setMascotMessage(`Belum lulus, coba lagi yuk! 💪`);
    }
  };

  const handleRetakeQuiz = () => {
    if (!currentQuizStep) return;
    setQuizAnswers(new Array(currentQuizStep.quizQuestions.length).fill(null));
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
    setCurrentQuizStep(null);
    setQuizAnswers([]);
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const showRoadmapView = showRoadmap && learningPathData && !showQuiz;
  const currentStep = learningPathData?.roadmap.find(s => s.current);

  return (
    <MainLayout
      onNewChat={handleNewChat}
      onSelectChat={handleSelectChat}
      onLearningPathClick={handleLearningPathClick}
      chats={chatHistory.map((c) => ({ id: c.id, title: c.title, preview: c.messages[c.messages.length - 1]?.content?.slice(0, 60), updatedAt: c.createdAt }))}
      closeSidebarOnMount={true}
    >
      <div className="flex flex-col h-full">
        {showQuiz && currentQuizStep ? (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-3xl mx-auto">
              <button onClick={handleCloseQuiz} className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Kembali ke Chat
              </button>
              <Quiz
                questions={currentQuizStep.quizQuestions}
                passingScore={70}
                answers={quizAnswers}
                setAnswers={setQuizAnswers}
                submitted={quizSubmitted}
                score={quizScore}
                onSubmit={handleQuizSubmit}
                onRetake={handleRetakeQuiz}
              />
            </div>
          </div>
        ) : showRoadmapView ? (
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">🗺️ Roadmap Belajar</h1>
                <p className="text-gray-600">{learningPathData.subtopic} • {learningPathData.difficulty === 'beginner' ? 'Pemula' : learningPathData.difficulty === 'intermediate' ? 'Menengah' : 'Lanjutan'}</p>
              </div>
              <div className="relative max-w-md mx-auto">
                {learningPathData.roadmap.map((step, index) => (
                  <div key={step.id} className="relative">
                    {index < learningPathData.roadmap.length - 1 && (
                      <div className="flex justify-center"><div className={`w-1 h-12 ${step.completed ? 'bg-green-500' : step.current ? 'bg-gradient-to-b from-blue-500 to-gray-300' : 'bg-gray-300'}`} /></div>
                    )}
                    <div className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 ${step.completed ? 'bg-green-500 border-green-600 text-white shadow-lg shadow-green-200' : step.current ? 'bg-blue-500 border-blue-600 text-white shadow-lg shadow-blue-200 animate-pulse' : 'bg-white border-gray-300 text-gray-500'}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${step.completed ? 'bg-green-600' : step.current ? 'bg-blue-600' : 'bg-gray-200'}`}>
                        {step.completed ? '✓' : step.current ? '►' : index + 1}
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-bold">{step.title}</h3>
                        <p className={`text-sm ${step.completed || step.current ? 'text-white/80' : 'text-gray-400'}`}>{step.description}</p>
                      </div>
                      {step.hasQuiz && (
                        <div className={`px-2 py-1 rounded text-xs font-medium ${step.quizPassed ? 'bg-green-600 text-white' : step.current ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-200 text-gray-600'}`}>
                          {step.quizPassed ? '✓ Quiz OK' : step.current ? 'Quiz →' : '🔒'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 max-w-md mx-auto p-4 bg-white rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Progress</span>
                  <span className="text-sm font-bold text-gray-900">{learningPathData.roadmap.filter(s => s.completed).length}/{learningPathData.roadmap.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500" style={{ width: `${(learningPathData.roadmap.filter(s => s.completed).length / learningPathData.roadmap.length) * 100}%` }} />
                </div>
              </div>
              {currentStep && (
                <div className="mt-6 text-center">
                  <button onClick={() => setShowRoadmap(false)} className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all">
                    {currentStep.title} - Mulai Chat 💬
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {learningPathData && currentStep && (
              <div className="bg-white p-3 border-b border-gray-200">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-bold text-gray-900">📚 {currentStep.title} - {learningPathData.subtopic}</h2>
                    <div className="flex items-center gap-2">
                      {currentStep.hasQuiz && !currentStep.quizPassed && (
                        <button onClick={() => handleTakeQuiz(currentStep)} className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-lg text-xs font-bold hover:bg-yellow-500 transition-all">Kerja Quiz →</button>
                      )}
                      <button onClick={() => setShowRoadmap(true)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Lihat Roadmap</button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 overflow-x-auto">
                    {learningPathData.roadmap.map((step, index) => (
                      <div key={step.id} className="flex items-center">
                        <div className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${step.completed ? 'bg-green-100 text-green-700' : step.current ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                          {step.completed ? '✓' : step.current ? '►' : index + 1} {step.title}
                        </div>
                        {index < learningPathData.roadmap.length - 1 && <div className={`w-2 h-0.5 mx-1 ${step.completed ? 'bg-green-400' : 'bg-gray-300'}`} />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <ChatContainer messages={messages} message={message} isLoading={isLoading} mode="learning-path" onMessageChange={setMessage} onSendMessage={handleSendMessage} />
          </>
        )}
      </div>

      <InitialQuestionsModal isOpen={showInitialModal} onClose={() => setShowInitialModal(false)} onSkip={() => setShowInitialModal(false)} onSubmit={handleInitialQuestionsSubmit} />
      <Mascot message={mascotMessage} mood={mascotMood} showChat={true} />
    </MainLayout>
  );
}
