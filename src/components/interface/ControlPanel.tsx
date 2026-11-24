import React from 'react';
import { IconButton } from '../common/IconButton';
import { ZoomIn, ZoomOut, RotateCcw, Play, Pause, Tag } from 'lucide-react';
import type { Language } from '../../types/showroom';
import { UI_TRANSLATIONS } from '../../data/rooms';

interface ControlPanelProps {
  language: Language;
  autoRotate: boolean;
  showLabels: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onToggleAutoRotate: () => void;
  onToggleLabels: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  language,
  autoRotate,
  showLabels,
  onZoomIn,
  onZoomOut,
  onResetView,
  onToggleAutoRotate,
  onToggleLabels
}) => {
  const t = UI_TRANSLATIONS[language];

  return (
    <div className="pointer-events-auto flex flex-col gap-1.5 p-1 glass-panel rounded-2xl border border-white/70 shadow-lg">
      <IconButton
        icon={<ZoomIn className="w-4 h-4" />}
        label={t.zoomIn}
        onClick={onZoomIn}
      />
      <IconButton
        icon={<ZoomOut className="w-4 h-4" />}
        label={t.zoomOut}
        onClick={onZoomOut}
      />
      <IconButton
        icon={<RotateCcw className="w-4 h-4" />}
        label={t.resetView}
        onClick={onResetView}
      />
      <IconButton
        icon={autoRotate ? <Pause className="w-4 h-4 text-[#EC6B1F]" /> : <Play className="w-4 h-4" />}
        label={autoRotate ? t.stopRotate : t.rotate}
        active={autoRotate}
        onClick={onToggleAutoRotate}
      />
      <IconButton
        icon={<Tag className="w-4 h-4" />}
        label={t.toggleLabels}
        active={showLabels}
        onClick={onToggleLabels}
      />
    </div>
  );
};
