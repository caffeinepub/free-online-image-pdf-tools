import React, { useState } from 'react';
import { PdfToolTemplate } from '@/components/tools/PdfToolTemplate';
import { ToolUploadZone } from '@/components/tools/ToolUploadZone';
import { usePdfLock } from '@/hooks/usePdfLock';
import { getToolById } from '@/utils/toolsData';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, RefreshCw, Loader2, Eye, EyeOff } from 'lucide-react';

export function PdfLockPage() {
  const tool = getToolById('pdf-lock')!;
  const { lock, isProcessing, result, error, reset } = usePdfLock();
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

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
            <Label className="text-sm">Password</Label>
            <div className="relative">
              <Input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password to protect PDF"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {result && <p className="text-sm text-primary">✓ PDF processed successfully!</p>}
          {error && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</p>}
          <div className="flex gap-3 flex-wrap">
            {!result ? (
              <button onClick={() => lock(file, password)} disabled={isProcessing || !password} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50">
                {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : '🔒 Lock PDF'}
              </button>
            ) : (
              <a href={result.url} download={`locked-${file.name}`} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                <Download size={16} /> Download Locked PDF
              </a>
            )}
            <button onClick={() => { reset(); setFile(null); setPassword(''); }} className="px-6 py-2.5 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground transition-all flex items-center gap-2">
              <RefreshCw size={14} /> Reset
            </button>
          </div>
        </div>
      )}
    </PdfToolTemplate>
  );
}
