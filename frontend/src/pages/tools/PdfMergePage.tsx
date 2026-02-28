import React, { useState } from 'react';
import { PdfToolTemplate } from '@/components/tools/PdfToolTemplate';
import { MultiFileUploadZone } from '@/components/tools/MultiFileUploadZone';
import { usePdfMerge } from '@/hooks/usePdfMerge';
import { getToolById } from '@/utils/toolsData';
import { Download, RefreshCw, Loader2 } from 'lucide-react';

export function PdfMergePage() {
  const tool = getToolById('pdf-merge')!;
  const { merge, isProcessing, result, error, reset } = usePdfMerge();
  const [files, setFiles] = useState<File[]>([]);

  return (
    <PdfToolTemplate tool={tool}>
      <div className="space-y-6">
        <MultiFileUploadZone onFilesChange={setFiles} accept="application/pdf" label="Drop PDF files here" maxFiles={10} />
        {files.length > 1 && <p className="text-sm text-muted-foreground text-center">{files.length} files ready to merge</p>}
        {result && <p className="text-sm text-primary">✓ PDFs merged! ({(result.size / 1024).toFixed(1)} KB)</p>}
        {error && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</p>}
        <div className="flex gap-3 flex-wrap">
          {!result ? (
            <button onClick={() => merge(files)} disabled={isProcessing || files.length < 2} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50">
              {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Merging...</> : '🔗 Merge PDFs'}
            </button>
          ) : (
            <a href={result.url} download="merged.pdf" className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
              <Download size={16} /> Download Merged PDF
            </a>
          )}
          <button onClick={() => { reset(); setFiles([]); }} className="px-6 py-2.5 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground transition-all flex items-center gap-2">
            <RefreshCw size={14} /> Reset
          </button>
        </div>
        {files.length < 2 && files.length > 0 && <p className="text-xs text-muted-foreground">Please add at least 2 PDF files to merge.</p>}
      </div>
    </PdfToolTemplate>
  );
}
