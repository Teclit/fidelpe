import localFont from "next/font/local";

export const tsoronaAsmara = localFont({
  src: "../../public/fonts/Tsorona/TsoronaAsmara-Regular.ttf",
  variable: "--font-tsorona-asmat",
});

export const sanitizeFontFaceName = (name: string): string =>
  `Geez_${name.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
