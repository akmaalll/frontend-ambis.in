'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/Layout/MainLayout';

interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
}

const chapterData: Record<string, Record<string, Chapter[]>> = {
  matematika: {
    'aljabar-dasar': [
      {
        id: 'pengenalan-variabel',
        title: 'Pengenalan Variabel',
        content: `Variabel adalah lambang atau simbol yang digunakan untuk mewakili nilai yang belum diketahui dalam matematika.\n\nDalam aljabar, kita sering menggunakan huruf seperti x, y, atau z untuk merepresentasikan nilai yang tidak diketahui.\n\n**Contoh:**\n- x + 5 = 10  (x adalah variabel)\n- 2y = 8      (y adalah variabel)\n\n**Mengapa Menggunakan Variabel?**\n\n1. Untuk merepresentasikan nilai yang belum diketahui\n2. Untuk membuat rumus yang umum\n3. Untuk menyelesaikan persamaan\n\n**Fakta Menarik:**\nHuruf "x" sering digunakan sebagai variabel karena kebiasaan matematikawan Arab pada abad ke-9 yang menulis "shay" (artinya "sesuatu") dalam tulisan Arab. Ketika materi matematika ini diterjemahkan ke bahasa Eropa, "shay" diganti dengan huruf "x".`,
        order: 1,
      },
      {
        id: 'konstanta-dan-koefisien',
        title: 'Konstanta dan Koefisien',
        content: `Selain variabel, dalam aljabar kita juga mengenal konstanta dan koefisien.\n\n**Konstanta**\nKonstanta adalah nilai yang tetap dan tidak berubah. Contohnya: angka 5, 10, 3.14, dll.\n\n**Koefisien**\nKoefisien adalah angka yang mengalikan variabel. Contohnya:\n- 2x -> 2 adalah koefisien dari x\n- -3y -> -3 adalah koefisien dari y\n- x -> koefisiennya adalah 1 (karena 1x = x)\n\n**Contoh Ekspresi Aljabar:**\n- 2x + 5 -> 2 adalah koefisien x, 5 adalah konstanta\n- 3x - 2y + 7 -> 3 dan -2 adalah koefisien, 7 adalah konstanta\n\n**Latihan:**\nTentukan koefisien dan konstanta dari: 4a - 3b + 8\n\n**Jawaban:**\n- Koefisien a: 4\n- Koefisien b: -3\n- Konstanta: 8`,
        order: 2,
      },
      {
        id: 'operasi-pada-variabel',
        title: 'Operasi pada Variabel',
        content: `Kita dapat melakukan operasi matematika pada variabel, sama seperti pada angka.\n\n**Penjumlahan dan Pengurangan**\nKita hanya bisa menjumlahkan atau mengurangkan variabel yang sama (variabel sejenis).\n\nContoh:\n- 2x + 3x = 5x (benar)\n- x + y = x + y (tidak bisa disederhanakan)\n- 3x - 2x = x\n\n**Perkalian**\n- 2x × 3 = 6x\n- x × x = x²\n- 2x × 3y = 6xy\n\n**Pembagian**\n- 6x ÷ 2 = 3x\n- x² ÷ x = x\n\n**Eksponen (Pangkat)**\n- x² = x × x\n- x³ = x × x × x\n- 2x² = 2 × x × x\n\n**Prioritas Operasi**\nSama seperti operasi hitung biasa:\n1. Kerjakan di dalam tanda kurung\n2. Eksponen\n3. Perkalian/Pembagian\n4. Penjumlahan/Pengurangan`,
        order: 3,
      },
    ],
    'persamaan-linear': [
      {
        id: 'pengenalan-persamaan',
        title: 'Pengenalan Persamaan Linear',
        content: `Persamaan linear adalah kalimat matematika yang menyatakan kesamaan dua ekspresi dan memiliki derajat satu (pangkat tertinggi adalah 1).\n\n**Bentuk Umum Persamaan Linear Satu Variabel:**\nax + b = c\n\ndimana:\n- x adalah variabel\n- a, b, c adalah konstanta\n- a ≠ 0\n\n**Contoh Persamaan Linear:**\n- x + 3 = 7\n- 2x - 5 = 11\n- 3x + 2 = 2x + 8\n\n**Cara Membaca Persamaan:**\n"x + 3 = 7" dibaca: "x ditambah 3 sama dengan 7"\n\n**Istilah dalam Persamaan:**\n- ruas kiri: x + 3\n- ruas kanan: 7\n- tanda sama dengan: =\n\n**Prinsip Dasar:**\nApa yang dilakukan pada satu ruas, harus dilakukan juga pada ruas lainnya agar persamaan tetap benar (seimbang).`,
        order: 1,
      },
      {
        id: 'menyelesaikan-plsv',
        title: 'Menyelesaikan PLSV',
        content: `PLSV = Persamaan Linear Satu Variabel\n\nUntuk menyelesaikan PLSV, kita perlu mencari nilai variabel yang membuat persamaan menjadi benar.\n\n**Langkah-langkah Menyelesaikan PLSV:**\n\n1. **Pisahkan variabel dan konstanta**\n   Pindahkan semua suku yang mengandung variabel ke ruas kiri, dan konstanta ke ruas kanan.\n\n2. **Sederhanakan**\n   Lakukan operasi hitung untuk mendapatkan nilai variabel.\n\n**Contoh 1:**\nx + 5 = 12\n\nx = 12 - 5\nx = 7\n\n**Contoh 2:**\n2x - 3 = 7\n\n2x = 7 + 3\n2x = 10\nx = 5\n\n**Contoh 3:**\n3x + 2 = 2x + 8\n\n3x - 2x = 8 - 2\nx = 6\n\n**Contoh 4:**\n2(x + 3) = 16\n\n2x + 6 = 16\n2x = 16 - 6\n2x = 10\nx = 5\n\n**Tips:**\n- Selalu periksa jawaban dengan mensubstitusikan nilai x ke persamaan awal\n- Jika hasilnya benar, maka solusi sudah tepat!`,
        order: 2,
      },
    ],
  },
  informatika: {
    'dasar-pemrograman': [
      {
        id: 'pengenalan-variabel-prog',
        title: 'Pengenalan Variabel dalam Pemrograman',
        content: `Variabel dalam pemrograman adalah wadah untuk menyimpan data.\n\n**Apa itu Variabel?**\nVariabel adalah nama yang diberikan untuk menyimpan suatu nilai. Nilai ini dapat diubah selama program berjalan.\n\n**Contoh dalam JavaScript:**\n\`\`\`javascript\nlet nama = "Budi";\nlet umur = 20;\nlet tinggi = 175.5;\n\`\`\`\n\n**Jenis-jenis Variabel:**\n- **String**: teks, contoh: "Hello World"\n- **Number**: angka, contoh: 42, 3.14\n- **Boolean**: true/false\n- **Array**: kumpulan data, contoh: [1, 2, 3]\n- **Object**: data terstruktur, contoh: {nama: "Budi"}\n\n**Aturan Penamaan Variabel:**\n1. Harus diawali dengan huruf, underscore (_), atau tanda dolar ($\n2. Boleh mengandung huruf, angka, underscore, atau dollar\n3. Case sensitive (nama berbeda dengan Nama)\n4. Tidak boleh menggunakan kata kunci bahasa pemrograman\n\n**Konvensi Penamaan:**\n- camelCase: firstName, age, isStudent\n- snake_case: first_name, age, is_student\n- UPPER_CASE: MAX_VALUE, PI (untuk konstanta)`,
        order: 1,
      },
      {
        id: 'tipe-data',
        title: 'Tipe Data Dasar',
        content: `Tipe data menentukan jenis nilai yang dapat disimpan dalam variabel.\n\n**1. Number (Angka)**\n\`\`\`javascript\nlet umur = 25;           // integer\nlet phi = 3.14;          // floating point\nlet negatif = -10;       // negative number\n\`\`\`\n\n**2. String (Teks)**\n\`\`\`javascript\nlet nama = "Budi";\nlet pesan = 'Hello World';\n\`\`\`\n\n**3. Boolean (Logika)**\n\`\`\`javascript\nlet isActive = true;\nlet isMarried = false;\n\`\`\`\n\n**4. Undefined dan Null**\n\`\`\`javascript\nlet x;          // undefined - belum diberi nilai\nlet y = null;   // null - secara sengaja tidak ada nilai\n\`\`\`\n\n**5. Array (Kumpulan Data)**\n\`\`\`javascript\nlet angka = [1, 2, 3, 4, 5];\nlet warna = ["merah", "biru", "hijau"];\n\`\`\`\n\n**6. Object (Data Terstruktur)**\n\`\`\`javascript\nlet orang = {\n  nama: "Budi",\n  umur: 25,\n  pekerjaan: "Programmer"\n};\n\`\`\``,
        order: 2,
      },
    ],
  },
};

