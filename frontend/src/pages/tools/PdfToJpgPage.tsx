import React, { useState } from 'react';
import { PdfToolTemplate } from '@/components/tools/PdfToolTemplate';
import { ToolUploadZone } from '@/components/tools/ToolUploadZone';
import { usePdfToJpg } from '@/hooks/usePdfToJpg';
import { getToolById } from '@/utils/toolsData';
import { Download, RefreshCw, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function PdfToJpgPage() {
  const tool = getToolById('pdf-to-jpg')!;
  const { convert, isProcessing, results, error, progress, reset } = usePdfToJpg();
  const [file, setFile] = useState<File | null>(null);

  const handleFile = (f: File) => { setFile(f); reset(); };

  return (
    <PdfToolTemplate tool={tool}>
      {!file ? (
        <ToolUploadZone onFileSelect={handleFile} accept="application/pdf" label="Drop your PDF here" sublabel="Each page will be converted to a JPG image" />
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-muted/30 rounded-lg flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <div>
              <p className="font-medium text-foreground text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Converting pages...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          {results.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-primary">✓ {results.length} page(s) converted!</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {results.map((r) => (
                  <div key={r.page} className="space-y-2">
                    <img src={r.url} alt={`Page ${r.page}`} className="w-full rounded-lg border border-border object-contain" />
                    <a href={r.url} download={`page-${r.page}.jpg`} className="btn-gradient w-full py-1.5 rounded-lg text-xs flex items-center justify-center gap-1">
                      <Download size={12} /> Page {r.page}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          {error && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</p>}
          <div className="flex gap-3 flex-wrap">
            {results.length === 0 && (
              <button onClick={() => convert(file)} disabled={isProcessing} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Converting...</> : '🖼️ Convert to JPG'}
              </button>
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
