import { FileImage, FileText, X } from "lucide-react";
import React, { useRef, useState } from "react";

interface MultiFileUploadZoneProps {
  onFilesChange: (files: File[]) => void;
  accept?: string;
  label?: string;
  maxFiles?: number;
}

export function MultiFileUploadZone({
  onFilesChange,
  accept = "application/pdf",
  label = "Drop files here",
  maxFiles = 20,
}: MultiFileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const arr = Array.from(newFiles);
    const updated = [...files, ...arr].slice(0, maxFiles);
    setFiles(updated);
    onFilesChange(updated);
  };

  const removeFile = (i: number) => {
    const updated = files.filter((_, idx) => idx !== i);
    setFiles(updated);
    onFilesChange(updated);
  };

  const isPdf = accept.includes("pdf");

  return (
    <div className="space-y-3">
      <div
        className={`upload-zone rounded-xl ${isDragging ? "drag-over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
      >
        <button
          type="button"
          className="w-full p-8 text-center cursor-pointer bg-transparent border-0"
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              {isPdf ? (
                <FileText size={24} className="text-primary" />
              ) : (
                <FileImage size={24} className="text-primary" />
              )}
            </div>
            <p className="text-foreground font-medium">{label}</p>
            <p className="text-muted-foreground text-sm">
              Click or drag &amp; drop multiple files
            </p>
          </div>
        </button>
      </div>
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div
              key={f.name + f.size}
              className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg"
            >
              {isPdf ? (
                <FileText size={16} className="text-primary shrink-0" />
              ) : (
                <FileImage size={16} className="text-primary shrink-0" />
              )}
              <span className="flex-1 text-sm text-foreground truncate">
                {f.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {(f.size / 1024).toFixed(1)} KB
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
