import { useRouter } from 'next/navigation';

interface FeatureSelectorProps {
  hasAnsweredQuestions?: boolean;
  onLearningPathClick?: () => void;
}

export function FeatureSelector({ hasAnsweredQuestions = true, onLearningPathClick }: FeatureSelectorProps) {
  const router = useRouter();

  const handleAskClick = () => {
    const textarea = document.querySelector('textarea');
    if (textarea) textarea.focus();
  };

  const handleLearnClick = () => {
    if (!hasAnsweredQuestions) {
      if (onLearningPathClick) onLearningPathClick();
      return;
    }
    router.push('/dashboard/learning');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
      {/* Ask Feature */}
      <button
        onClick={handleAskClick}
        className="flex-1 max-w-sm mx-auto sm:mx-0 w-full sm:w-auto bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-200 hover:border-blue-300 group"
      >
        <div className="text-3xl sm:text-4xl mb-2 sm:mb-4 group-hover:scale-110 transition-transform">
          💬
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Tanya Apapun</h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4">
          Bertanya tentang topik apapun yang kamu inginkan
        </p>
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs sm:text-sm font-medium group-hover:bg-blue-700 transition-colors">
          ?
        </div>
      </button>

      {/* Learning Path Feature */}
      <button
        onClick={handleLearnClick}
        className="flex-1 max-w-sm mx-auto sm:mx-0 w-full sm:w-auto bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-purple-300 hover:border-purple-400 group"
      >
        <div className="text-3xl sm:text-4xl mb-2 sm:mb-4 group-hover:scale-110 transition-transform">
          📚
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Learning Path</h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4">
          Program belajar terstruktur Matematika & Informatika
        </p>
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs sm:text-sm font-medium group-hover:bg-purple-700 transition-colors">
          📖
        </div>
      </button>
    </div>
  );
}

export default FeatureSelector;
