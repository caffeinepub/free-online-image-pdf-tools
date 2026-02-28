import React, { useState } from 'react';
import { ImageToolTemplate } from '@/components/tools/ImageToolTemplate';
import { ToolUploadZone } from '@/components/tools/ToolUploadZone';
import { useImageRotation } from '@/hooks/useImageRotation';
import { getToolById } from '@/utils/toolsData';
import { Download, RefreshCw, Loader2, RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react';

export function ImageRotatorPage() {
  const tool = getToolById('image-rotator')!;
  const { rotate, isProcessing, result, error, reset } = useImageRotation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (f: File) => { setFile(f); reset(); setPreview(URL.createObjectURL(f)); };

  const doRotate = (deg: number, flipH = false, flipV = false) => {
    if (file) rotate(file, deg, flipH, flipV);
  };

  return (
    <ImageToolTemplate tool={tool}>
      {!file ? (
        <ToolUploadZone onFileSelect={handleFile} accept="image/*" label="Drop your image here" sublabel="Supports JPG, PNG, WebP" />
      ) : (
        <div className="space-y-6">
          {(result?.url || preview) && (
            <div className="flex justify-center">
              <img src={result?.url || preview!} alt="Preview" className="max-h-64 rounded-lg object-contain border border-border" />
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: '90° CW', icon: <RotateCw size={16} />, action: () => doRotate(90) },
              { label: '180°', icon: <RotateCw size={16} />, action: () => doRotate(180) },
              { label: '270° CW', icon: <RotateCw size={16} />, action: () => doRotate(270) },
              { label: 'Flip H', icon: <FlipHorizontal size={16} />, action: () => doRotate(0, true, false) },
              { label: 'Flip V', icon: <FlipVertical size={16} />, action: () => doRotate(0, false, true) },
            ].map(btn => (
              <button key={btn.label} onClick={btn.action} disabled={isProcessing} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all disabled:opacity-50">
                {isProcessing ? <Loader2 size={14} className="animate-spin" /> : btn.icon}
                {btn.label}
              </button>
            ))}
          </div>
          {error && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</p>}
          <div className="flex gap-3 flex-wrap">
            {result && (
              <a href={result.url} download={`rotated-${file.name}`} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                <Download size={16} /> Download
              </a>
            )}
            <button onClick={() => { reset(); setFile(null); setPreview(null); }} className="px-6 py-2.5 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground transition-all flex items-center gap-2">
              <RefreshCw size={14} /> Reset
            </button>
          </div>
        </div>
      )}
    </ImageToolTemplate>
  );
}
