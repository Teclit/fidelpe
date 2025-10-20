// src/app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "FidelpeExtractX - Simplifier les textes",
    description: "Outil simple pour extraire et rendre les textes plus faciles à comprendre, conçu pour les personnes peu à l'aise avec le numérique.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="fr">
        <body className="app-container">
            <main className="card">{children}</main>
        </body>
        </html>
    );
}
