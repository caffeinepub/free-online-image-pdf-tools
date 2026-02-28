import React from 'react';

interface AdBannerProps {
  width?: number;
  height?: number;
  label?: string;
  className?: string;
}

export function AdBanner({ width = 728, height = 90, label = 'Advertisement', className = '' }: AdBannerProps) {
  return (
    <div
      className={`ad-placeholder rounded-lg overflow-hidden ${className}`}
      style={{ width: '100%', maxWidth: width, height, minHeight: height }}
      aria-label="Advertisement"
    >
      {/* Google AdSense Banner Here */}
      <div className="flex flex-col items-center justify-center h-full gap-1">
        <span className="text-xs opacity-60 font-mono">[ {label} ]</span>
        <span className="text-xs opacity-40 font-mono">{width}×{height}</span>
      </div>
    </div>
  );
}