const moduleNames: Record<string, Record<string, string>> = {
  matematika: {
    'aljabar-dasar': 'Aljabar Dasar',
    'persamaan-linear': 'Persamaan Linear',
    'sistem-persamaan': 'Sistem Persamaan',
    'fungsi-dan-grafik': 'Fungsi & Grafik',
  },
  informatika: {
    'dasar-pemrograman': 'Dasar Pemrograman',
    'alur-kendali': 'Alur Kendali',
    'fungsi-dan-prosedur': 'Fungsi & Prosedur',
    'struktur-data': 'Struktur Data',
    'pemrograman-oo': 'OOP Dasar',
  },
};

const quizData: Record<string, Array<{
  id: string;
  question: string;
  options: string[];
  correct: number;
}>> = {
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

export default function ChapterContentPage() {
  const params = useParams();
  const router = useRouter();
  const subject = params.subject as string || 'matematika';
  const moduleId = params.module as string || 'aljabar-dasar';
  const chapterId = params.chapter as string;

  const chapters = chapterData[subject]?.[moduleId] || [];
  const moduleTitle = moduleNames[subject]?.[moduleId] || moduleId;

  // If no chapter specified, redirect to first chapter
  const currentChapterId = chapterId || (chapters[0]?.id ?? '');
  const currentChapter = chapters.find((c) => c.id === currentChapterId) || chapters[0];

  const [isCompleted, setIsCompleted] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load completed chapters from localStorage
    const completed = new Set<string>();
    chapters.forEach((chapter) => {
      if (localStorage.getItem(`chapterCompleted_${chapter.id}`) === 'true') {
        completed.add(chapter.id);
      }
    });
    setCompletedChapters(completed);
  }, [chapters]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleComplete = () => {
    setIsCompleted(true);
    localStorage.setItem(`chapterCompleted_${currentChapter?.id}`, 'true');
    setCompletedChapters((prev) => new Set(prev).add(currentChapter?.id || ''));
  };

  const handleStartQuiz = () => {
    router.push(`/dashboard/learning/${subject}/${moduleId}/${currentChapter?.id}/quiz`);
  };

  const handleChapterClick = (id: string) => {
    router.push(`/dashboard/learning/${subject}/${moduleId}/${id}`);
  };

  if (!currentChapter) {
    return (
      <MainLayout>
        <div className="p-8 text-center">
          <div className="text-5xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Chapter Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-4">Chapter yang kamu cari tidak tersedia.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Kembali
          </button>
        </div>
      </MainLayout>
    );
  }

  const currentIndex = chapters.findIndex((c) => c.id === currentChapter.id);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  return (
    <MainLayout>
      <div className="flex h-full">
        {/* Chapter Sidebar - Hidden on mobile */}
        <div className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col flex-shrink-0">
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={() => router.push(`/dashboard/learning/${subject}`)}
              className="text-sm text-gray-600 hover:text-gray-900 transition flex items-center gap-1"
            >
              ← Kembali ke {moduleTitle}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">
              Daftar Chapter
            </p>
            <div className="space-y-1">
              {chapters.map((chapter, idx) => {
                const isActive = chapter.id === currentChapter.id;
                const isDone = completedChapters.has(chapter.id);
                return (
                  <button
                    key={chapter.id}
                    onClick={() => handleChapterClick(chapter.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        isDone
                          ? 'bg-green-100 text-green-600'
                          : isActive
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {isDone ? '✓' : idx + 1}
                      </span>
                      <span className="truncate">{chapter.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-4 md:p-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
              <button
                onClick={() => router.push(`/dashboard/learning/${subject}`)}
                className="text-blue-600 hover:text-blue-800 transition"
              >
                ← Kembali
              </button>
              <span className="text-gray-400">/</span>
              <span className="text-gray-700">{moduleTitle}</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{currentChapter.title}</span>
            </nav>

            {/* Chapter Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
              {currentChapter.title}
            </h1>

            {/* Interactive Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
              {currentChapter.content.split('\n').map((paragraph, idx) => {
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  // Section header
                  const headerText = paragraph.replace(/\*\*/g, '');
                  const sectionId = `section-${idx}`;
                  const isExpanded = expandedSections[sectionId] !== false; // default expanded
                  return (
                    <div key={idx} className="mb-4">
                      <button
                        onClick={() => toggleSection(sectionId)}
                        className="w-full flex items-center justify-between text-left"
                      >
                        <h3 className="text-lg font-bold text-gray-900">
                          {headerText}
                        </h3>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isExpanded && (
                        <div className="mt-2 border-l-4 border-blue-200 pl-4">
                          <p className="text-gray-700 text-sm">Klik untuk melihat detail...</p>
                        </div>
                      )}
                    </div>
                  );
                } else if (paragraph.startsWith('- ') || paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ') || paragraph.startsWith('4. ')) {
                  // List item
                  return (
                    <div key={idx} className="flex items-start gap-2 mb-2 ml-4">
                      <span className="text-blue-500 mt-1">•</span>
                      <p className="text-gray-700 text-sm flex-1">{paragraph.replace(/^- /, '').replace(/^\d+\. /, '')}</p>
                    </div>
                  );
                } else if (paragraph.startsWith('```')) {
                  // Code block marker - skip, handled by next lines
                  return null;
                } else if (paragraph.trim() === '') {
                  return <div key={idx} className="h-3" />;
                } else {
                  return (
                    <p key={idx} className="text-gray-700 text-sm leading-relaxed mb-3">
                      {paragraph}
                    </p>
                  );
                }
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 md:mb-8">
              <button
                onClick={handleComplete}
                disabled={isCompleted}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm md:text-base ${
                  isCompleted
                    ? 'bg-green-100 text-green-700 cursor-default'
                    : 'bg-green-50 text-green-700 border border-green-300 hover:bg-green-100'
                }`}
              >
                <svg
                  className={`w-4 h-4 md:w-5 md:h-5 ${isCompleted ? 'text-green-600' : ''}`}
                  fill={isCompleted ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {isCompleted ? '✓ Selesai Membaca' : '✓ Selesai Membaca'}
              </button>

              <button
                onClick={handleStartQuiz}
                className="px-4 md:px-6 py-2 md:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                📝 Kerjakan Quiz
              </button>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4 md:pt-6 border-t border-gray-200 gap-2">
              {prevChapter ? (
                <button
                  onClick={() => handleChapterClick(prevChapter.id)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div className="text-left">
                    <p className="text-xs text-gray-400">Sebelumnya</p>
                    <p className="text-sm font-medium">{prevChapter.title}</p>
                  </div>
                </button>
              ) : (
                <div />
              )}
              {nextChapter && (
                <button
                  onClick={() => handleChapterClick(nextChapter.id)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
                >
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Selanjutnya</p>
                    <p className="text-sm font-medium">{nextChapter.title}</p>
                  </div>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
