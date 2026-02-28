import { useState, useCallback } from 'react';

export function usePdfToJpg() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{ url: string; page: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const convert = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setResults([]);
    setProgress(0);
    try {
      // Use dynamic script loading for pdfjs since it's not in package.json
      await loadPdfjsScript();
      const pdfjsLib = (window as any).pdfjsLib;
      if (!pdfjsLib) throw new Error('PDF.js not available');

      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const numPages = pdf.numPages;
      const images: { url: string; page: number }[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(b => b ? resolve(b) : reject(new Error('Failed')), 'image/jpeg', 0.92);
        });
        images.push({ url: URL.createObjectURL(blob), page: i });
        setProgress(Math.round((i / numPages) * 100));
      }
      setResults(images);
    } catch (e) {
      setError('Failed to convert PDF to images. Please ensure the file is a valid PDF.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    results.forEach(r => URL.revokeObjectURL(r.url));
    setResults([]);
    setError(null);
    setProgress(0);
  }, [results]);

  return { convert, isProcessing, results, error, progress, reset };
}

function loadPdfjsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).pdfjsLib) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load PDF.js'));
    document.head.appendChild(script);
  });
}
