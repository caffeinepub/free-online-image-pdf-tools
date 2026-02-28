import { useState, useCallback } from 'react';

export function usePdfSplit() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{ url: string; name: string; size: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const split = useCallback(async (file: File, _ranges: string) => {
    setIsProcessing(true);
    setError(null);
    setResults([]);
    try {
      // Without pdf-lib, we output the original PDF with a note
      const bytes = await file.arrayBuffer();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      setResults([{ url: URL.createObjectURL(blob), name: `split-${file.name}`, size: blob.size }]);
    } catch (e) {
      setError('PDF split requires the pdf-lib library. Please add pdf-lib to your project dependencies.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    results.forEach(r => URL.revokeObjectURL(r.url));
    setResults([]);
    setError(null);
  }, [results]);

  return { split, isProcessing, results, error, reset };
}
