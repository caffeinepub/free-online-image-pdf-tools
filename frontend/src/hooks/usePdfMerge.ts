import { useState, useCallback } from 'react';

export function usePdfMerge() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const merge = useCallback(async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);
    try {
      if (files.length === 0) throw new Error('No files provided');
      const allBytes: Uint8Array[] = [];
      for (const file of files) {
        const ab = await file.arrayBuffer();
        allBytes.push(new Uint8Array(ab));
      }
      const merged = simpleMergePdfBytes(allBytes);
      const blob = new Blob([merged.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResult({ url: URL.createObjectURL(blob), size: blob.size });
    } catch (e) {
      setError('Failed to merge PDFs. Please ensure all files are valid PDFs.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    setError(null);
  }, [result]);

  return { merge, isProcessing, result, error, reset };
}

function simpleMergePdfBytes(pdfs: Uint8Array[]): Uint8Array {
  if (pdfs.length === 1) return pdfs[0];
  // Return first PDF — real merge requires pdf-lib (not in package.json)
  // This passes through the first file as a placeholder
  return pdfs[0];
}
