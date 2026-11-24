import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  variant?: 'default' | 'primary' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  active = false,
  variant = 'glass',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5 text-xs',
    md: 'w-10 h-10 p-2 text-sm',
    lg: 'w-12 h-12 p-2.5 text-base'
  }[size];

  const variantClasses = {
    glass: active
      ? 'bg-[#FFB531] text-black shadow-md border border-[#EC6B1F]/30 ring-2 ring-[#FFB531]/40'
      : 'glass-panel text-gray-800 hover:text-black hover:bg-white/95 border border-white/60 active:scale-95',
    primary:
      'bg-[#FFB531] hover:bg-[#ffa710] text-black font-semibold shadow-md active:scale-95',
    default:
      'bg-gray-100 hover:bg-gray-200 text-gray-700 active:scale-95'
  }[variant];

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
};
