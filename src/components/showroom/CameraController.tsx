import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { FLOOR_PLAN_CONFIG, ROOMS } from '../../data/rooms';

interface CameraControllerProps {
  selectedRoomId: string | null;
  autoRotate: boolean;
  onUserInteraction?: () => void;
  resetTrigger: number;
  zoomTrigger: { type: 'in' | 'out'; count: number };
}

export const CameraController: React.FC<CameraControllerProps> = ({
  selectedRoomId,
  autoRotate,
  onUserInteraction,
  resetTrigger,
  zoomTrigger
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Desired target and position vectors for smooth interpolation
  const desiredTargetRef = useRef<THREE.Vector3>(
    new THREE.Vector3(...FLOOR_PLAN_CONFIG.defaultCameraTarget)
  );
  const desiredPositionRef = useRef<THREE.Vector3>(
    new THREE.Vector3(...FLOOR_PLAN_CONFIG.defaultCameraPosition)
  );
  const isTransitioningRef = useRef<boolean>(false);

  // When selectedRoomId changes, calculate target room position and camera offset
  useEffect(() => {
    if (selectedRoomId) {
      const room = ROOMS.find((r) => r.id === selectedRoomId);
      if (room) {
        desiredTargetRef.current.set(...room.cameraTarget);
        desiredPositionRef.current.set(...room.cameraPosition);
        isTransitioningRef.current = true;
      }
    } else {
      desiredTargetRef.current.set(...FLOOR_PLAN_CONFIG.defaultCameraTarget);
      desiredPositionRef.current.set(...FLOOR_PLAN_CONFIG.defaultCameraPosition);
      isTransitioningRef.current = true;
    }
  }, [selectedRoomId]);

  // Handle Reset View trigger
  useEffect(() => {
    if (resetTrigger > 0) {
      desiredTargetRef.current.set(...FLOOR_PLAN_CONFIG.defaultCameraTarget);
      desiredPositionRef.current.set(...FLOOR_PLAN_CONFIG.defaultCameraPosition);
      isTransitioningRef.current = true;
    }
  }, [resetTrigger]);

  // Handle Zoom In / Out programmatic triggers
  useEffect(() => {
    if (zoomTrigger.count > 0 && controlsRef.current) {
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      const zoomFactor = zoomTrigger.type === 'in' ? 15 : -15;
      camera.position.addScaledVector(dir, zoomFactor);
      controlsRef.current.update();
    }
  }, [zoomTrigger, camera]);

  // Smooth lerp frame loop
  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isTransitioningRef.current) {
      // Lerp camera position
      camera.position.lerp(desiredPositionRef.current, Math.min(1, delta * 3.5));

      // Lerp orbit controls target
      controlsRef.current.target.lerp(desiredTargetRef.current, Math.min(1, delta * 3.5));
      controlsRef.current.update();

      // Check if close enough to stop transition
      const posDist = camera.position.distanceTo(desiredPositionRef.current);
      const targetDist = controlsRef.current.target.distanceTo(desiredTargetRef.current);

      if (posDist < 0.2 && targetDist < 0.1) {
        camera.position.copy(desiredPositionRef.current);
        controlsRef.current.target.copy(desiredTargetRef.current);
        controlsRef.current.update();
        isTransitioningRef.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      minDistance={FLOOR_PLAN_CONFIG.minDistance}
      maxDistance={FLOOR_PLAN_CONFIG.maxDistance}
      maxPolarAngle={FLOOR_PLAN_CONFIG.maxPolarAngle}
      minPolarAngle={FLOOR_PLAN_CONFIG.minPolarAngle}
      autoRotate={autoRotate && !isTransitioningRef.current}
      autoRotateSpeed={0.8}
      onStart={() => {
        isTransitioningRef.current = false;
        if (onUserInteraction) onUserInteraction();
      }}
    />
  );
};
