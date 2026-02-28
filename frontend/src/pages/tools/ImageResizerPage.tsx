import React, { useState } from 'react';
import { ImageToolTemplate } from '@/components/tools/ImageToolTemplate';
import { ToolUploadZone } from '@/components/tools/ToolUploadZone';
import { useImageResize } from '@/hooks/useImageResize';
import { getToolById } from '@/utils/toolsData';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Download, RefreshCw, Loader2 } from 'lucide-react';

export function ImageResizerPage() {
  const tool = getToolById('image-resizer')!;
  const { resize, isProcessing, result, error, reset } = useImageResize();
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [lockAspect, setLockAspect] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [origDims, setOrigDims] = useState<{ w: number; h: number } | null>(null);

  const handleFile = (f: File) => {
    setFile(f);
    reset();
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => { setOrigDims({ w: img.width, h: img.height }); setWidth(String(img.width)); setHeight(String(img.height)); URL.revokeObjectURL(url); };
    img.src = url;
    setPreview(URL.createObjectURL(f));
  };

  const handleResize = () => {
    if (file) resize(file, Number(width) || 0, Number(height) || 0, lockAspect);
  };

  return (
    <ImageToolTemplate tool={tool}>
      {!file ? (
        <ToolUploadZone onFileSelect={handleFile} accept="image/*" label="Drop your image here" sublabel="Supports JPG, PNG, WebP, GIF" />
      ) : (
        <div className="space-y-6">
          {preview && <div className="flex justify-center"><img src={preview} alt="Preview" className="max-h-48 rounded-lg object-contain border border-border" /></div>}
          {origDims && <p className="text-xs text-muted-foreground text-center">Original: {origDims.w} × {origDims.h} px</p>}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Width (px)</Label>
              <Input type="number" value={width} onChange={e => setWidth(e.target.value)} placeholder="Width" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Height (px)</Label>
              <Input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="Height" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={lockAspect} onCheckedChange={setLockAspect} />
            <Label className="text-sm text-muted-foreground">Lock aspect ratio</Label>
          </div>
          {result && <p className="text-sm text-primary">✓ Resized to {result.width} × {result.height} px</p>}
          {error && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</p>}
          <div className="flex gap-3 flex-wrap">
            {!result ? (
              <button onClick={handleResize} disabled={isProcessing} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Resizing...</> : '📐 Resize Image'}
              </button>
            ) : (
              <a href={result.url} download={`resized-${file.name}`} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                <Download size={16} /> Download Resized
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
