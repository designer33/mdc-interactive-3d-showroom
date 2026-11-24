import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { FloorPlanModel } from './FloorPlanModel';
import { RoomHotspots } from './RoomHotspots';
import { CameraController } from './CameraController';
import { LoadingScreen } from './LoadingScreen';
import { FLOOR_PLAN_CONFIG } from '../../data/rooms';
import type { Language } from '../../types/showroom';

interface ShowroomCanvasProps {
  selectedRoomId: string | null;
  hoveredRoomId: string | null;
  language: Language;
  autoRotate: boolean;
  showLabels: boolean;
  resetCameraCount: number;
  zoomTrigger: { type: 'in' | 'out'; count: number };
  onSelectRoom: (roomId: string) => void;
  onHoverRoom: (roomId: string | null) => void;
  onUserInteraction: () => void;
  modelError?: string | null;
  onRetry?: () => void;
}

export const ShowroomCanvas: React.FC<ShowroomCanvasProps> = ({
  selectedRoomId,
  hoveredRoomId,
  language,
  autoRotate,
  showLabels,
  resetCameraCount,
  zoomTrigger,
  onSelectRoom,
  onHoverRoom,
  onUserInteraction,
  modelError,
  onRetry
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#F8F8F8]">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        }}
        camera={{
          position: FLOOR_PLAN_CONFIG.defaultCameraPosition,
          fov: 42,
          near: 0.5,
          far: 800
        }}
        className="w-full h-full touch-none select-none"
      >
        {/* Architectural Lighting Setup */}
        <color attach="background" args={['#F8F8F8']} />
        <ambientLight intensity={0.9} color="#ffffff" />
        <directionalLight
          position={[120, 150, 80]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={10}
          shadow-camera-far={400}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
          shadow-bias={-0.0002}
        />
        <hemisphereLight
          args={['#ffffff', '#e8eef2', 0.6]}
          position={[0, 50, 0]}
        />
        <directionalLight
          position={[-60, 80, -60]}
          intensity={0.5}
          color="#fffaed"
        />

        {/* 3D Scene Components inside Suspense */}
        <Suspense fallback={null}>
          <FloorPlanModel
            selectedRoomId={selectedRoomId}
            hoveredRoomId={hoveredRoomId}
            onSelectRoom={onSelectRoom}
            onHoverRoom={onHoverRoom}
          />
          <RoomHotspots
            selectedRoomId={selectedRoomId}
            hoveredRoomId={hoveredRoomId}
            language={language}
            showLabels={showLabels}
            onSelectRoom={onSelectRoom}
            onHoverRoom={onHoverRoom}
          />
        </Suspense>

        {/* Camera and Navigation Controller */}
        <CameraController
          selectedRoomId={selectedRoomId}
          autoRotate={autoRotate}
          onUserInteraction={onUserInteraction}
          resetTrigger={resetCameraCount}
          zoomTrigger={zoomTrigger}
        />
      </Canvas>

      {/* Model Loading Screen Overlay */}
      <LoadingScreen
        error={modelError}
        onRetry={onRetry}
        isArabic={language === 'ar'}
      />
    </div>
  );
};
