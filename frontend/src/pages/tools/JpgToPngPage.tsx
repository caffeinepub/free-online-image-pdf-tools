import React, { useState } from 'react';
import { ImageToolTemplate } from '@/components/tools/ImageToolTemplate';
import { ToolUploadZone } from '@/components/tools/ToolUploadZone';
import { useImageConversion } from '@/hooks/useImageConversion';
import { getToolById } from '@/utils/toolsData';
import { Download, RefreshCw, Loader2 } from 'lucide-react';

export function JpgToPngPage() {
  const tool = getToolById('jpg-to-png')!;
  const { convert, isProcessing, result, error, reset } = useImageConversion();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (f: File) => { setFile(f); reset(); setPreview(URL.createObjectURL(f)); };

  return (
    <ImageToolTemplate tool={tool}>
      {!file ? (
        <ToolUploadZone onFileSelect={handleFile} accept="image/jpeg,image/jpg" label="Drop your JPG image here" sublabel="Supports JPG, JPEG files" />
      ) : (
        <div className="space-y-6">
          {preview && <div className="flex justify-center"><img src={preview} alt="Preview" className="max-h-64 rounded-lg object-contain border border-border" /></div>}
          <p className="text-sm text-muted-foreground text-center">File: <span className="text-foreground">{file.name}</span> ({(file.size / 1024).toFixed(1)} KB)</p>
          {result && <p className="text-sm text-primary text-center">✓ Converted to PNG ({(result.size / 1024).toFixed(1)} KB)</p>}
          {error && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</p>}
          <div className="flex gap-3 flex-wrap justify-center">
            {!result ? (
              <button onClick={() => convert(file, 'image/png')} disabled={isProcessing} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Converting...</> : '🔄 Convert to PNG'}
              </button>
            ) : (
              <a href={result.url} download={file.name.replace(/\.(jpg|jpeg)$/i, '.png')} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                <Download size={16} /> Download PNG
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
