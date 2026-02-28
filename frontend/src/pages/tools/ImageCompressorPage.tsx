import React, { useState } from 'react';
import { ImageToolTemplate } from '@/components/tools/ImageToolTemplate';
import { ToolUploadZone } from '@/components/tools/ToolUploadZone';
import { useImageCompression } from '@/hooks/useImageCompression';
import { getToolById } from '@/utils/toolsData';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Loader2 } from 'lucide-react';

export function ImageCompressorPage() {
  const tool = getToolById('image-compressor')!;
  const { compress, isProcessing, result, error, reset } = useImageCompression();
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(80);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (f: File) => {
    setFile(f);
    reset();
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const handleCompress = () => {
    if (file) compress(file, quality / 100);
  };

  const formatSize = (bytes: number) => bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <ImageToolTemplate tool={tool}>
      {!file ? (
        <ToolUploadZone onFileSelect={handleFile} accept="image/*" label="Drop your image here" sublabel="Supports JPG, PNG, WebP, GIF" />
      ) : (
        <div className="space-y-6">
          {preview && (
            <div className="flex justify-center">
              <img src={preview} alt="Preview" className="max-h-64 rounded-lg object-contain border border-border" />
            </div>
          )}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">Quality: {quality}%</label>
              <span className="text-xs text-muted-foreground">Higher = better quality, larger file</span>
            </div>
            <Slider value={[quality]} onValueChange={([v]) => setQuality(v)} min={10} max={100} step={5} className="w-full" />
          </div>
          {result && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Original Size</p>
                <p className="font-semibold text-foreground">{formatSize(result.originalSize)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Compressed Size</p>
                <p className="font-semibold text-primary">{formatSize(result.size)}</p>
              </div>
              <div className="col-span-2 text-center">
                <p className="text-xs text-muted-foreground">Saved: <span className="text-green-400 font-semibold">{Math.round((1 - result.size / result.originalSize) * 100)}%</span></p>
              </div>
            </div>
          )}
          {error && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</p>}
          <div className="flex gap-3 flex-wrap">
            {!result ? (
              <button onClick={handleCompress} disabled={isProcessing} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Compressing...</> : '🗜️ Compress Image'}
              </button>
            ) : (
              <a href={result.url} download={`compressed-${file.name}`} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                <Download size={16} /> Download Compressed
              </a>
            )}
            <button onClick={() => { reset(); setFile(null); setPreview(null); }} className="px-6 py-2.5 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all flex items-center gap-2">
              <RefreshCw size={14} /> Reset
            </button>
          </div>
        </div>
      )}
    </ImageToolTemplate>
  );
}
