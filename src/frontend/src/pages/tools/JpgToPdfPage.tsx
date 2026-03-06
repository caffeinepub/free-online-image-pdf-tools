import { MultiFileUploadZone } from "@/components/tools/MultiFileUploadZone";
import { PdfToolTemplate } from "@/components/tools/PdfToolTemplate";
import { useJpgToPdf } from "@/hooks/useJpgToPdf";
import { getToolById } from "@/utils/toolsData";
import { Download, Loader2, RefreshCw } from "lucide-react";
import React, { useState } from "react";

export function JpgToPdfPage() {
  const tool = getToolById("jpg-to-pdf")!;
  const { convert, isProcessing, result, error, reset } = useJpgToPdf();
  const [files, setFiles] = useState<File[]>([]);

  return (
    <PdfToolTemplate tool={tool}>
      <div className="space-y-6">
        <MultiFileUploadZone
          onFilesChange={setFiles}
          accept="image/jpeg,image/png,image/webp,image/*"
          label="Drop image files here"
          maxFiles={20}
        />
        {files.length > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            {files.length} image(s) ready to convert
          </p>
        )}
        {result && (
          <p className="text-sm text-primary">
            ✓ PDF created! ({(result.size / 1024).toFixed(1)} KB)
          </p>
        )}
        {error && (
          <p className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
            {error}
          </p>
        )}
        <div className="flex gap-3 flex-wrap">
          {!result ? (
            <button
              type="button"
              onClick={() => convert(files)}
              disabled={isProcessing || files.length === 0}
              className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Creating PDF...
                </>
              ) : (
                "📋 Convert to PDF"
              )}
            </button>
          ) : (
            <a
              href={result.url}
              download="images-to-pdf.pdf"
              className="btn-gradient px-6 py-2.5 rounded-lg text-sm flex items-center gap-2"
            >
              <Download size={16} /> Download PDF
            </a>
          )}
          <button
            type="button"
            onClick={() => {
              reset();
              setFiles([]);
            }}
            className="px-6 py-2.5 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground transition-all flex items-center gap-2"
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      </div>
    </PdfToolTemplate>
  );
}
