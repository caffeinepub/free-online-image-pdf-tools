import React, { useState } from 'react';
import { X } from 'lucide-react';

export function StickyBottomAd() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center items-center bg-card border-t border-border py-2 px-4 shadow-lg">
      {/* Google AdSense Banner Here */}
      <div className="ad-placeholder rounded" style={{ width: '100%', maxWidth: 728, height: 60 }}>
        <div className="flex items-center justify-center h-full gap-2">
          <span className="text-xs opacity-60 font-mono">[ Advertisement — 728×60 ]</span>
        </div>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Close ad"
      >
        <X size={16} />
      </button>
    </div>
  );
}
