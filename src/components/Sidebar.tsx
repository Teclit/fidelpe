"use client";

import { tsoronaAsmara } from "@/app/page";
import Link from "next/link";
import React, { useState, useCallback } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Sidebar(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  return (
    <>
      {/* Mobile: hamburger button */}
      <button
        type="button"
        aria-label="Ouvrir le menu"
        onClick={toggle}
        className="md:hidden fixed top-4 left-4 z-40 inline-flex items-center justify-center h-10 w-10 rounded-md bg-white/90 border border-gray-200 shadow-sm text-(--color-text-dark) hover:bg-white focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
      >
        <FiMenu size={20} />
      </button>

      {/* Mobile: overlay drawer */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute left-0 top-0 h-full w-72 max-w-[80%] bg-white shadow-xl border-r border-gray-200 p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`${tsoronaAsmara.className} font-bold text-(--color-primary)`}
              >
                ፊደልፐ ምስ ጽሑፋት
              </h2>
              <button
                type="button"
                aria-label="Fermer le menu"
                onClick={close}
                className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-gray-200 text-(--color-text-dark) hover:bg-gray-50"
              >
                <FiX size={18} />
              </button>
            </div>
            <nav className="space-y-2 w-full mb-4">
              <Link
                href="/"
                className="block rounded-md px-3 py-2 hover:bg-(--color-secondary) text-sm"
                onClick={close}
              >
                Accueil
              </Link>
              <Link
                href="/fonts-demo"
                className="block rounded-md px-3 py-2 hover:bg-(--color-secondary) text-sm"
                onClick={close}
              >
                Fonts demo
              </Link>
              <Link
                href="/editor"
                className="block rounded-md px-3 py-2 hover:bg-(--color-secondary) text-sm"
                onClick={close}
              >
                Editor
              </Link>
              <Link
                href="/aetd"
                className="block rounded-md px-3 py-2 hover:bg-(--color-secondary) text-sm"
                onClick={close}
              >
                AETD Dictionary
              </Link>
            </nav>
            <div className="mt-auto w-full text-center border-t border-gray-200 pt-4 text-xs text-(--color-text-muted)">
              © {new Date().getFullYear()}
            </div>
          </div>
        </div>
      )}

      {/* Desktop: persistent sidebar */}
      <aside className="hidden md:flex md:basis-[20%] shrink-0 bg-white/80 border-r border-gray-200/70 sticky top-0 h-screen p-4 text-(--color-text-dark) flex-col justify-start items-stretch">
        <div className="mb-4">
          <h2
            className={`${tsoronaAsmara.className} font-bold text-(--color-primary)`}
          >
            ፊደልፐ ምስ ጽሑፋት
          </h2>
        </div>
        <nav className="space-y-4 w-full mb-4">
          <Link
            href="/"
            className="block rounded-md px-3 py-2 hover:bg-(--color-secondary) text-sm"
          >
            Accueil
          </Link>
          <Link
            href="/fonts-demo"
            className="block rounded-md px-3 py-2 hover:bg-(--color-secondary) text-sm"
          >
            Fonts demo
          </Link>
          <Link
            href="/editor"
            className="block rounded-md px-3 py-2 hover:bg-(--color-secondary) text-sm"
          >
            Editor
          </Link>
          <Link
            href="/aetd"
            className="block rounded-md px-3 py-2 hover:bg-(--color-secondary) text-sm"
          >
            AETD Dictionary
          </Link>
        </nav>
        <div className="mt-auto w-full text-center border-t border-gray-200/70 pt-4 text-xs text-(--color-text-muted)">
          © {new Date().getFullYear()}
        </div>
      </aside>
    </>
  );
}
