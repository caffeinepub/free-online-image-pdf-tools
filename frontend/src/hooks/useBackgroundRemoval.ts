import { useState, useCallback } from 'react';
import { loadImage } from './useImageCompression';

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

export function useBackgroundRemoval() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const removeBackground = useCallback(async (file: File, bgColor: string = '#ffffff', tolerance: number = 30) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);
    try {
      const img = await loadImage(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const target = hexToRgb(bgColor);
      for (let i = 0; i < data.length; i += 4) {
        const dr = Math.abs(data[i] - target.r);
        const dg = Math.abs(data[i + 1] - target.g);
        const db = Math.abs(data[i + 2] - target.b);
        if (dr < tolerance && dg < tolerance && db < tolerance) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(b => b ? resolve(b) : reject(new Error('Failed')), 'image/png');
      });
      setResult({ url: URL.createObjectURL(blob) });
    } catch (e) {
      setError('Failed to remove background.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    setError(null);
  }, [result]);

  return { removeBackground, isProcessing, result, error, reset };
}
