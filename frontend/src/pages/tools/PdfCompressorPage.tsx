import React, { useState } from 'react';
import { PdfToolTemplate } from '@/components/tools/PdfToolTemplate';
import { ToolUploadZone } from '@/components/tools/ToolUploadZone';
import { usePdfCompression } from '@/hooks/usePdfCompression';
import { getToolById } from '@/utils/toolsData';
import { Download, RefreshCw, Loader2 } from 'lucide-react';

export function PdfCompressorPage() {
  const tool = getToolById('pdf-compressor')!;
  const { compress, isProcessing, result, error, reset } = usePdfCompression();
  const [file, setFile] = useState<File | null>(null);

  const handleFile = (f: File) => { setFile(f); reset(); };

  const formatSize = (bytes: number) => bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <PdfToolTemplate tool={tool}>
      {!file ? (
        <ToolUploadZone onFileSelect={handleFile} accept="application/pdf" label="Drop your PDF here" sublabel="Supports PDF files up to 50MB" />
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-muted/30 rounded-lg flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <div>
              <p className="font-medium text-foreground text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
            </div>
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
            </div>
          )}
          {error && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</p>}
          <div className="flex gap-3 flex-wrap">
            {!result ? (
              <button onClick={() => compress(file)} disabled={isProcessing} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Compressing...</> : '🗜️ Compress PDF'}
              </button>
            ) : (
              <a href={result.url} download={`compressed-${file.name}`} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                <Download size={16} /> Download Compressed PDF
              </a>
            )}
            <button onClick={() => { reset(); setFile(null); }} className="px-6 py-2.5 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground transition-all flex items-center gap-2">
              <RefreshCw size={14} /> Reset
            </button>
          </div>
        </div>
      )}
    </PdfToolTemplate>
  );
}
