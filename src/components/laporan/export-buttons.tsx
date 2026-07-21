"use client";

/**
 * Komponen client untuk tombol Export Laporan.
 * Dipakai di halaman /dashboard/laporan.
 */
import { useState } from "react";
import { Download, FileText, FileSpreadsheet, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ReportRow,
  type ReportSummary,
  rowsToCSV,
  summaryToMarkdown,
  downloadFile,
} from "@/lib/laporan/export";

type Props = {
  rows: ReportRow[];
  summary: ReportSummary;
  clientName?: string;
};

export function ExportButtons({ rows, summary, clientName }: Props) {
  const [exporting, setExporting] = useState(false);

  function handleExportCSV() {
    setExporting(true);
    try {
      const csv = rowsToCSV(rows);
      const filename = `laporan-${clientName ?? "toko"}-${summary.period.end}.csv`;
      // BOM supaya Excel detect UTF-8 dengan benar
      downloadFile("\uFEFF" + csv, filename, "text/csv;charset=utf-8");
    } finally {
      setExporting(false);
    }
  }

  function handleExportMarkdown() {
    setExporting(true);
    try {
      const md = summaryToMarkdown(summary, clientName);
      const filename = `laporan-${clientName ?? "toko"}-${summary.period.end}.md`;
      downloadFile(md, filename, "text/markdown;charset=utf-8");
    } finally {
      setExporting(false);
    }
  }

  function handleCopyMarkdown() {
    const md = summaryToMarkdown(summary, clientName);
    navigator.clipboard.writeText(md);
    alert("Laporan Markdown sudah di-copy! Paste ke ChatGPT/Claude untuk analisis.");
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <Download className="h-5 w-5" />
          Export &amp; Download Laporan
        </CardTitle>
        <CardDescription>
          Download untuk Excel, atau format Markdown yang bisa dibaca AI (ChatGPT/Claude/Grok)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:grid-cols-3">
          <Button
            onClick={handleExportCSV}
            disabled={exporting || rows.length === 0}
            variant="default"
            className="w-full"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
          <Button
            onClick={handleExportMarkdown}
            disabled={exporting || rows.length === 0}
            variant="outline"
            className="w-full"
          >
            <FileText className="mr-2 h-4 w-4" />
            Download .md
          </Button>
          <Button
            onClick={handleCopyMarkdown}
            disabled={exporting || rows.length === 0}
            variant="outline"
            className="w-full"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Copy untuk AI
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          💡 <strong>Tips:</strong> Klik "Copy untuk AI" lalu paste ke ChatGPT/Claude untuk
          tanya insight bisnis: "Coba analisis laporan saya, apa yang perlu diperbaiki?"
        </p>
      </CardContent>
    </Card>
  );
}
