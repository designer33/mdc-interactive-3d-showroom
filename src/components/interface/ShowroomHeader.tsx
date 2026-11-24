import React from 'react';
import type { Language, RoomData } from '../../types/showroom';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Layers, ChevronRight, ChevronLeft } from 'lucide-react';

interface ShowroomHeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  selectedRoom: RoomData | null;
  onResetToFloorPlan: () => void;
  isEmbedded?: boolean;
}

export const ShowroomHeader: React.FC<ShowroomHeaderProps> = ({
  language,
  onLanguageChange,
  selectedRoom,
  onResetToFloorPlan,
  isEmbedded = false
}) => {
  const isArabic = language === 'ar';
  const Chevron = isArabic ? ChevronLeft : ChevronRight;

  return (
    <header
      dir={isArabic ? 'rtl' : 'ltr'}
      className="absolute top-0 left-0 right-0 z-30 pointer-events-none p-3 sm:p-5 flex items-center justify-between"
    >
      {/* Brand & Breadcrumbs */}
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
        {/* Brand Badge */}
        <button
          type="button"
          onClick={onResetToFloorPlan}
          className="glass-panel px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl flex items-center gap-2.5 hover:bg-white/95 transition-all text-start cursor-pointer border border-white/70 shadow-md group"
        >
          {/* MDC Logo Mark */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FFB531] to-[#EC6B1F] flex items-center justify-center text-white font-black text-xs shadow-sm group-hover:scale-105 transition-transform">
            MDC
          </div>

          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
              {isArabic ? 'إم دي سي للمفروشات' : 'MDC Home Furnishings'}
            </span>
            <span className="text-[10px] text-gray-500 font-medium">
              {isArabic ? 'معرض ثلاثي الأبعاد' : '3D Showroom'}
            </span>
          </div>
        </button>

        {/* Selected Room Pill in Header (if a room is active) */}
        {selectedRoom && (
          <div className="hidden md:flex items-center gap-1.5 glass-panel px-3 py-1.5 rounded-xl border border-white/70 shadow-sm animate-fadeIn">
            <Layers className="w-3.5 h-3.5 text-gray-400" />
            <Chevron className="w-3.5 h-3.5 text-gray-300" />
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: selectedRoom.color }}
            />
            <span className="text-xs font-semibold text-gray-800">
              {isArabic ? selectedRoom.nameAr : selectedRoom.name}
            </span>
          </div>
        )}
      </div>

      {/* Language Switcher and Controls */}
      <div className="pointer-events-auto flex items-center gap-2">
        <LanguageSwitcher
          currentLanguage={language}
          onLanguageChange={onLanguageChange}
          compact={isEmbedded}
        />
      </div>
    </header>
  );
};
