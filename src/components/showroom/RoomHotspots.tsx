import React from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { ROOMS } from '../../data/rooms';
import type { Language } from '../../types/showroom';
import { Sparkles } from 'lucide-react';

interface RoomHotspotsProps {
  selectedRoomId: string | null;
  hoveredRoomId: string | null;
  language: Language;
  showLabels: boolean;
  onSelectRoom: (roomId: string) => void;
  onHoverRoom: (roomId: string | null) => void;
}

export const RoomHotspots: React.FC<RoomHotspotsProps> = ({
  selectedRoomId,
  hoveredRoomId,
  language,
  showLabels,
  onSelectRoom,
  onHoverRoom
}) => {
  return (
    <group name="room-hotspots-layer">
      {ROOMS.map((room) => {
        const isSelected = selectedRoomId === room.id;
        const isHovered = hoveredRoomId === room.id;
        const displayName = language === 'ar' ? room.nameAr : room.name;

        // Ground plane dimensions
        const [dx, , dz] = room.size;
        const [cx, , cz] = room.center;

        return (
          <group key={room.id} position={[cx, 0.08, cz]}>
            {/* Interactive Ground Zone Plane */}
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
                onHoverRoom(room.id);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'auto';
                onHoverRoom(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectRoom(room.id);
              }}
            >
              <planeGeometry args={[dx, dz]} />
              <meshBasicMaterial
                color={isSelected ? '#FFB531' : isHovered ? room.color : '#000000'}
                transparent
                opacity={isSelected ? 0.35 : isHovered ? 0.22 : 0.001}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Glowing Border Outline when Hovered or Selected */}
            {(isSelected || isHovered) && (
              <lineSegments rotation={[-Math.PI / 2, 0, 0]}>
                <edgesGeometry args={[new THREE.PlaneGeometry(dx, dz)]} />
                <lineBasicMaterial
                  color={isSelected ? '#EC6B1F' : room.color}
                  linewidth={2}
                  transparent
                  opacity={isSelected ? 0.95 : 0.75}
                />
              </lineSegments>
            )}

            {/* Central Floating Room Pin / Badge */}
            {showLabels && (
              <group position={[0, 4.2, 0]}>
                <Html
                  center
                  distanceFactor={90}
                  zIndexRange={[100, 0]}
                  style={{
                    pointerEvents: 'auto',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRoom(room.id);
                    }}
                    onMouseEnter={() => onHoverRoom(room.id)}
                    onMouseLeave={() => onHoverRoom(null)}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                    className={`group cursor-pointer select-none whitespace-nowrap rounded-full px-3.5 py-1.5 flex items-center gap-2 shadow-lg backdrop-blur-md transition-all duration-300 ${
                      isSelected
                        ? 'bg-[#FFB531] text-black font-bold scale-110 ring-4 ring-[#EC6B1F]/30 border border-[#EC6B1F]'
                        : isHovered
                        ? 'bg-white/95 text-black font-semibold scale-105 border-2 shadow-xl ring-2'
                        : 'bg-white/85 hover:bg-white text-gray-800 font-medium border border-white/60 hover:scale-105'
                    }`}
                    style={{
                      borderColor: isSelected ? '#EC6B1F' : isHovered ? room.color : 'rgba(255,255,255,0.7)',
                      boxShadow: isSelected
                        ? '0 10px 25px -3px rgba(236, 107, 31, 0.4)'
                        : isHovered
                        ? `0 8px 20px -2px ${room.color}40`
                        : '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {/* Glowing Accent Indicator */}
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform duration-300 group-hover:scale-125"
                      style={{ backgroundColor: room.color }}
                    />

                    {/* Room Name */}
                    <span className="text-xs tracking-wide">
                      {displayName}
                    </span>

                    {/* Subtle Explore Icon */}
                    {isSelected && (
                      <Sparkles className="w-3 h-3 text-[#EC6B1F] animate-spin" style={{ animationDuration: '4s' }} />
                    )}
                  </button>
                </Html>
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
};
