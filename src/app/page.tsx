"use client";

import React, { useState, useCallback } from "react";
import localFont from "next/font/local";

export const tsoronaAsmara = localFont({
  src: "../../public/fonts/Tsorona/TsoronaAsmara-Regular.ttf",
  variable: "--font-tsorona-asmat",
});

export default function Home(): React.ReactElement {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const simplifyText = useCallback((input: string) => {
    const collapsed = input.replace(/\s+/g, " ").trim();
    return collapsed
      .split(/(?<=\.)\s+/)
      .map((s) => s.trim())
      .map((s) => (s.length > 200 ? s.slice(0, 197) + "..." : s))
      .join(" ");
  }, []);

  const extractTextFromFile = useCallback(async (selectedFile: File) => {
    const mime = selectedFile.type;
    const name = selectedFile.name.toLowerCase();

    if (mime.includes("pdf") || name.endsWith(".pdf")) {
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf");
      const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs");
      const workerSrc =
        (worker as { default?: string }).default ??
        (worker as unknown as string);
      pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
      const data = new Uint8Array(await selectedFile.arrayBuffer());
      const doc = await pdfjs.getDocument({ data }).promise;
      let textFromPdf = "";

      for (let pageIndex = 1; pageIndex <= doc.numPages; pageIndex += 1) {
        const page = await doc.getPage(pageIndex);
        const content = await page.getTextContent();
        const getText = (item: unknown) => {
          if (typeof item === "object" && item !== null) {
            const candidate = item as { str?: string; text?: string };
            if (typeof candidate.str === "string") return candidate.str;
            if (typeof candidate.text === "string") return candidate.text;
          }
          return "";
        };
        textFromPdf += `${content.items
          .map((item) => getText(item))
          .join(" ")}\n`;
      }

      return textFromPdf.trim();
    }

    if (
      mime ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      name.endsWith(".docx")
    ) {
      const mammoth = await import("mammoth/mammoth.browser");
      const arrayBuffer = await selectedFile.arrayBuffer();
      const { value } = await mammoth.extractRawText({ arrayBuffer });
      return value?.trim() ?? "";
    }

    if (mime.startsWith("text/") || name.endsWith(".txt")) {
      return (await selectedFile.text()).trim();
    }

    if (mime.startsWith("image/")) {
      const { createWorker } = await import("tesseract.js");
      const objectUrl = URL.createObjectURL(selectedFile);

      const worker = await createWorker("eng+amh");
      try {
        const {
          data: { text: ocrText },
        } = await worker.recognize(objectUrl);
        return ocrText?.trim() ?? "";
      } finally {
        await worker.terminate();
        URL.revokeObjectURL(objectUrl);
      }
    }

    return `[Unsupported file type: ${selectedFile.name}]`;
  }, []);

  const handleProcess = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        let content = text;

        if (file) {
          const extracted = await extractTextFromFile(file);
          content = [content, extracted].filter(Boolean).join("\n\n");
          setText(content);
        }

        if (!content.trim()) {
          setResult("[No text provided]");
          return;
        }

        await new Promise((r) => setTimeout(r, 300));
        setResult(simplifyText(content));
      } catch (err) {
        console.error(err);
        setResult(
          "We could not extract text from this document. Please try another file or paste the text."
        );
      } finally {
        setLoading(false);
      }
    },
    [extractTextFromFile, file, simplifyText, text]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0] ?? null;
      setFile(selected);
    },
    []
  );

  const handleReset = useCallback(() => {
    setText("");
    setResult("");
    setFile(null);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [result]);

  return (
    <main className="space-y-4 flex flex-col min-h-full">
      <header className="text-center mb-3">
        <h1
          className={`${tsoronaAsmara.className} font-bold text-2xl sm:text-3xl md:text-4xl leading-tight text-(--color-primary) mb-2`}
        >
          ፊደልፐ ምስ ግእዝ
        </h1>
        <h1 className="text-sm sm:text-base text-(--color-primary) mb-2">
          FidelPE — Make texts easy
        </h1>
        <p className="m-0 text-(--color-text-muted) text-xs sm:text-base md:text-lg leading-[1.45]">
          This tool is for people who don&rsquo;t often use digital tools. Copy
          a text or import a photo (invoice, letter, note). We extract and
          simplify sentences to make them clearer.
        </p>
      </header>

      <form onSubmit={handleProcess} className="">
        <label
          htmlFor="text"
          className="block font-bold text-(--color-primary) mb-[0.6rem] text-[0.98rem]"
        >
          Your text or image
        </label>

        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste text here or import a photo."
          className="w-full min-h-48 sm:min-h-56 p-3 sm:p-[0.9rem] rounded-xl border border-[rgba(54,41,37,0.12)] bg-white text-(--color-text-dark) resize-y shadow-[inset_0_1px_0_rgba(0,0,0,0.02)] text-sm sm:text-base focus:outline focus:outline-[rgba(133,88,50,0.12)] focus:border-(--color-accent-cta)"
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
          <label className="inline-flex gap-2 items-center justify-center text-center py-[0.6rem] px-[0.9rem] bg-(--color-accent-cta) border border-[rgba(0,0,0,0.06)] rounded-xl cursor-pointer text-[#fefefe] text-[0.98rem] w-full sm:w-auto">
            <input
              type="file"
              accept=".pdf,.docx,.txt,image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            📁 Import a doc / photo / scan
          </label>
          {file?.name && (
            <span className="text-(--color-text-muted) text-sm sm:text-base sm:pl-1">
              Selected: {file.name}
            </span>
          )}

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-[0.6rem] py-3 px-4 rounded-xl font-bold cursor-pointer border-0 text-[0.98rem] bg-linear-to-b from-(--color-accent-cta) to-(--color-accent) text-white shadow-[0_8px_22px_rgba(133,88,50,0.12)] focus:outline focus:outline-[rgba(133,88,50,0.14)] disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {loading ? "Processing..." : "Simplify"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-[0.6rem] py-3 px-4 rounded-xl font-bold cursor-pointer text-[0.98rem] bg-white text-(--color-primary) border border-[rgba(17,24,39,0.06)] disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      {result && (
        <section className="mt-4 sm:mt-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-(--color-primary)">Simplified text</h2>
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-2 py-2 px-3 rounded-[10px] font-bold text-white ${
                copied ? "bg-(--color-primary-two)" : "bg-(--color-accent)"
              }`}
              aria-label={copied ? "Copied" : "Copy"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <rect x="9" y="9" width="11" height="11" rx="2" />
                <path d="M5 15V5a2 2 0 0 1 2-2h10" />
              </svg>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <pre className="whitespace-pre-wrap bg-[#fff8f3] p-3 sm:p-4 rounded-[10px] border border-[rgba(17,24,39,0.06)] text-(--color-text-dark) max-h-[50vh] overflow-auto text-sm sm:text-base leading-6">
            {result}
          </pre>
        </section>
      )}

      <footer className="text-center text-(--color-text-muted) text-[0.95rem] mt-auto">
        © {new Date().getFullYear()} FidelPE — For people not comfortable with
        digital technology.
      </footer>
    </main>
  );
}
