import React from 'react';

interface LoadingIndicatorProps {
  progress?: number;
  message?: string;
  submessage?: string;
  isArabic?: boolean;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  progress = 0,
  message = 'Loading MDC 3D Showroom...',
  submessage = 'Preparing high-definition floor plan',
  isArabic = false
}) => {
  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#F8F8F8] px-6 transition-opacity duration-500"
    >
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        {/* MDC Brand Emblem */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#FFB531] to-[#EC6B1F] p-0.5 shadow-xl animate-pulse">
            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center">
              <span className="text-2xl font-black tracking-wider text-[#EC6B1F]">
                MDC
              </span>
            </div>
          </div>
          <div className="absolute -inset-2 rounded-3xl bg-[#FFB531]/20 blur-lg -z-10" />
        </div>

        {/* Message */}
        <h2 className="text-lg font-bold text-gray-900 mb-1">{message}</h2>
        <p className="text-xs text-gray-500 mb-6">{submessage}</p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200/80 rounded-full h-2 overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-[#FFB531] to-[#EC6B1F] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(5, Math.min(100, progress))}%` }}
          />
        </div>

        <div className="w-full flex justify-between items-center text-[11px] font-medium text-gray-400">
          <span>{Math.round(progress)}%</span>
          <span>{isArabic ? 'إم دي سي للمفروشات' : 'MDC Home Furnishings'}</span>
        </div>
      </div>
    </div>
  );
};
