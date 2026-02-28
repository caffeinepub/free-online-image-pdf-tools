import { useState, useCallback } from 'react';
import { loadImage } from './useImageCompression';

export function useImageResize() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; width: number; height: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resize = useCallback(async (file: File, width: number, height: number, maintainAspect: boolean = false) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);
    try {
      const img = await loadImage(file);
      let targetW = width;
      let targetH = height;
      if (maintainAspect) {
        const ratio = img.width / img.height;
        if (width && !height) targetH = Math.round(width / ratio);
        else if (height && !width) targetW = Math.round(height * ratio);
        else {
          const scaleW = width / img.width;
          const scaleH = height / img.height;
          const scale = Math.min(scaleW, scaleH);
          targetW = Math.round(img.width * scale);
          targetH = Math.round(img.height * scale);
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, targetW, targetH);
      const mimeType = file.type || 'image/jpeg';
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(b => b ? resolve(b) : reject(new Error('Resize failed')), mimeType, 0.92);
      });
      setResult({ url: URL.createObjectURL(blob), width: targetW, height: targetH });
    } catch (e) {
      setError('Failed to resize image.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    setError(null);
  }, [result]);

  return { resize, isProcessing, result, error, reset };
}
