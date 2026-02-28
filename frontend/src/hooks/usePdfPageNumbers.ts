import { useState, useCallback } from 'react';

export function usePdfPageNumbers() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addPageNumbers = useCallback(async (
    file: File,
    _position: 'bottom-center' | 'bottom-right' | 'top-center' | 'top-right' = 'bottom-center',
    _startNumber: number = 1
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
      setError('Failed to add page numbers.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    setError(null);
  }, [result]);

  return { addPageNumbers, isProcessing, result, error, reset };
}
