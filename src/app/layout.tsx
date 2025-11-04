// src/app/layout.tsx
import "./globals.css";
import {ReactNode} from "react";
import type {Metadata} from "next";
import localFont from 'next/font/local';


// Polices individuelles pour utilisation séparée
const brana = localFont({
    src: './fonts/RaeyType/Brana-Regular.ttf',
    display: 'swap',
    variable: '--font-brana',
});

const geezManuscript = localFont({
    src: './fonts/RaeyType/Geez-Manuscript-Zemen-COLR.ttf',
    display: 'swap',
    variable: '--font-geez-manuscript',
});

const gfzemenu = localFont({
    src: './fonts/RaeyType/gfzemenu.ttf',
    display: 'swap',
    variable: '--font-gfzemenu',
});

const geezFantuwua = localFont({
    src: './fonts/RaeyType/GeezFantuwua-Regular.ttf',
    display: 'swap',
    variable: '--font-geez-fantuwua',
});

const geezHiwua = localFont({
    src: './fonts/RaeyType/GeezHiwua-Regular.ttf',
    display: 'swap',
    variable: '--font-geez-hiwua',
});

const geezJiret = localFont({
    src: './fonts/RaeyType/GeezJiret-Regular.ttf',
    display: 'swap',
    variable: '--font-geez-jiret',
});

const geezTint = localFont({
    src: './fonts/RaeyType/GeezTint-Regular.ttf',
    display: 'swap',
    variable: '--font-geez-tint',
});

const geezWookianos = localFont({
    src: './fonts/RaeyType/GeezWookianos-Regular.ttf',
    display: 'swap',
    variable: '--font-geez-wookianos',
});

const geezYebse = localFont({
    src: './fonts/RaeyType/GeezYebse-Regular.ttf',
    display: 'swap',
    variable: '--font-geez-yebse',
});

const geezGoffer = localFont({
    src: './fonts/RaeyType/GeezYigezuBisratGoffer-Regular.ttf',
    display: 'swap',
    variable: '--font-geez-goffer',
});

const geezGothic = localFont({
    src: './fonts/RaeyType/GeezYigezuBisratGothic-Regular.ttf',
    display: 'swap',
    variable: '--font-geez-gothic',
});

const geezZelan = localFont({
    src: './fonts/RaeyType/GeezZelan-Regular.ttf',
    display: 'swap',
    variable: '--font-geez-zelan',
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
    geezGothic,
    geezZelan
};


export const metadata: Metadata = {
    title: "FidelpeExtractX - Simplify texts",
    description: "Simple tool to extract and simplify texts, designed for people who are not comfortable with digital technology."
};

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="en" className={`${geezGothic.variable} ${brana.variable} ${geezManuscript.variable} ${gfzemenu.variable} ${geezFantuwua.variable} ${geezHiwua.variable} ${geezJiret.variable} ${geezTint.variable} ${geezWookianos.variable} ${geezYebse.variable} ${geezGoffer.variable} ${geezZelan.variable} ${geezGothic.className}`}>
        <body className="w-full min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-gray-900 to-gray-800">
        <main className="w-full max-w-[820px] bg-white/98 rounded-2xl p-6 shadow-[0_12px_36px_rgba(20,20,20,0.12)] border border-gray-200">{children}</main>
        </body>
        </html>
    );
}