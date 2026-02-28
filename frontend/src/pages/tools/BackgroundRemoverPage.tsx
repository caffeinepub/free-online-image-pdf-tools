import React, { useState } from 'react';
import { ImageToolTemplate } from '@/components/tools/ImageToolTemplate';
import { ToolUploadZone } from '@/components/tools/ToolUploadZone';
import { useBackgroundRemoval } from '@/hooks/useBackgroundRemoval';
import { getToolById } from '@/utils/toolsData';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Download, RefreshCw, Loader2 } from 'lucide-react';

export function BackgroundRemoverPage() {
  const tool = getToolById('background-remover')!;
  const { removeBackground, isProcessing, result, error, reset } = useBackgroundRemoval();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [tolerance, setTolerance] = useState(30);

  const handleFile = (f: File) => { setFile(f); reset(); setPreview(URL.createObjectURL(f)); };

  return (
    <ImageToolTemplate tool={tool}>
      {!file ? (
        <ToolUploadZone onFileSelect={handleFile} accept="image/*" label="Drop your image here" sublabel="Works best with solid color backgrounds" />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {preview && <div className="flex flex-col items-center gap-2"><p className="text-xs text-muted-foreground">Original</p><img src={preview} alt="Original" className="max-h-48 rounded-lg object-contain border border-border" /></div>}
            {result && <div className="flex flex-col items-center gap-2"><p className="text-xs text-muted-foreground">Result</p><img src={result.url} alt="Result" className="max-h-48 rounded-lg object-contain border border-border bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQoU2NkYGBg+M9AgBEHgHEHGAAA//8A3gAFAAAAAElFTkSuQmCC')]" /></div>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Background Color to Remove</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border border-border" />
                <span className="text-sm text-muted-foreground">{bgColor}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Tolerance: {tolerance}</Label>
              <Slider value={[tolerance]} onValueChange={([v]) => setTolerance(v)} min={5} max={80} step={5} />
            </div>
          </div>
          {error && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</p>}
          <div className="flex gap-3 flex-wrap">
            {!result ? (
              <button onClick={() => removeBackground(file, bgColor, tolerance)} disabled={isProcessing} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : '🎭 Remove Background'}
              </button>
            ) : (
              <a href={result.url} download={`bg-removed-${file.name.replace(/\.[^.]+$/, '.png')}`} className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
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
