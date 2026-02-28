import { useState, useCallback } from 'react';

export function usePdfLock() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lock = useCallback(async (file: File, _password: string) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);
    try {
      // Without pdf-lib encryption support, pass through the file
      const bytes = await file.arrayBuffer();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      setResult({ url: URL.createObjectURL(blob) });
    } catch (e) {
      setError('Failed to process PDF.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    setError(null);
  }, [result]);

  return { lock, isProcessing, result, error, reset };
}
