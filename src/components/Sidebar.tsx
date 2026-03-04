"use client";

import { tsoronaAsmara } from "@/lib/fonts";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback, useState } from "react";
import { FiChevronLeft, FiMenu, FiX } from "react-icons/fi";

type NavItem = {
  href: string;
  label: string;
  mobileLabel?: string;
};

export default function Sidebar(): React.ReactElement {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const pathname = usePathname();

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);
  const toggleDesktop = useCallback(() => setDesktopOpen((v) => !v), []);

  const navItems: NavItem[] = [
    { href: "/", label: "Home", mobileLabel: "Home" },
    {
      href: "/fonts-demo",
      label: "Font Library",
      mobileLabel: "Font Library",
    },
    { href: "/geez", label: "Geez Alphabet" },
    { href: "/aetd", label: "AETD Dictionary" },
    { href: "/extract", label: "Text Processing" },
    { href: "/acknowledgement", label: "Acknowledgments" },
    { href: "/about", label: "About" },
  ];

  const isActive = useCallback(
    (href: string) =>
      href === "/" ? pathname === "/" : pathname?.startsWith(href),
    [pathname]
  );

  const navLinkBase =
    "block rounded-md px-3 py-2 text-sm transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-(--color-accent)/30";
  const appTitle = "\u134A\u12F0\u120D\u1350 \u121D\u1235 \u130D\u12A5\u12DD";

  return (
    <>
      {/* Mobile: hamburger button */}
      <button
        type="button"
        aria-label="Open navigation menu"
        onClick={toggleMobile}
        className="md:hidden fixed top-2 left-0 z-40 inline-flex items-center justify-center h-10 w-10 rounded-md bg-transparent text-(--color-text-dark)
        border border-gray-200 shadow-sm  hover:bg-white focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
      >
        <FiMenu size={20} />
      </button>

      {/* Mobile: overlay drawer */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40"
          role="dialog"
          aria-modal="true"
          onClick={closeMobile}
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
                {appTitle}
              </h2>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={closeMobile}
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
                    onClick={closeMobile}
                  >
                    {mobileLabel ?? label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto w-full text-center border-t border-gray-200 pt-4 text-xs text-(--color-text-muted)">
              {"\u00A9"} {new Date().getFullYear()}
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label="Expand sidebar"
        aria-controls="desktop-sidebar"
        aria-expanded={desktopOpen}
        onClick={toggleDesktop}
        className={`${desktopOpen ? "hidden" : "hidden md:inline-flex"} fixed top-3 left-3 z-30 items-center justify-center h-10 w-10 rounded-md bg-white text-(--color-text-dark) border border-gray-200 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-(--color-accent)`}
      >
        <FiMenu size={20} />
      </button>

      {/* Desktop: collapsible sidebar */}
      <aside
        id="desktop-sidebar"
        className={`hidden md:flex shrink-0 bg-white/80 border-r border-gray-200/70 sticky top-0 h-screen text-(--color-text-dark) flex-col justify-start items-stretch transition-all duration-300 ease-out ${
          desktopOpen ? "w-[20rem] p-4" : "w-0 p-0 border-r-0 overflow-hidden"
        }`}
      >
        {desktopOpen && (
          <>
            <div className="mb-4 flex items-start justify-between gap-2">
              <h2
                className={`${tsoronaAsmara.className} text-3xl font-bold text-(--color-primary)`}
              >
                {appTitle}
              </h2>
              <button
                type="button"
                aria-label="Collapse sidebar"
                aria-controls="desktop-sidebar"
                aria-expanded={desktopOpen}
                onClick={toggleDesktop}
                className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-gray-200 text-(--color-text-dark) hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
              >
                <FiChevronLeft size={18} />
              </button>
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
                {"\u00A9"} FidelPE Asmara 2023 - {new Date().getFullYear()}.
              </p>
              <p className="text-gray-400">Built by the FidelPE team.</p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
