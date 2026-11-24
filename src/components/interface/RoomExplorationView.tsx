import React, { useState, useEffect } from 'react';
import type { RoomData, Language } from '../../types/showroom';
import { UI_TRANSLATIONS, ROOMS } from '../../data/rooms';
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Layers,
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';

interface RoomExplorationViewProps {
  room: RoomData;
  language: Language;
  onBack: () => void;
  onSelectRoom: (roomId: string) => void;
}

export const RoomExplorationView: React.FC<RoomExplorationViewProps> = ({
  room,
  language,
  onBack,
  onSelectRoom
}) => {
  const isArabic = language === 'ar';
  const t = UI_TRANSLATIONS[language];
  const BackArrow = isArabic ? ArrowRight : ArrowLeft;

  const [hasRoomModel, setHasRoomModel] = useState<boolean>(false);

  // Check if room GLB exists dynamically at /models/rooms/[id].glb
  useEffect(() => {
    let isMounted = true;

    if (room.model) {
      fetch(room.model, { method: 'HEAD' })
        .then((res) => {
          if (isMounted) {
            setHasRoomModel(res.ok);
          }
        })
        .catch(() => {
          if (isMounted) {
            setHasRoomModel(false);
          }
        });
    } else {
      setHasRoomModel(false);
    }

    return () => {
      isMounted = false;
    };
  }, [room.model]);

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="absolute inset-0 z-40 flex flex-col bg-[#F8F8F8]/95 backdrop-blur-xl animate-fadeIn overflow-hidden"
    >
      {/* Top Navigation Bar */}
      <div className="w-full px-4 py-3 sm:px-6 sm:py-4 glass-panel border-b border-gray-200/60 flex items-center justify-between gap-4">
        {/* Back to Floor Plan Button */}
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs sm:text-sm shadow-sm border border-gray-200/80 hover:border-gray-300 active:scale-95 transition-all cursor-pointer group"
        >
          <BackArrow className="w-4 h-4 text-[#EC6B1F] group-hover:-translate-x-0.5 transition-transform" />
          <span>{t.backToFloorPlan}</span>
        </button>

        {/* Room Title */}
        <div className="flex items-center gap-2.5">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: room.color }}
          />
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            {isArabic ? room.nameAr : room.name}
          </h2>
          <span className="hidden sm:inline-block text-xs text-gray-400">
            ({isArabic ? room.name : room.nameAr})
          </span>
        </div>

        {/* Room Switcher Pills */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto">
          {ROOMS.map((r) => {
            const isCurrent = r.id === room.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectRoom(r.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isCurrent
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
              >
                {isArabic ? r.nameAr : r.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 overflow-y-auto">
        {/* Large Preview / 3D Canvas Area */}
        <div className="flex-1 min-h-[340px] sm:min-h-[440px] rounded-3xl bg-white border border-gray-200/80 shadow-md flex flex-col items-center justify-center p-6 relative overflow-hidden">
          {/* Subtle geometric background pattern */}
          <div
            className="absolute -inset-10 opacity-30 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(${room.color} 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          />

          {hasRoomModel ? (
            <div className="w-full h-full flex items-center justify-center">
              {/* Dynamic room 3D model would be mounted here */}
              <span className="text-sm text-gray-500">Loading Room 3D Model...</span>
            </div>
          ) : (
            /* Clean Development Placeholder as explicitly required in Phase 6 */
            <div className="relative z-10 max-w-md text-center flex flex-col items-center">
              <div
                className="w-20 h-20 rounded-3xl p-0.5 shadow-xl mb-5 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${room.color}, #FFB531)`
                }}
              >
                <div className="w-full h-full rounded-[22px] bg-white flex items-center justify-center">
                  <Box className="w-9 h-9" style={{ color: room.color }} />
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#FFB531]/20 text-[#EC6B1F] mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                {isArabic ? 'المرحلة القادمة' : 'Phase 2 Architecture Ready'}
              </span>

              <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">
                {t.roomPreviewPlaceholderTitle}
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                {t.roomPreviewPlaceholderSubtitle}
              </p>

              {/* Technical GLB Path Indicator */}
              <div className="w-full bg-gray-50 border border-gray-200/80 rounded-2xl p-3 text-start flex items-start gap-2.5">
                <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="text-[11px] text-gray-600">
                  <span className="font-semibold block text-gray-800">
                    {isArabic ? 'مسار نموذج الغرفة المستهدف:' : 'Configured Model Target:'}
                  </span>
                  <code className="text-xs font-mono text-[#EC6B1F]">
                    {room.model || `/models/rooms/${room.id}.glb`}
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Room Information & E-commerce Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-md flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-gray-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {t.features}
              </h4>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {isArabic ? room.nameAr : room.name}
            </h3>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
              {isArabic ? room.descriptionAr : room.description}
            </p>

            <a
              href="https://salla.sa"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer text-center"
            >
              <span>{t.viewInSalla}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quick Room Switcher for Mobile */}
          <div className="lg:hidden bg-white rounded-3xl p-4 border border-gray-200/80 shadow-sm">
            <span className="text-xs font-bold text-gray-500 block mb-2">
              {t.allRooms}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ROOMS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onSelectRoom(r.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    r.id === room.id
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isArabic ? r.nameAr : r.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
