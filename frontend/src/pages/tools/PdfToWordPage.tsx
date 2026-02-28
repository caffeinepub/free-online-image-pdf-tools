import React, { useState } from 'react';
import { PdfToolTemplate } from '@/components/tools/PdfToolTemplate';
import { ToolUploadZone } from '@/components/tools/ToolUploadZone';
import { usePdfToWord } from '@/hooks/usePdfToWord';
import { getToolById } from '@/utils/toolsData';
import { Download, RefreshCw, Loader2 } from 'lucide-react';

export function PdfToWordPage() {
  const tool = getToolById('pdf-to-word')!;
  const { convert, isProcessing, result, error, reset } = usePdfToWord();
  const [file, setFile] = useState<File | null>(null);

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
          {result && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Extracted Text Preview:</p>
              <pre className="text-xs text-foreground whitespace-pre-wrap max-h-48 overflow-y-auto scrollbar-thin">{result.text.slice(0, 500)}{result.text.length > 500 ? '...' : ''}</pre>
            </div>
          )}
          {error && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</p>}
          <div className="flex gap-3 flex-wrap">
            {!result ? (
              <button onClick={() => convert(file)} disabled={isProcessing} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Extracting...</> : '📝 Extract Text'}
              </button>
            ) : (
              <a href={result.url} download={file.name.replace('.pdf', '.txt')} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                <Download size={16} /> Download Text File
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
