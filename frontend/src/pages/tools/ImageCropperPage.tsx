import React, { useState, useRef, useCallback } from 'react';
import { ImageToolTemplate } from '@/components/tools/ImageToolTemplate';
import { ToolUploadZone } from '@/components/tools/ToolUploadZone';
import { useImageCrop, CropArea } from '@/hooks/useImageCrop';
import { getToolById } from '@/utils/toolsData';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, RefreshCw, Loader2 } from 'lucide-react';

export function ImageCropperPage() {
  const tool = getToolById('image-cropper')!;
  const { crop, isProcessing, result, error, reset } = useImageCrop();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imgDims, setImgDims] = useState<{ w: number; h: number } | null>(null);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });

  const handleFile = (f: File) => {
    setFile(f);
    reset();
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setImgDims({ w: img.width, h: img.height });
      setCropArea({ x: 0, y: 0, width: img.width, height: img.height });
      URL.revokeObjectURL(url);
    };
    img.src = url;
    setPreview(URL.createObjectURL(f));
  };

  return (
    <ImageToolTemplate tool={tool}>
      {!file ? (
        <ToolUploadZone onFileSelect={handleFile} accept="image/*" label="Drop your image here" sublabel="Supports JPG, PNG, WebP" />
      ) : (
        <div className="space-y-6">
          {preview && <div className="flex justify-center"><img src={preview} alt="Preview" className="max-h-48 rounded-lg object-contain border border-border" /></div>}
          {imgDims && <p className="text-xs text-muted-foreground text-center">Image: {imgDims.w} × {imgDims.h} px</p>}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1"><Label className="text-xs">X (px)</Label><Input type="number" value={cropArea.x} onChange={e => setCropArea(a => ({ ...a, x: Number(e.target.value) }))} /></div>
            <div className="space-y-1"><Label className="text-xs">Y (px)</Label><Input type="number" value={cropArea.y} onChange={e => setCropArea(a => ({ ...a, y: Number(e.target.value) }))} /></div>
            <div className="space-y-1"><Label className="text-xs">Width (px)</Label><Input type="number" value={cropArea.width} onChange={e => setCropArea(a => ({ ...a, width: Number(e.target.value) }))} /></div>
            <div className="space-y-1"><Label className="text-xs">Height (px)</Label><Input type="number" value={cropArea.height} onChange={e => setCropArea(a => ({ ...a, height: Number(e.target.value) }))} /></div>
          </div>
          {result && <p className="text-sm text-primary">✓ Cropped to {result.width} × {result.height} px</p>}
          {error && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</p>}
          <div className="flex gap-3 flex-wrap">
            {!result ? (
              <button onClick={() => crop(file, cropArea)} disabled={isProcessing} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Cropping...</> : '✂️ Crop Image'}
              </button>
            ) : (
              <a href={result.url} download={`cropped-${file.name}`} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                <Download size={16} /> Download Cropped
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
