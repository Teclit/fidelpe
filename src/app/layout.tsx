// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Sidebar from "@/components/Sidebar";

// Polices individuelles pour utilisation séparée
const brana = localFont({
  src: "../../../public/fonts/Dekemhare/DekemhareBeilul.ttf",
  display: "swap",
  variable: "--font-brana",
});

const geezManuscript = localFont({
  src: "../../../public/fonts/EmniHaili/EmniHaili.ttf",
  display: "swap",
  variable: "--font-geez-manuscript",
});

const gfzemenu = localFont({
  src: "../../../public/fonts/AdiQuala/adiQuala_Himberti.ttf",
  display: "swap",
  variable: "--font-gfzemenu",
});

const geezFantuwua = localFont({
  src: "../../../public/fonts/GeezFonts/GeezHandwriting.ttf",
  display: "swap",
  variable: "--font-geez-fantuwua",
});

const geezHiwua = localFont({
  src: "../../../public/fonts/GeezFonts/GeezHandwritingBold.ttf",
  display: "swap",
  variable: "--font-geez-hiwua",
});

const geezJiret = localFont({
  src: "../../../public/fonts/GeezFonts/GeezHandwritingOutlines.ttf",
  display: "swap",
  variable: "--font-geez-jiret",
});

const geezTint = localFont({
  src: "../../../public/fonts/GeezFonts/GeezHandwritingDots.ttf",
  display: "swap",
  variable: "--font-geez-tint",
});

const geezWookianos = localFont({
  src: "../../../public/fonts/Mendefera/MendeferaNakfa-Regular.ttf",
  display: "swap",
  variable: "--font-geez-wookianos",
});

const geezYebse = localFont({
  src: "../../../public/fonts/Senafe/SenafeLogoSarda-Medium.ttf",
  display: "swap",
  variable: "--font-geez-yebse",
});

const geezGoffer = localFont({
  src: "../../../public/fonts/GeezFonts/GeezHandwritingWithArrows.ttf",
  display: "swap",
  variable: "--font-geez-goffer",
});

// Exporter les polices pour utilisation dans d'autres composants
export {
  brana,
  geezManuscript,
  gfzemenu,
  geezFantuwua,
  geezHiwua,
  geezJiret,
  geezTint,
  geezWookianos,
  geezYebse,
  geezGoffer,
};

export const metadata: Metadata = {
  title: "FidelpeExtractX - Simplify texts",
  description:
    "Simple tool to extract and simplify texts, designed for people who are not comfortable with digital technology.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="w-full min-h-screen bg-linear-to-br from-gray-900 to-gray-800">
        <div className="flex min-h-screen w-full backdrop-blur-sm/0">
          <Sidebar />
          <section className="flex-1 md:basis-[80%] min-h-screen p-3 sm:p-4 md:p-6">
            <div className="w-full h-full rounded-2xl p-3 sm:p-4 md:p-6 ">
              {children}
            </div>
          </section>
        </div>
      </body>
    </html>
  );
}
