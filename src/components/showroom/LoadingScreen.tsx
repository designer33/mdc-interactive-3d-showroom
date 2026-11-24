import React from 'react';
import { useProgress } from '@react-three/drei';
import { LoadingIndicator } from '../common/LoadingIndicator';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface LoadingScreenProps {
  error?: string | null;
  onRetry?: () => void;
  isArabic?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  error,
  onRetry,
  isArabic = false
}) => {
  const { progress, active } = useProgress();

  if (error) {
    return (
      <div
        dir={isArabic ? 'rtl' : 'ltr'}
        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#F8F8F8] px-6 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4 border border-red-200">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {isArabic ? 'تعذر تحميل المعرض ثلاثي الأبعاد' : 'Unable to Load 3D Showroom'}
        </h2>
        <p className="text-sm text-gray-500 max-w-sm mb-6">
          {isArabic
            ? 'حدث خطأ أثناء تحميل نموذج المخطط. يُرجى التحقق من الاتصال والمحاولة مرة أخرى.'
            : 'An error occurred while loading the showroom model. Please check connection and try again.'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFB531] hover:bg-[#ffa710] text-black font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isArabic ? 'إعادة المحاولة' : 'Retry'}</span>
          </button>
        )}
      </div>
    );
  }

  if (!active && progress === 100) {
    return null;
  }

  return (
    <LoadingIndicator
      progress={progress}
      message={isArabic ? 'جارٍ تحميل معرض إم دي سي...' : 'Loading MDC 3D Showroom...'}
      submessage={isArabic ? 'تجهيز المخطط التفاعلي' : 'Preparing interactive floor plan'}
      isArabic={isArabic}
    />
  );
};
