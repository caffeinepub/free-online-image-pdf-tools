import { useState, useCallback } from 'react';

export function useImageCompression() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; size: number; originalSize: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compress = useCallback(async (file: File, quality: number = 0.8) => {
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
      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(b => b ? resolve(b) : reject(new Error('Compression failed')), mimeType, quality);
      });
      const url = URL.createObjectURL(blob);
      setResult({ url, size: blob.size, originalSize: file.size });
    } catch (e) {
      setError('Failed to compress image. Please try a different file.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    setError(null);
  }, [result]);

  return { compress, isProcessing, result, error, reset };
}

export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')); };
    img.src = url;
  });
}
