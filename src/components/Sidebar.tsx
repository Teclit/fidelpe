"use client";

import { tsoronaAsmara } from "@/app/page";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

type NavItem = {
  href: string;
  label: string;
  mobileLabel?: string;
};

export default function Sidebar(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: "/", label: "Home", mobileLabel: "Accueil" },
    { href: "/learn-tigrinya", label: "Learn Tigrinya" },
    { href: "/geez", label: "Geez alphabet" },
    { href: "/aetd", label: "AETD Dictionary" },
    { href: "/fonts-demo", label: "Fonts", mobileLabel: "Fonts demo" },
    { href: "/editor", label: "Editor" },
    { href: "/acknowledgement", label: "Acknowledgement" },
    { href: "/about", label: "About" },
  ];

  const isActive = useCallback(
    (href: string) => (href === "/" ? pathname === "/" : pathname?.startsWith(href)),
    [pathname],
  );

  const navLinkBase =
    "block rounded-md px-3 py-2 text-sm transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-(--color-accent)/30";

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
              {navItems.map(({ href, label, mobileLabel }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`${navLinkBase} ${
                      active
                        ? "bg-(--color-accent) text-white shadow-sm hover:bg-(--color-accent)"
                        : "text-(--color-text-dark) hover:bg-(--color-secondary)"
                    }`}
                    onClick={close}
                  >
                    {mobileLabel ?? label}
                  </Link>
                );
              })}
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
            className={`${tsoronaAsmara.className} text-3xl font-bold text-(--color-primary)`}
          >
            ፊደልፐ ምስ ጽሑፋት
          </h2>
        </div>
        <nav className="space-y-4 w-full mb-4">
          {navItems.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`${navLinkBase} ${
                  active
                    ? "bg-(--color-accent) text-white shadow-sm hover:bg-(--color-accent)"
                    : "text-(--color-text-dark) hover:bg-(--color-secondary)"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto w-full text-center border-t border-gray-200/70 pt-4 text-xs text-(--color-text-muted)">
          <p className="mb-2">
            © FidelPE Asmara 2023 - {new Date().getFullYear()}.
          </p>
          <p className="flex items-center justify-center gap-1 text-gray-400">
            Made with
            <svg
              className="w-3.5 h-3.5 text-red-500 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            and code
          </p>
        </div>
      </aside>
    </>
  );
}
