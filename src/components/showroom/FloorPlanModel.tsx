import React, { useMemo, useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { ROOMS } from '../../data/rooms';

interface FloorPlanModelProps {
  selectedRoomId: string | null;
  hoveredRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  onHoverRoom: (roomId: string | null) => void;
}

export const FloorPlanModel: React.FC<FloorPlanModelProps> = ({
  selectedRoomId,
  hoveredRoomId,
  onSelectRoom,
  onHoverRoom
}) => {
  const { scene } = useGLTF('/models/Map.glb');
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  const roomMeshesRef = useRef<Map<string, THREE.Mesh[]>>(new Map());

  // Traverse the cloned scene, configure shadows and catalog room meshes
  useEffect(() => {
    const roomMap = new Map<string, THREE.Mesh[]>();
    ROOMS.forEach((r) => roomMap.set(r.id, []));

    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Ensure materials are cloned so highlighting does not mutate shared cache
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => m.clone());
        } else if (mesh.material) {
          mesh.material = mesh.material.clone();
        }

        const nameLower = (mesh.name || '').toLowerCase();
        const parentNameLower = (mesh.parent?.name || '').toLowerCase();

        // Check if mesh belongs to any room
        for (const room of ROOMS) {
          const isMatch = room.meshKeywords.some(
            (kw) => nameLower.includes(kw) || parentNameLower.includes(kw)
          );

          if (isMatch) {
            // Store original material for restoring
            mesh.userData.roomId = room.id;
            mesh.userData.originalMaterial = mesh.material;
            const list = roomMap.get(room.id) || [];
            list.push(mesh);
            roomMap.set(room.id, list);
            break;
          }
        }
      }
    });

    roomMeshesRef.current = roomMap;
  }, [clonedScene]);

  // Apply hover and selected highlights smoothly
  useEffect(() => {
    roomMeshesRef.current.forEach((meshes, roomId) => {
      const isSelected = selectedRoomId === roomId;
      const isHovered = hoveredRoomId === roomId;
      const room = ROOMS.find((r) => r.id === roomId);

      meshes.forEach((mesh) => {
        if (!mesh.userData.originalMaterial) return;

        if (isSelected || isHovered) {
          // Highlight with room brand color accent
          const colorHex = isSelected ? '#FFB531' : room?.color || '#FFB531';
          const emissiveColor = new THREE.Color(colorHex);
          
          if (!mesh.userData.highlightMaterial) {
            mesh.userData.highlightMaterial = new THREE.MeshStandardMaterial({
              color: new THREE.Color(colorHex),
              roughness: 0.3,
              metalness: 0.2,
              emissive: emissiveColor,
              emissiveIntensity: isSelected ? 0.35 : 0.2,
              transparent: true,
              opacity: 0.85
            });
          } else {
            mesh.userData.highlightMaterial.color.set(colorHex);
            mesh.userData.highlightMaterial.emissive.set(colorHex);
            mesh.userData.highlightMaterial.emissiveIntensity = isSelected ? 0.35 : 0.2;
          }

          mesh.material = mesh.userData.highlightMaterial;
        } else {
          // Restore original material
          mesh.material = mesh.userData.originalMaterial;
        }
      });
    });
  }, [selectedRoomId, hoveredRoomId]);

  return (
    <primitive
      object={clonedScene}
      onPointerOver={(e: any) => {
        e.stopPropagation();
        let target = e.object;
        while (target && !target.userData?.roomId && target !== clonedScene) {
          target = target.parent;
        }
        if (target?.userData?.roomId) {
          document.body.style.cursor = 'pointer';
          onHoverRoom(target.userData.roomId);
        }
      }}
      onPointerOut={(e: any) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
        onHoverRoom(null);
      }}
      onClick={(e: any) => {
        e.stopPropagation();
        let target = e.object;
        while (target && !target.userData?.roomId && target !== clonedScene) {
          target = target.parent;
        }
        if (target?.userData?.roomId) {
          onSelectRoom(target.userData.roomId);
        }
      }}
    />
  );
};

useGLTF.preload('/models/Map.glb');
