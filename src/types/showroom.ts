export type Language = 'en' | 'ar';

export interface RoomData {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  color: string;
  center: [number, number, number];
  labelPos: [number, number, number];
  size: [number, number, number];
  cameraTarget: [number, number, number];
  cameraPosition: [number, number, number];
  model: string | null;
  products: ProductItem[];
  meshKeywords: string[];
}

export interface ProductItem {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  currency: string;
  image?: string;
  sallaUrl?: string;
}

export type ViewMode = 'floorplan' | 'room-detail';

export interface ShowroomState {
  language: Language;
  selectedRoomId: string | null;
  hoveredRoomId: string | null;
  viewMode: ViewMode;
  autoRotate: boolean;
  isEmbedded: boolean;
  showLabels: boolean;
  modelLoadingProgress: number;
  isModelLoaded: boolean;
  loadError: string | null;
}

export type MDCMessagePayload = 
  | { type: 'MDC_ROOM_SELECTED'; roomId: string }
  | { type: 'MDC_ROOM_OPENED'; roomId: string }
  | { type: 'MDC_BACK_TO_FLOOR_PLAN' }
  | { type: 'MDC_LANGUAGE_CHANGED'; language: Language }
  | { type: 'MDC_SHOWROOM_READY' };

export type MDCIncomingAction =
  | { type: 'OPEN_ROOM'; roomId: string }
  | { type: 'BACK_TO_FLOOR_PLAN' }
  | { type: 'CHANGE_LANGUAGE'; language: Language }
  | { type: 'RESET_VIEW' };
