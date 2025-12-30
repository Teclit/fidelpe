// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "FidelpeExtractX - Simplify texts",
  description:
    "Simple tool to extract and simplify texts, designed for people who are not comfortable with digital technology.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth`}>
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
