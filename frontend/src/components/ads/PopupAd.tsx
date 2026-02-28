import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function PopupAd() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Google AdSense Banner Here */}
      <div className="relative bg-card border border-border rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <button
          onClick={() => { setVisible(false); setDismissed(true); }}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close popup"
        >
          <X size={20} />
        </button>
        <div className="ad-placeholder rounded-lg" style={{ width: '100%', height: 250 }}>
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <span className="text-sm opacity-60 font-mono">[ Advertisement ]</span>
            <span className="text-xs opacity-40 font-mono">300×250</span>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-3">
          Advertisement — <button onClick={() => { setVisible(false); setDismissed(true); }} className="underline hover:text-foreground">Close</button>
        </p>
      </div>
    </div>
  );
}
