// global.d.ts
export {};

declare global {
  interface Window {
    pdfToShare: Blob;
  }
}
