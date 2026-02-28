import { useState, useCallback } from 'react';
import { loadImage } from './useImageCompression';

type ConversionFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export function useImageConversion() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; size: number; format: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convert = useCallback(async (file: File, targetFormat: ConversionFormat, quality: number = 0.92) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);
    try {
      const img = await loadImage(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(b => b ? resolve(b) : reject(new Error('Conversion failed')), targetFormat, quality);
      });
      const ext = targetFormat.split('/')[1];
      setResult({ url: URL.createObjectURL(blob), size: blob.size, format: ext });
    } catch (e) {
      setError('Failed to convert image. Please try a different file.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    setError(null);
  }, [result]);

  return { convert, isProcessing, result, error, reset };
}
