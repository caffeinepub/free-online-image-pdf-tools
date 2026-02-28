import { useState, useCallback } from 'react';
import { loadImage } from './useImageCompression';

export function useImageRotation() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rotate = useCallback(async (file: File, degrees: number, flipH: boolean = false, flipV: boolean = false) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);
    try {
      const img = await loadImage(file);
      const rad = (degrees * Math.PI) / 180;
      const sin = Math.abs(Math.sin(rad));
      const cos = Math.abs(Math.cos(rad));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * cos + img.height * sin);
      canvas.height = Math.round(img.width * sin + img.height * cos);
      const ctx = canvas.getContext('2d')!;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      if (flipH) ctx.scale(-1, 1);
      if (flipV) ctx.scale(1, -1);
      ctx.rotate(rad);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      const mimeType = file.type || 'image/jpeg';
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(b => b ? resolve(b) : reject(new Error('Rotation failed')), mimeType, 0.95);
      });
      setResult({ url: URL.createObjectURL(blob) });
    } catch (e) {
      setError('Failed to rotate image.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    setError(null);
  }, [result]);

  return { rotate, isProcessing, result, error, reset };
}
