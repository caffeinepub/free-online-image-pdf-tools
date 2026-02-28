import React, { useRef, useState } from 'react';
import { Upload, FileImage, FileText } from 'lucide-react';

interface ToolUploadZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
  sublabel?: string;
  multiple?: false;
}

export function ToolUploadZone({ onFileSelect, accept = 'image/*', label = 'Drop your file here', sublabel = 'or click to browse' }: ToolUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const isPdf = accept.includes('pdf');

  return (
    <div
      className={`upload-zone rounded-xl p-10 text-center cursor-pointer transition-all ${isDragging ? 'drag-over' : ''}`}
      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          {isPdf ? <FileText size={32} className="text-primary" /> : <FileImage size={32} className="text-primary" />}
        </div>
        <div>
          <p className="text-foreground font-semibold text-lg">{label}</p>
          <p className="text-muted-foreground text-sm mt-1">{sublabel}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Upload size={12} />
          <span>Supports {accept.replace('image/', '').replace('application/', '').toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
