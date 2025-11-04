"use client";

import Link from "next/link";
import React from "react";

export default function Sidebar(): React.ReactElement {
    return (
        <aside className="basis-[20%] shrink-0 bg-white/80 border-r border-gray-200/70 min-h-screen p-4 
        text-[var(--color-text-dark)] flex flex-col justify-start items-center">
            <div className="mb-4">
                <h2 className="font-bold text-[var(--color-primary)]">Fidelpe-ExtractX</h2>
            </div>
            <nav className="space-y-2">
                <Link href="/" className="block rounded-md px-3 py-2 hover:bg-[var(--color-secondary)] text-sm">
                    Accueil
                </Link>
                <Link href="/fonts-demo" className="block rounded-md px-3 py-2 hover:bg-[var(--color-secondary)] text-sm">
                    Fonts demo
                </Link>
            </nav>
            <div className="mt-6 border-t border-gray-200/70 pt-4 text-xs text-[var(--color-text-muted)]">
                © {new Date().getFullYear()}
            </div>
        </aside>
    );
}
