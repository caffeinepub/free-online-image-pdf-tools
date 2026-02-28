import React, { useState } from 'react';
import { PdfToolTemplate } from '@/components/tools/PdfToolTemplate';
import { ToolUploadZone } from '@/components/tools/ToolUploadZone';
import { usePdfWatermark } from '@/hooks/usePdfWatermark';
import { getToolById } from '@/utils/toolsData';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, RefreshCw, Loader2 } from 'lucide-react';

export function PdfWatermarkPage() {
  const tool = getToolById('pdf-watermark')!;
  const { addWatermark, isProcessing, result, error, reset } = usePdfWatermark();
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState(30);
  const [fontSize, setFontSize] = useState(48);
  const [position, setPosition] = useState<'center' | 'top' | 'bottom'>('center');

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
              <Label className="text-sm">Watermark Text</Label>
              <Input value={text} onChange={e => setText(e.target.value)} placeholder="CONFIDENTIAL" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Position</Label>
              <Select value={position} onValueChange={(v) => setPosition(v as 'center' | 'top' | 'bottom')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="center">Center (Diagonal)</SelectItem>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Opacity: {opacity}%</Label>
              <Slider value={[opacity]} onValueChange={([v]) => setOpacity(v)} min={10} max={80} step={5} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Font Size: {fontSize}px</Label>
              <Slider value={[fontSize]} onValueChange={([v]) => setFontSize(v)} min={12} max={96} step={4} />
            </div>
          </div>
          {result && <p className="text-sm text-primary">✓ Watermark added successfully!</p>}
          {error && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</p>}
          <div className="flex gap-3 flex-wrap">
            {!result ? (
              <button onClick={() => addWatermark(file, text, opacity / 100, fontSize, position)} disabled={isProcessing || !text} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50">
                {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Adding Watermark...</> : '💧 Add Watermark'}
              </button>
            ) : (
              <a href={result.url} download={`watermarked-${file.name}`} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                <Download size={16} /> Download Watermarked PDF
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
