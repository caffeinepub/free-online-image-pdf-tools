import { useState, useCallback } from 'react';

export interface ImageMetadata {
  fileName: string;
  fileSize: number;
  fileType: string;
  width: number;
  height: number;
  aspectRatio: string;
  lastModified: string;
  colorDepth?: number;
}

export function useImageMetadata() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  const extract = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setMetadata(null);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        const url = URL.createObjectURL(file);
        i.onload = () => { URL.revokeObjectURL(url); resolve(i); };
        i.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load')); };
        i.src = url;
      });
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      const g = gcd(img.width, img.height);
      const aspectRatio = `${img.width / g}:${img.height / g}`;
      setMetadata({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || 'Unknown',
        width: img.width,
        height: img.height,
        aspectRatio,
        lastModified: new Date(file.lastModified).toLocaleString(),
      });
    } catch (e) {
      setError('Failed to extract metadata.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setMetadata(null);
    setError(null);
  }, []);

  return { extract, isProcessing, metadata, error, reset };
}
