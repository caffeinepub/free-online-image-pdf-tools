import React, { useState } from 'react';
import { ImageToolTemplate } from '@/components/tools/ImageToolTemplate';
import { ToolUploadZone } from '@/components/tools/ToolUploadZone';
import { useImageMetadata } from '@/hooks/useImageMetadata';
import { getToolById } from '@/utils/toolsData';
import { RefreshCw, Loader2 } from 'lucide-react';

export function ImageMetadataViewerPage() {
  const tool = getToolById('image-metadata-viewer')!;
  const { extract, isProcessing, metadata, error, reset } = useImageMetadata();
  const [file, setFile] = useState<File | null>(null);

  const handleFile = (f: File) => { setFile(f); reset(); extract(f); };

  const formatSize = (bytes: number) => bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <ImageToolTemplate tool={tool}>
      {!file ? (
        <ToolUploadZone onFileSelect={handleFile} accept="image/*" label="Drop your image here" sublabel="Supports JPG, PNG, WebP, GIF" />
      ) : (
        <div className="space-y-6">
          {isProcessing && (
            <div className="flex items-center justify-center gap-2 py-8">
              <Loader2 size={20} className="animate-spin text-primary" />
              <span className="text-muted-foreground">Extracting metadata...</span>
            </div>
          )}
          {metadata && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'File Name', value: metadata.fileName },
                { label: 'File Size', value: formatSize(metadata.fileSize) },
                { label: 'File Type', value: metadata.fileType },
                { label: 'Dimensions', value: `${metadata.width} × ${metadata.height} px` },
                { label: 'Aspect Ratio', value: metadata.aspectRatio },
                { label: 'Last Modified', value: metadata.lastModified },
              ].map(item => (
                <div key={item.label} className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-foreground break-all">{item.value}</p>
                </div>
              ))}
            </div>
          )}
          {error && <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">{error}</p>}
          <button onClick={() => { reset(); setFile(null); }} className="px-6 py-2.5 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground transition-all flex items-center gap-2">
            <RefreshCw size={14} /> Analyze Another Image
          </button>
        </div>
      )}
    </ImageToolTemplate>
  );
}
