import React from 'react';
import type { Language } from '../../types/showroom';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  compact?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage,
  onLanguageChange,
  compact = false
}) => {
  return (
    <div className="inline-flex items-center glass-panel rounded-xl p-1 gap-1 shadow-sm border border-white/60">
      <button
        type="button"
        onClick={() => onLanguageChange('ar')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
          currentLanguage === 'ar'
            ? 'bg-[#FFB531] text-black shadow-sm'
            : 'text-gray-600 hover:text-black hover:bg-white/60'
        }`}
        title="العربية"
      >
        العربية
      </button>

      <span className="w-[1px] h-3 bg-gray-300" />

      <button
        type="button"
        onClick={() => onLanguageChange('en')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
          currentLanguage === 'en'
            ? 'bg-[#FFB531] text-black shadow-sm'
            : 'text-gray-600 hover:text-black hover:bg-white/60'
        }`}
        title="English"
      >
        EN
      </button>

      {!compact && (
        <Globe className="w-3.5 h-3.5 text-gray-400 mx-1 hidden sm:inline-block" />
      )}
    </div>
  );
};
