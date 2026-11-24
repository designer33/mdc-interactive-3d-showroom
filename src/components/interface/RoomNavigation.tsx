import React from 'react';
import { ROOMS } from '../../data/rooms';
import type { Language } from '../../types/showroom';
import { LayoutGrid } from 'lucide-react';

interface RoomNavigationProps {
  selectedRoomId: string | null;
  language: Language;
  onSelectRoom: (roomId: string) => void;
  onResetView: () => void;
}

export const RoomNavigation: React.FC<RoomNavigationProps> = ({
  selectedRoomId,
  language,
  onSelectRoom,
  onResetView
}) => {
  const isArabic = language === 'ar';

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="pointer-events-auto max-w-full overflow-x-auto py-1 px-1 flex items-center gap-1.5 scrollbar-none"
    >
      <div className="glass-panel p-1.5 rounded-2xl flex items-center gap-1.5 border border-white/70 shadow-lg">
        {/* Reset / All Rooms Pill */}
        <button
          type="button"
          onClick={onResetView}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
            selectedRoomId === null
              ? 'bg-[#FFB531] text-black shadow-sm ring-1 ring-[#EC6B1F]/30'
              : 'text-gray-600 hover:text-black hover:bg-white/80'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>{isArabic ? 'المخطط الكامل' : 'Floor Plan'}</span>
        </button>

        <span className="w-[1px] h-4 bg-gray-200" />

        {/* Individual Room Buttons */}
        {ROOMS.map((room) => {
          const isSelected = selectedRoomId === room.id;
          const displayName = isArabic ? room.nameAr : room.name;

          return (
            <button
              key={room.id}
              type="button"
              onClick={() => onSelectRoom(room.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-black text-white shadow-md scale-102 ring-2 ring-black/20'
                  : 'text-gray-700 hover:text-black hover:bg-white/90'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform"
                style={{ backgroundColor: room.color }}
              />
              <span>{displayName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
