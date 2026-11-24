import React, { useState } from 'react';
import { useShowroom } from './hooks/useShowroom';
import { ShowroomCanvas } from './components/showroom/ShowroomCanvas';
import { ShowroomHeader } from './components/interface/ShowroomHeader';
import { RoomNavigation } from './components/interface/RoomNavigation';
import { ControlPanel } from './components/interface/ControlPanel';
import { RoomDetailCard } from './components/interface/RoomDetailCard';
import { RoomExplorationView } from './components/interface/RoomExplorationView';
import { Hand } from 'lucide-react';
import './styles/showroom.css';

export const App: React.FC = () => {
  const {
    language,
    setLanguage,
    selectedRoomId,
    selectedRoom,
    hoveredRoomId,
    setHoveredRoomId,
    viewMode,
    selectRoom,
    openRoom,
    backToFloorPlan,
    autoRotate,
    setAutoRotate,
    showLabels,
    setShowLabels,
    resetView,
    resetCameraCount,
    zoomIn,
    zoomOut,
    zoomTrigger,
    isEmbedded,
    t
  } = useShowroom();

  const [modelError, setModelError] = useState<string | null>(null);

  const isArabic = language === 'ar';

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="relative w-full h-[100dvh] max-h-screen overflow-hidden select-none bg-[#F8F8F8]"
    >
      {/* 3D Showroom Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <ShowroomCanvas
          selectedRoomId={selectedRoomId}
          hoveredRoomId={hoveredRoomId}
          language={language}
          autoRotate={autoRotate}
          showLabels={showLabels}
          resetCameraCount={resetCameraCount}
          zoomTrigger={zoomTrigger}
          onSelectRoom={selectRoom}
          onHoverRoom={setHoveredRoomId}
          onUserInteraction={() => {
            if (autoRotate) setAutoRotate(false);
          }}
          modelError={modelError}
          onRetry={() => setModelError(null)}
        />
      </div>

      {/* Showroom Header */}
      <ShowroomHeader
        language={language}
        onLanguageChange={setLanguage}
        selectedRoom={selectedRoom}
        onResetToFloorPlan={resetView}
        isEmbedded={isEmbedded}
      />

      {/* Floating Control Panel (Right in LTR, Left in RTL) */}
      <div
        className={`absolute top-20 sm:top-24 z-20 ${
          isArabic ? 'left-3 sm:left-5' : 'right-3 sm:right-5'
        }`}
      >
        <ControlPanel
          language={language}
          autoRotate={autoRotate}
          showLabels={showLabels}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetView={resetView}
          onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
          onToggleLabels={() => setShowLabels(!showLabels)}
        />
      </div>

      {/* Bottom Interface Container */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none p-3 sm:p-5 flex flex-col items-center gap-3">
        {/* Selected Room Detail Card (appears when a room is clicked in floor plan mode) */}
        {selectedRoom && viewMode === 'floorplan' && (
          <RoomDetailCard
            room={selectedRoom}
            language={language}
            onExplore={openRoom}
            onClose={() => selectRoom(null)}
          />
        )}

        {/* Room Navigation Pill Bar */}
        <div className="w-full flex justify-center">
          <RoomNavigation
            selectedRoomId={selectedRoomId}
            language={language}
            onSelectRoom={selectRoom}
            onResetView={resetView}
          />
        </div>

        {/* Helpful Touch/Mouse Gestures Hint */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-gray-500 glass-panel px-3 py-1 rounded-full border border-white/60 shadow-sm">
          <Hand className="w-3.5 h-3.5 text-gray-400" />
          <span>{t.dragToRotate}</span>
        </div>
      </div>

      {/* Room Exploration View Overlay (triggered by "Explore Room") */}
      {viewMode === 'room-detail' && selectedRoom && (
        <RoomExplorationView
          room={selectedRoom}
          language={language}
          onBack={backToFloorPlan}
          onSelectRoom={openRoom}
        />
      )}
    </div>
  );
};

export default App;
