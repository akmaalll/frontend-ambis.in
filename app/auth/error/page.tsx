'use client';

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h1>
        <p className="text-gray-600 mb-6">
          Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
