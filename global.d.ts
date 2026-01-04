declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

declare module "pdfjs-dist/legacy/build/pdf" {
  import type * as pdfjs from "pdfjs-dist";
  export = pdfjs;
}

declare module "mammoth/mammoth.browser" {
  export function extractRawText(options: {
    arrayBuffer: ArrayBuffer;
  }): Promise<{ value?: string }>;
}

declare module "pdfjs-dist/build/pdf.worker.min.mjs" {
  const workerSrc: string;
  export default workerSrc;
}
