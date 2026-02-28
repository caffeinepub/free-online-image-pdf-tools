import { useState, useCallback, useRef } from 'react';
import { loadImage } from './useImageCompression';

export interface CropArea { x: number; y: number; width: number; height: number; }

export function useImageCrop() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; width: number; height: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const crop = useCallback(async (file: File, area: CropArea) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);
    try {
      const img = await loadImage(file);
      const canvas = document.createElement('canvas');
      canvas.width = area.width;
      canvas.height = area.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);
      const mimeType = file.type || 'image/jpeg';
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(b => b ? resolve(b) : reject(new Error('Crop failed')), mimeType, 0.95);
      });
      setResult({ url: URL.createObjectURL(blob), width: area.width, height: area.height });
    } catch (e) {
      setError('Failed to crop image.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    setError(null);
  }, [result]);

  return { crop, isProcessing, result, error, reset };
}
