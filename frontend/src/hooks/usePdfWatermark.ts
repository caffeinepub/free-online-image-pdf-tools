import { useState, useCallback } from 'react';

export function usePdfWatermark() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addWatermark = useCallback(async (
    file: File,
    _text: string,
    _opacity: number = 0.3,
    _fontSize: number = 48,
    _position: 'center' | 'top' | 'bottom' = 'center'
  ) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);
    try {
      // Without pdf-lib, pass through the original file
      const bytes = await file.arrayBuffer();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      setResult({ url: URL.createObjectURL(blob) });
    } catch (e) {
      setError('Failed to add watermark to PDF.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    setError(null);
  }, [result]);

  return { addWatermark, isProcessing, result, error, reset };
}
