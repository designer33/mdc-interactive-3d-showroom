import { useState, useEffect, useCallback } from 'react';
import type { Language, ViewMode, MDCMessagePayload, MDCIncomingAction } from '../types/showroom';
import { ROOMS, UI_TRANSLATIONS } from '../data/rooms';

// Allowed origins for iframe postMessage communication
const ALLOWED_ORIGINS = [
  'https://salla.sa',
  'https://mdc.sa',
  'https://showroom.mdc.sa',
  'http://localhost:5173',
  'http://localhost:3000'
];

export function useShowroom() {
  // Check URL query parameters for embed mode and initial language
  const [isEmbedded, setIsEmbedded] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('embed') === '1' || window.self !== window.top;
  });

  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'ar';
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('lang');
    if (langParam === 'en' || langParam === 'ar') return langParam;
    return 'ar'; // Default to Arabic for Saudi Arabia e-commerce audience
  });

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('floorplan');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [resetCameraCount, setResetCameraCount] = useState<number>(0);
  const [zoomTrigger, setZoomTrigger] = useState<{ type: 'in' | 'out'; count: number }>({ type: 'in', count: 0 });

  // Update HTML document direction and lang attribute
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Send message to parent window if embedded
  const sendMessageToParent = useCallback((payload: MDCMessagePayload) => {
    if (typeof window === 'undefined') return;
    try {
      if (window.parent && window.parent !== window) {
        // Send to parent window; in production can filter by document.referrer or wildcard if origin is dynamic
        const targetOrigin = document.referrer ? new URL(document.referrer).origin : '*';
        window.parent.postMessage(payload, targetOrigin);
      }
    } catch {
      // Fallback
      window.postMessage(payload, '*');
    }
  }, []);

  // Post showroom ready event on mount
  useEffect(() => {
    sendMessageToParent({ type: 'MDC_SHOWROOM_READY' });
  }, [sendMessageToParent]);

  // Set language with postMessage notification
  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    sendMessageToParent({ type: 'MDC_LANGUAGE_CHANGED', language: newLang });
  }, [sendMessageToParent]);

  // Select room
  const selectRoom = useCallback((roomId: string | null) => {
    setSelectedRoomId(roomId);
    if (roomId) {
      sendMessageToParent({ type: 'MDC_ROOM_SELECTED', roomId });
      // If auto-rotate was active, pause it on user interaction
      setAutoRotate(false);
    }
  }, [sendMessageToParent]);

  // Open room exploration
  const openRoom = useCallback((roomId: string) => {
    setSelectedRoomId(roomId);
    setViewMode('room-detail');
    setAutoRotate(false);
    sendMessageToParent({ type: 'MDC_ROOM_OPENED', roomId });
  }, [sendMessageToParent]);

  // Back to floor plan view
  const backToFloorPlan = useCallback(() => {
    setViewMode('floorplan');
    sendMessageToParent({ type: 'MDC_BACK_TO_FLOOR_PLAN' });
  }, [sendMessageToParent]);

  // Reset camera view
  const resetView = useCallback(() => {
    setSelectedRoomId(null);
    setViewMode('floorplan');
    setResetCameraCount((c) => c + 1);
  }, []);

  // Zoom in / Zoom out triggers
  const zoomIn = useCallback(() => {
    setZoomTrigger((z) => ({ type: 'in', count: z.count + 1 }));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomTrigger((z) => ({ type: 'out', count: z.count + 1 }));
  }, []);

  // Handle incoming postMessage events from parent
  useEffect(() => {
    const handleIncomingMessage = (event: MessageEvent) => {
      // Validate origin if not localhost or matching allowed list
      const originAllowed = 
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        ALLOWED_ORIGINS.some((allowed) => event.origin.startsWith(allowed));

      if (!originAllowed && event.origin !== window.location.origin) {
        // Silently ignore messages from untrusted origins
        return;
      }

      const data = event.data as MDCIncomingAction;
      if (!data || typeof data !== 'object') return;

      switch (data.type) {
        case 'OPEN_ROOM':
          if (data.roomId && ROOMS.some((r) => r.id === data.roomId)) {
            openRoom(data.roomId);
          }
          break;
        case 'BACK_TO_FLOOR_PLAN':
          backToFloorPlan();
          break;
        case 'CHANGE_LANGUAGE':
          if (data.language === 'en' || data.language === 'ar') {
            setLanguage(data.language);
          }
          break;
        case 'RESET_VIEW':
          resetView();
          break;
      }
    };

    window.addEventListener('message', handleIncomingMessage);
    return () => window.removeEventListener('message', handleIncomingMessage);
  }, [openRoom, backToFloorPlan, setLanguage, resetView]);

  const selectedRoom = ROOMS.find((r) => r.id === selectedRoomId) || null;
  const t = UI_TRANSLATIONS[language];

  return {
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
    setIsEmbedded,
    t
  };
}
