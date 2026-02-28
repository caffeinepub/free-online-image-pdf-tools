import { useState, useCallback } from 'react';

export function usePdfToWord() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; text: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convert = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);
    try {
      await loadPdfjsScript();
      const pdfjsLib = (window as any).pdfjsLib;
      if (!pdfjsLib) throw new Error('PDF.js not available');

      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(' ');
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      }
      const blob = new Blob([fullText], { type: 'text/plain' });
      setResult({ url: URL.createObjectURL(blob), text: fullText });
    } catch (e) {
      setError('Failed to extract text from PDF. Please ensure the file is a valid text-based PDF.');
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
