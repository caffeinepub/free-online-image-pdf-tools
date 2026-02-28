import { useState, useCallback } from 'react';
import { loadImage } from './useImageCompression';

export function useJpgToPdf() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convert = useCallback(async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);
    try {
      const imageDataList: { dataUrl: string; width: number; height: number }[] = [];
      for (const file of files) {
        const img = await loadImage(file);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        imageDataList.push({ dataUrl, width: img.width, height: img.height });
      }
      const pdfBytes = buildImagePdf(imageDataList);
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResult({ url: URL.createObjectURL(blob), size: blob.size });
    } catch (e) {
      setError('Failed to convert images to PDF.');
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

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function buildImagePdf(images: { dataUrl: string; width: number; height: number }[]): Uint8Array {
  const enc = new TextEncoder();
  const parts: (string | Uint8Array)[] = [];
  let offset = 0;

  const addStr = (s: string) => { parts.push(s); offset += enc.encode(s).length; };
  const addBytes = (b: Uint8Array) => { parts.push(b); offset += b.length; };

  addStr('%PDF-1.4\n');

  const objOffsets: number[] = [];
  const pageCount = images.length;

  const pageObjNums = images.map((_, i) => 4 + i * 3);
  const pagesRef = pageObjNums.map(n => `${n} 0 R`).join(' ');

  objOffsets[1] = offset;
  addStr(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);

  objOffsets[2] = offset;
  addStr(`2 0 obj\n<< /Type /Pages /Kids [${pagesRef}] /Count ${pageCount} >>\nendobj\n`);

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const contentObjNum = 3 + i * 3;
    const pageObjNum = 4 + i * 3;
    const imgObjNum = 5 + i * 3;
    const imgName = `Im${i}`;

    const maxW = 512;
    const maxH = 692;
    let w = img.width;
    let h = img.height;
    if (w > maxW || h > maxH) {
      const scale = Math.min(maxW / w, maxH / h);
      w = Math.round(w * scale);
      h = Math.round(h * scale);
    }
    const x = Math.round((612 - w) / 2);
    const y = Math.round((792 - h) / 2);

    const stream = `q\n${w} 0 0 ${h} ${x} ${y} cm\n/${imgName} Do\nQ\n`;

    objOffsets[contentObjNum] = offset;
    addStr(`${contentObjNum} 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`);

    objOffsets[pageObjNum] = offset;
    addStr(`${pageObjNum} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${contentObjNum} 0 R /Resources << /XObject << /${imgName} ${imgObjNum} 0 R >> >> >>\nendobj\n`);

    const b64 = img.dataUrl.split(',')[1];
    const jpegBytes = base64ToBytes(b64);

    objOffsets[imgObjNum] = offset;
    const imgHeader = `${imgObjNum} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`;
    addStr(imgHeader);
    addBytes(jpegBytes);
    addStr(`\nendstream\nendobj\n`);
  }

  const xrefOffset = offset;
  const maxObj = 5 + (images.length - 1) * 3;
  let xref = `xref\n0 ${maxObj + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= maxObj; i++) {
    const off = objOffsets[i] ?? 0;
    xref += String(off).padStart(10, '0') + ' 00000 n \n';
  }
  addStr(xref);
  addStr(`trailer\n<< /Size ${maxObj + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);

  const totalLen = parts.reduce((sum, p) => sum + (typeof p === 'string' ? enc.encode(p).length : p.length), 0);
  const out = new Uint8Array(totalLen);
  let pos = 0;
  for (const p of parts) {
    const bytes = typeof p === 'string' ? enc.encode(p) : p;
    out.set(bytes, pos);
    pos += bytes.length;
  }
  return out;
}
