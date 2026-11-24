import React from 'react';
import type { RoomData, Language } from '../../types/showroom';
import { UI_TRANSLATIONS } from '../../data/rooms';
import { Compass, X, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

interface RoomDetailCardProps {
  room: RoomData;
  language: Language;
  onExplore: (roomId: string) => void;
  onClose: () => void;
}

export const RoomDetailCard: React.FC<RoomDetailCardProps> = ({
  room,
  language,
  onExplore,
  onClose
}) => {
  const isArabic = language === 'ar';
  const t = UI_TRANSLATIONS[language];
  const Chevron = isArabic ? ChevronLeft : ChevronRight;

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="pointer-events-auto w-full max-w-md glass-panel p-4 sm:p-5 rounded-3xl border border-white/80 shadow-2xl transition-all duration-300 animate-slideUp"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm text-white"
            style={{ backgroundColor: room.color }}
          >
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
              {isArabic ? room.nameAr : room.name}
            </h3>
            <span className="text-xs text-gray-500 font-medium">
              {isArabic ? room.name : room.nameAr}
            </span>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
        {isArabic ? room.descriptionAr : room.description}
      </p>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onExplore(room.id)}
          className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FFB531] to-[#EC6B1F] text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer group"
        >
          <Sparkles className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
          <span>{t.exploreRoom}</span>
          <Chevron className="w-4 h-4 text-black" />
        </button>
      </div>
    </div>
  );
};
