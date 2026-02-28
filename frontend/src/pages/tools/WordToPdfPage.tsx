import React, { useState } from 'react';
import { PdfToolTemplate } from '@/components/tools/PdfToolTemplate';
import { useWordToPdf } from '@/hooks/useWordToPdf';
import { getToolById } from '@/utils/toolsData';
import { Textarea } from '@/components/ui/textarea';
import { Download, RefreshCw, Loader2 } from 'lucide-react';

export function WordToPdfPage() {
  const tool = getToolById('word-to-pdf')!;
  const { convert, isProcessing, result, error, reset } = useWordToPdf();
  const [text, setText] = useState('');

  return (
    <PdfToolTemplate tool={tool}>
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Enter or paste your text content</label>
          <Textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type or paste your text here. Each line will be a new paragraph in the PDF..."
            className="min-h-48 bg-background border-border resize-y"
          />
          <p className="text-xs text-muted-foreground">{text.length} characters</p>
        </div>
        {result && <p className="text-sm text-primary">✓ PDF created successfully!</p>}
        {error && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</p>}
        <div className="flex gap-3 flex-wrap">
          {!result ? (
            <button onClick={() => convert(text)} disabled={isProcessing || !text.trim()} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50">
              {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Creating PDF...</> : '📄 Convert to PDF'}
            </button>
          ) : (
            <a href={result.url} download="converted-document.pdf" className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
              <Download size={16} /> Download PDF
            </a>
          )}
          <button onClick={() => { reset(); setText(''); }} className="px-6 py-2.5 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground transition-all flex items-center gap-2">
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      </div>
    </PdfToolTemplate>
  );
}
