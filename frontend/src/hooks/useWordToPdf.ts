import { useState, useCallback } from 'react';

export function useWordToPdf() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convert = useCallback(async (text: string) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);
    try {
      const pdfBytes = buildSimplePdf(text);
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResult({ url: URL.createObjectURL(blob) });
    } catch (e) {
      setError('Failed to convert text to PDF.');
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

function buildSimplePdf(text: string): Uint8Array {
  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 50;
  const fontSize = 12;
  const lineHeight = 16;
  const charsPerLine = Math.floor((pageWidth - 2 * margin) / (fontSize * 0.55));

  const rawLines = text.split('\n');
  const lines: string[] = [];
  for (const raw of rawLines) {
    if (raw.length === 0) { lines.push(''); continue; }
    for (let i = 0; i < raw.length; i += charsPerLine) {
      lines.push(raw.slice(i, i + charsPerLine));
    }
  }

  const linesPerPage = Math.floor((pageHeight - 2 * margin) / lineHeight);
  const pages: string[][] = [];
  for (let i = 0; i < lines.length; i += linesPerPage) {
    pages.push(lines.slice(i, i + linesPerPage));
  }
  if (pages.length === 0) pages.push(['']);

  const enc = new TextEncoder();
  const objects: string[] = [];
  const pageCount = pages.length;

  // obj 1: catalog
  objects.push(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);

  // obj 2: pages
  const pageRefNums: number[] = [];
  for (let i = 0; i < pageCount; i++) pageRefNums.push(4 + i * 2);
  const pagesRef = pageRefNums.map(n => `${n} 0 R`).join(' ');
  objects.push(`2 0 obj\n<< /Type /Pages /Kids [${pagesRef}] /Count ${pageCount} >>\nendobj\n`);

  // font obj
  const fontObjNum = 3 + pageCount * 2;
  // placeholder — will be added after page objects

  // page content streams and page dicts
  for (let p = 0; p < pageCount; p++) {
    const contentObjNum = 3 + p * 2;
    const pageObjNum = 4 + p * 2;
    const pageLines = pages[p];

    let stream = `BT\n/F1 ${fontSize} Tf\n`;
    let y = pageHeight - margin - fontSize;
    for (const line of pageLines) {
      const safe = line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
      stream += `${margin} ${y} Td\n(${safe}) Tj\n0 0 Td\n`;
      y -= lineHeight;
    }
    stream += 'ET\n';

    objects.push(`${contentObjNum} 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`);
    objects.push(`${pageObjNum} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${contentObjNum} 0 R /Resources << /Font << /F1 ${fontObjNum} 0 R >> >> >>\nendobj\n`);
  }

  // font object
  objects.push(`${fontObjNum} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`);

  // Build PDF body
  let body = '%PDF-1.4\n';
  const byteOffsets: number[] = [];
  for (const obj of objects) {
    byteOffsets.push(enc.encode(body).length);
    body += obj;
  }

  const xrefOffset = enc.encode(body).length;
  const totalObjs = objects.length + 1;
  let xref = `xref\n0 ${totalObjs}\n0000000000 65535 f \n`;
  for (const off of byteOffsets) {
    xref += String(off).padStart(10, '0') + ' 00000 n \n';
  }
  body += xref;
  body += `trailer\n<< /Size ${totalObjs} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return enc.encode(body);
}
