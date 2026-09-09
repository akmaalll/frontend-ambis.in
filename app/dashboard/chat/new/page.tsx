'use client';

import MainLayout from '@/components/Layout/MainLayout';

export default function NewChatPage() {
  return (
    <MainLayout>
      <div className="p-8">
        <div className="text-center py-16">
          <div className="text-5xl mb-4">💬</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Percakapan Baru</h1>
          <p className="text-gray-600 mb-6">
            Mulai percakapan baru dengan AI assistant
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Kembali ke Dashboard
          </a>
        </div>
      </div>
    </MainLayout>
  );
}
