import React, { useState } from 'react';
import { PdfToolTemplate } from '@/components/tools/PdfToolTemplate';
import { ToolUploadZone } from '@/components/tools/ToolUploadZone';
import { usePdfPageNumbers } from '@/hooks/usePdfPageNumbers';
import { getToolById } from '@/utils/toolsData';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, RefreshCw, Loader2 } from 'lucide-react';

export function PdfPageNumbersPage() {
  const tool = getToolById('pdf-page-numbers')!;
  const { addPageNumbers, isProcessing, result, error, reset } = usePdfPageNumbers();
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState<'bottom-center' | 'bottom-right' | 'top-center' | 'top-right'>('bottom-center');
  const [startNumber, setStartNumber] = useState(1);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Position</Label>
              <Select value={position} onValueChange={(v) => setPosition(v as typeof position)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bottom-center">Bottom Center</SelectItem>
                  <SelectItem value="bottom-right">Bottom Right</SelectItem>
                  <SelectItem value="top-center">Top Center</SelectItem>
                  <SelectItem value="top-right">Top Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Starting Number</Label>
              <Input type="number" value={startNumber} onChange={e => setStartNumber(Number(e.target.value))} min={1} />
            </div>
          </div>
          {result && <p className="text-sm text-primary">✓ Page numbers added successfully!</p>}
          {error && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</p>}
          <div className="flex gap-3 flex-wrap">
            {!result ? (
              <button onClick={() => addPageNumbers(file, position, startNumber)} disabled={isProcessing} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Adding Numbers...</> : '🔢 Add Page Numbers'}
              </button>
            ) : (
              <a href={result.url} download={`numbered-${file.name}`} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                <Download size={16} /> Download Numbered PDF
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
