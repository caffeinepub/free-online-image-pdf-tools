import React, { useState } from 'react';
import { PdfToolTemplate } from '@/components/tools/PdfToolTemplate';
import { ToolUploadZone } from '@/components/tools/ToolUploadZone';
import { usePdfSplit } from '@/hooks/usePdfSplit';
import { getToolById } from '@/utils/toolsData';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, RefreshCw, Loader2 } from 'lucide-react';

export function PdfSplitPage() {
  const tool = getToolById('pdf-split')!;
  const { split, isProcessing, results, error, reset } = usePdfSplit();
  const [file, setFile] = useState<File | null>(null);
  const [ranges, setRanges] = useState('1-3, 4-6');

  const handleFile = (f: File) => { setFile(f); reset(); };

  return (
    <PdfToolTemplate tool={tool}>
      {!file ? (
        <ToolUploadZone onFileSelect={handleFile} accept="application/pdf" label="Drop your PDF here" sublabel="Supports PDF files" />
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-muted/30 rounded-lg flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <div>
              <p className="font-medium text-foreground text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Page Ranges (e.g., 1-3, 5, 7-10)</Label>
            <Input value={ranges} onChange={e => setRanges(e.target.value)} placeholder="1-3, 5, 7-10" />
            <p className="text-xs text-muted-foreground">Separate ranges with commas. Each range becomes a separate PDF.</p>
          </div>
          {results.length > 0 && (
            <div className="space-y-2">
              {results.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm text-foreground">{r.name}</span>
                  <a href={r.url} download={r.name} className="btn-gradient px-4 py-1.5 rounded-lg text-xs flex items-center gap-1">
                    <Download size={12} /> Download
                  </a>
                </div>
              ))}
            </div>
          )}
          {error && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</p>}
          <div className="flex gap-3 flex-wrap">
            {results.length === 0 && (
              <button onClick={() => split(file, ranges)} disabled={isProcessing} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Splitting...</> : '✂️ Split PDF'}
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
