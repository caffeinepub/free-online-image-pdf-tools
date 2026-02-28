import React, { useState } from 'react';
import { ImageToolTemplate } from '@/components/tools/ImageToolTemplate';
import { ToolUploadZone } from '@/components/tools/ToolUploadZone';
import { useImageConversion } from '@/hooks/useImageConversion';
import { getToolById } from '@/utils/toolsData';
import { Slider } from '@/components/ui/slider';
import { Download, RefreshCw, Loader2 } from 'lucide-react';

export function WebpToJpgPage() {
  const tool = getToolById('webp-to-jpg')!;
  const { convert, isProcessing, result, error, reset } = useImageConversion();
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(90);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (f: File) => { setFile(f); reset(); setPreview(URL.createObjectURL(f)); };

  return (
    <ImageToolTemplate tool={tool}>
      {!file ? (
        <ToolUploadZone onFileSelect={handleFile} accept="image/webp,image/*" label="Drop your WebP image here" sublabel="Supports WebP files" />
      ) : (
        <div className="space-y-6">
          {preview && <div className="flex justify-center"><img src={preview} alt="Preview" className="max-h-64 rounded-lg object-contain border border-border" /></div>}
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-sm font-medium">Quality: {quality}%</span></div>
            <Slider value={[quality]} onValueChange={([v]) => setQuality(v)} min={10} max={100} step={5} />
          </div>
          {result && <p className="text-sm text-primary text-center">✓ Converted to JPG ({(result.size / 1024).toFixed(1)} KB)</p>}
          {error && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</p>}
          <div className="flex gap-3 flex-wrap justify-center">
            {!result ? (
              <button onClick={() => convert(file, 'image/jpeg', quality / 100)} disabled={isProcessing} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Converting...</> : '↩️ Convert to JPG'}
              </button>
            ) : (
              <a href={result.url} download={file.name.replace(/\.webp$/i, '.jpg')} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                <Download size={16} /> Download JPG
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
