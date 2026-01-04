"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import FontFamily from "@tiptap/extension-font-family";
import * as htmlToImage from "html-to-image";

type LoadedFont = {
  path: string;
  city: string;
  file: string;
  family: string;
  subfamily: string;
  full_name: string;
  faceName: string;
};

type RawFont = Partial<LoadedFont> & {
  path?: string;
  file?: string;
};

type Personalization = {
  theme: "light" | "dark";
  fontFamily: string; // font-family name derived from public/fonts
  fontSize: number; // px
  lineHeight: number; // unitless
  pageWidth: "narrow" | "normal" | "wide";
  pageSize: "A4" | "Letter";
  orientation: "portrait" | "landscape";
  printMargin: "small" | "normal" | "large";
};

const DEFAULT_PERSO: Personalization = {
  theme: "light",
  fontFamily: "",
  fontSize: 18,
  lineHeight: 1.6,
  pageWidth: "normal",
  pageSize: "A4",
  orientation: "portrait",
  printMargin: "normal",
};

const STORAGE_KEY_CONTENT = "editor.document.html";
const STORAGE_KEY_PERSO = "editor.perso";
// Legacy default template we used previously; treat it as empty to avoid exporting it
const DEFAULT_TEMPLATE_HTML =
  "<h2>Welcome</h2><p>Start typing your document here…</p>";

// Keep content rendering consistent between on-screen, export, and print
const CONTENT_CLASSES =
  "max-w-none focus:outline-none min-h-[50vh] [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl [&_p]:my-2 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:ml-6 [&_ol]:ml-6";

const sanitizeFontFaceName = (str: string): string => {
  return "Geez_" + str.replace(/[^a-zA-Z0-9_\-]/g, "_");
};

// Font size controls
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 300; // practical upper bound; browsers can render larger but this keeps UI sane
const SIZE_PRESETS: number[] = [
  12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72, 96, 120, 144, 192, 240, 300,
];
const clampSize = (val: number) =>
  Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, val));

// Line-height controls
const MIN_LINE = 0.8;
const MAX_LINE = 10;
const LINE_PRESETS: number[] = [1.0, 1.2, 1.4, 1.6, 2, 2.5, 3, 4, 5, 6, 8, 10];
const clampLine = (val: number) => Math.max(MIN_LINE, Math.min(MAX_LINE, val));

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={
        "px-2 py-1 rounded-md border text-sm mr-1 mb-1 transition " +
        (active
          ? "bg-(--color-accent) text-white border-(--color-accent)"
          : "bg-white hover:bg-gray-50 border-gray-300 text-(--color-text-dark)") +
        (disabled ? " opacity-50 cursor-not-allowed" : "")
      }
    >
      {children}
    </button>
  );
}

export default function RichTextEditor(): React.ReactElement {
  const captureRef = useRef<HTMLDivElement | null>(null);
  const [fonts, setFonts] = useState<LoadedFont[]>([]);
  const [fontsLoading, setFontsLoading] = useState<boolean>(true);
  const [fontsError, setFontsError] = useState<string | null>(null);
  const [perso, setPerso] = useState<Personalization>(() => {
    const base = { ...DEFAULT_PERSO };
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PERSO);
      if (!raw) return base;
      const parsed = JSON.parse(raw);
      const fontFamily = parsed.fontFamily || parsed.fontVar || base.fontFamily;
      return { ...base, ...parsed, fontFamily };
    } catch {
      return base;
    }
  });
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const initialContent = useMemo(() => {
    if (typeof window === "undefined") return "";
    const stored = localStorage.getItem(STORAGE_KEY_CONTENT);
    if (!stored) return "";
    // If stored value equals the old default template, ignore it
    if (stored.trim() === DEFAULT_TEMPLATE_HTML) return "";
    return stored;
  }, []);

  const getSavedHtml = useCallback((): string => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONTENT) || "";
      if (stored.trim() === DEFAULT_TEMPLATE_HTML) return "";
      return stored;
    } catch {
      return "";
    }
  }, []);

  const hasVisibleContent = useCallback((html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return (tmp.textContent || "").trim().length > 0;
  }, []);

  const persistContent = useCallback(
    (html: string, opts?: { silent?: boolean }) => {
      try {
        localStorage.setItem(STORAGE_KEY_CONTENT, html);
        setSavedAt(Date.now());
      } catch (e) {
        console.error("Save failed", e);
        if (!opts?.silent) {
          alert("Save failed. Check storage permissions and retry.");
        }
      }
    },
    []
  );

  useEffect(() => {
    let active = true;
    setFontsLoading(true);
    setFontsError(null);

    fetch("/fonts.min.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch fonts.min.json (${res.status})`);
        }
        return res.json();
      })
      .then((data: { fonts?: RawFont[] }) => {
        if (!active) return;
        const rawFonts = Array.isArray(data.fonts) ? data.fonts : [];
        const list: LoadedFont[] = rawFonts.map((f) => {
          const fileName = (f.file || f.path || "")?.replace(/\.ttf$/i, "");
          return {
            path: f.path ?? "",
            city: f.city ?? "",
            file: f.file ?? fileName ?? "",
            family: f.family ?? f.full_name ?? f.file ?? fileName ?? "",
            subfamily: f.subfamily ?? "",
            full_name: f.full_name ?? "",
            faceName: sanitizeFontFaceName(fileName || "unknown"),
          };
        });
        setFonts(list);
        setFontsError(
          list.length === 0 ? "No fonts found in fonts.min.json" : null
        );
        setFontsLoading(false);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message =
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : "Unable to load fonts";
        setFonts([]);
        setFontsLoading(false);
        setFontsError(message);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!fonts.length) return;
    const styleId = "richtext-editor-fonts";
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = fonts
      .map(
        (f) =>
          `@font-face { font-family: '${f.faceName}'; src: url('/${f.path}') format('truetype'); font-weight: 400; font-style: normal; font-display: swap; }`
      )
      .join("\n");

    return () => {
      styleEl?.remove();
    };
  }, [fonts]);

  useEffect(() => {
    if (!fonts.length) return;
    setPerso((p) => {
      const hasCurrent =
        p.fontFamily && fonts.some((f) => f.faceName === p.fontFamily);
      const nextFont = hasCurrent ? p.fontFamily : fonts[0].faceName;
      if (nextFont === p.fontFamily) return p;
      return { ...p, fontFamily: nextFont };
    });
  }, [fonts]);

  const editor = useEditor({
    // Prevent SSR hydration mismatches per TipTap guidance
    immediatelyRender: false,
    extensions: [
      Color.configure({ types: ["textStyle"] }),
      TextStyle,
      FontFamily,
      Underline,
      Highlight,
      Link.configure({
        openOnClick: true,
        autolink: true,
        protocols: ["http", "https", "mailto"],
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Type here…" }),
      StarterKit.configure({
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
        heading: { levels: [1, 2, 3, 4] },
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      try {
        localStorage.setItem(STORAGE_KEY_CONTENT, html);
      } catch {}
    },
    editorProps: {
      attributes: {
        class: CONTENT_CLASSES,
      },
    },
  });

  useEffect(() => {
    if (!editor || !perso.fontFamily) return;
    editor.chain().focus().setFontFamily(`'${perso.fontFamily}'`).run();
  }, [editor, perso.fontFamily]);

  const saveDocument = useCallback(() => {
    const html = editor?.getHTML() ?? "";
    persistContent(html);
  }, [editor, persistContent]);

  const getHtmlForExport = useCallback((): string => {
    const htmlNow = editor?.getHTML() ?? "";
    const html = hasVisibleContent(htmlNow) ? htmlNow : getSavedHtml();
    if (html.trim()) {
      // Save whatever we are about to output so localStorage stays in sync
      persistContent(html, { silent: true });
    }
    return html;
  }, [editor, getSavedHtml, hasVisibleContent, persistContent]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PERSO, JSON.stringify(perso));
    } catch {}
  }, [perso]);

  const setFont = useCallback(
    (faceName: string) => {
      setPerso((p) => ({ ...p, fontFamily: faceName }));
      editor?.chain().focus().setFontFamily(`'${faceName}'`).run();
    },
    [editor]
  );

  const themeClasses =
    perso.theme === "dark"
      ? "bg-gray-900 text-gray-100"
      : "bg-white text-(--color-text-dark)";

  const wrapperMaxW =
    perso.pageWidth === "narrow"
      ? "max-w-2xl"
      : perso.pageWidth === "wide"
      ? "max-w-6xl"
      : "max-w-4xl";

  const exportHTML = () => {
    const html = getHtmlForExport();
    if (!html.trim()) {
      alert("Nothing to export.");
      return;
    }
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "document.html";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const exportText = () => {
    const tmpHtml = getHtmlForExport();
    const tempEl = document.createElement("div");
    tempEl.innerHTML = tmpHtml;
    const text = tempEl.textContent?.trim() || "";
    if (!text) {
      alert("Nothing to export.");
      return;
    }
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "document.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const buildOffscreenNodeFromSaved = (savedHtml: string): HTMLDivElement => {
    const node = document.createElement("div");
    node.className = `${CONTENT_CLASSES} ${themeClasses} p-4 sm:p-6`;
    node.style.fontFamily = perso.fontFamily
      ? `'${perso.fontFamily}', serif`
      : "serif";
    node.style.fontSize = `${perso.fontSize}px`;
    node.style.lineHeight = String(perso.lineHeight);
    node.style.position = "fixed";
    node.style.left = "-99999px";
    node.style.top = "-99999px";
    node.style.pointerEvents = "none";
    node.style.width = captureRef.current
      ? `${captureRef.current.clientWidth}px`
      : "auto";
    node.innerHTML = savedHtml;
    document.body.appendChild(node);
    return node;
  };

  const exportPng = async () => {
    const html = getHtmlForExport();
    if (!html.trim()) {
      alert("Nothing to export.");
      return;
    }
    const node = buildOffscreenNodeFromSaved(html);
    const bg = perso.theme === "dark" ? "#111827" : "#ffffff";
    const resolvedFont = perso.fontFamily
      ? `'${perso.fontFamily}', serif`
      : node
      ? getComputedStyle(node).fontFamily
      : "serif";
    try {
      // Ensure fonts are loaded; skipFonts avoids problematic font parsing/embedding
      type FontFaceSetLike = { ready?: Promise<void> };
      const fontSet = (document as Document & { fonts?: FontFaceSetLike })
        .fonts;
      await fontSet?.ready;
      const dataUrl = await htmlToImage.toPng(node, {
        backgroundColor: bg,
        cacheBust: true,
        pixelRatio: 2,
        skipFonts: true,
        style: {
          fontFamily: resolvedFont,
          // Ensure consistent DPI sizing
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "document.png";
      a.click();
      node.remove();
    } catch (err) {
      console.error("Export PNG failed", err);
      alert("Export PNG failed. Try changing font or theme, then retry.");
      node.remove();
    }
  };

  const exportJpeg = async () => {
    const html = getHtmlForExport();
    if (!html.trim()) {
      alert("Nothing to export.");
      return;
    }
    const node = buildOffscreenNodeFromSaved(html);
    const bg = perso.theme === "dark" ? "#111827" : "#ffffff";
    const resolvedFont = perso.fontFamily
      ? `'${perso.fontFamily}', serif`
      : node
      ? getComputedStyle(node).fontFamily
      : "serif";
    try {
      type FontFaceSetLike = { ready?: Promise<void> };
      const fontSet = (document as Document & { fonts?: FontFaceSetLike })
        .fonts;
      await fontSet?.ready;
      const dataUrl = await htmlToImage.toJpeg(node, {
        backgroundColor: bg,
        cacheBust: true,
        quality: 0.95,
        pixelRatio: 2,
        skipFonts: true,
        style: {
          fontFamily: resolvedFont,
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "document.jpg";
      a.click();
      node.remove();
    } catch (err) {
      console.error("Export JPG failed", err);
      alert("Export JPG failed. Try changing font or theme, then retry.");
      // ensure cleanup
      if (document.body.contains(node)) {
        node.remove();
      }
    }
  };

  const printSaved = async () => {
    const html = getHtmlForExport();
    if (!html.trim()) {
      alert("Nothing to print.");
      return;
    }
    // Build/attach a print target container
    const printTarget = document.createElement("div");
    printTarget.className = `print-target ${CONTENT_CLASSES} ${themeClasses}`;
    printTarget.style.fontFamily = perso.fontFamily
      ? `'${perso.fontFamily}', serif`
      : "serif";
    printTarget.style.fontSize = `${perso.fontSize}px`;
    printTarget.style.lineHeight = String(perso.lineHeight);
    printTarget.style.padding = "24px";
    printTarget.innerHTML = html;
    document.body.appendChild(printTarget);

    // Inject print stylesheet to isolate target and set page options
    const style = document.createElement("style");
    const marginMap: Record<Personalization["printMargin"], string> = {
      small: "8mm",
      normal: "15mm",
      large: "25mm",
    };
    const pageSize = perso.pageSize === "A4" ? "A4" : "Letter";
    const orientation =
      perso.orientation === "landscape" ? "landscape" : "portrait";
    const margin = marginMap[perso.printMargin];
    style.setAttribute("data-print-style", "true");
    style.textContent = `
      @page { size: ${pageSize} ${orientation}; margin: ${margin}; }
      @media print {
        body * { visibility: hidden !important; }
        .print-target, .print-target * { visibility: visible !important; }
        .print-target { position: absolute; left: 0; top: 0; width: 100%; }
      }
    `;
    document.head.appendChild(style);

    // Ensure fonts are loaded before print
    type FontFaceSetLike = { ready?: Promise<void> };
    const fontSet = (document as Document & { fonts?: FontFaceSetLike }).fonts;
    await fontSet?.ready;

    // Trigger print and cleanup afterwards
    const cleanup = () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
      if (document.body.contains(printTarget)) {
        document.body.removeChild(printTarget);
      }
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  };

  // Ctrl/Cmd+S to save
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isSave = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s";
      if (isSave) {
        e.preventDefault();
        saveDocument();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [saveDocument]);

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 mb-3 p-2 rounded-lg border border-(--card-border) bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/70">
        <div className="flex flex-wrap items-center">
          <ToolbarButton
            title="Undo"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().undo?.()}
          >
            ↶
          </ToolbarButton>
          <ToolbarButton
            title="Redo"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().redo?.()}
          >
            ↷
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          <ToolbarButton
            title="Bold"
            active={!!editor?.isActive("bold")}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            B
          </ToolbarButton>
          <ToolbarButton
            title="Italic"
            active={!!editor?.isActive("italic")}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton
            title="Underline"
            active={!!editor?.isActive("underline")}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          >
            <u>U</u>
          </ToolbarButton>
          <ToolbarButton
            title="Strike"
            active={!!editor?.isActive("strike")}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          >
            <s>S</s>
          </ToolbarButton>
          <ToolbarButton
            title="Highlight"
            active={!!editor?.isActive("highlight")}
            onClick={() => editor?.chain().focus().toggleHighlight().run()}
          >
            HL
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          <ToolbarButton
            title="H1"
            active={!!editor?.isActive("heading", { level: 1 })}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            title="H2"
            active={!!editor?.isActive("heading", { level: 2 })}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            title="H3"
            active={!!editor?.isActive("heading", { level: 3 })}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            H3
          </ToolbarButton>
          <ToolbarButton
            title="Paragraph"
            active={!!editor?.isActive("paragraph")}
            onClick={() => editor?.chain().focus().setParagraph().run()}
          >
            P
          </ToolbarButton>

          <ToolbarButton
            title="Bullet List"
            active={!!editor?.isActive("bulletList")}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            • List
          </ToolbarButton>
          <ToolbarButton
            title="Ordered List"
            active={!!editor?.isActive("orderedList")}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            1. List
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          <ToolbarButton
            title="Align Left"
            active={!!editor?.isActive({ textAlign: "left" })}
            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          >
            ⟸
          </ToolbarButton>
          <ToolbarButton
            title="Align Center"
            active={!!editor?.isActive({ textAlign: "center" })}
            onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          >
            ≡
          </ToolbarButton>
          <ToolbarButton
            title="Align Right"
            active={!!editor?.isActive({ textAlign: "right" })}
            onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          >
            ⟹
          </ToolbarButton>
          <ToolbarButton
            title="Justify"
            active={!!editor?.isActive({ textAlign: "justify" })}
            onClick={() =>
              editor?.chain().focus().setTextAlign("justify").run()
            }
          >
            ≣
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          <label className="text-xs mr-2">Font</label>
          <select
            className="mr-2 mb-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
            value={perso.fontFamily}
            onChange={(e) => {
              if (e.target.value) setFont(e.target.value);
            }}
            disabled={fontsLoading || !fonts.length}
          >
            <option value="" disabled>
              {fontsLoading ? "Loading fonts..." : "Select a font"}
            </option>
            {fonts.map((f) => (
              <option key={f.faceName} value={f.faceName}>
                {f.family || f.full_name || f.file || f.faceName}
              </option>
            ))}
          </select>
          {fontsError && (
            <span
              className="text-xs text-red-600 mr-2"
              title={fontsError || undefined}
            >
              Fonts unavailable
            </span>
          )}

          <label className="text-xs mr-2">Size</label>
          <input
            type="number"
            min={MIN_FONT_SIZE}
            max={MAX_FONT_SIZE}
            step={1}
            className="w-20 mr-2 mb-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
            value={perso.fontSize}
            onChange={(e) =>
              setPerso((p) => ({
                ...p,
                fontSize: clampSize(Number(e.target.value) || 16),
              }))
            }
            aria-label="Font size (px)"
          />
          <button
            type="button"
            className="px-2 py-1 mr-1 rounded-md border border-gray-300 bg-white text-sm"
            onClick={() =>
              setPerso((p) => ({ ...p, fontSize: clampSize(p.fontSize - 2) }))
            }
            title="Decrease font size"
          >
            A-
          </button>
          <button
            type="button"
            className="px-2 py-1 mr-2 rounded-md border border-gray-300 bg-white text-sm"
            onClick={() =>
              setPerso((p) => ({ ...p, fontSize: clampSize(p.fontSize + 2) }))
            }
            title="Increase font size"
          >
            A+
          </button>
          <input
            type="range"
            min={MIN_FONT_SIZE}
            max={MAX_FONT_SIZE}
            step={1}
            value={perso.fontSize}
            onChange={(e) =>
              setPerso((p) => ({
                ...p,
                fontSize: clampSize(Number(e.target.value) || p.fontSize),
              }))
            }
            className="w-40 h-2 mr-2 mb-1 cursor-pointer"
            aria-label="Font size slider"
          />
          <select
            className="mr-2 mb-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
            value={
              SIZE_PRESETS.includes(perso.fontSize)
                ? String(perso.fontSize)
                : ""
            }
            onChange={(e) => {
              const v = Number(e.target.value);
              if (!isNaN(v))
                setPerso((p) => ({ ...p, fontSize: clampSize(v) }));
            }}
            aria-label="Font size presets"
          >
            <option value="" disabled>
              Preset
            </option>
            {SIZE_PRESETS.map((s) => (
              <option key={s} value={String(s)}>
                {s}px
              </option>
            ))}
          </select>

          <label className="text-xs mr-2">Line</label>
          <input
            type="number"
            min={MIN_LINE}
            max={MAX_LINE}
            step={0.1}
            className="w-20 mr-2 mb-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
            value={perso.lineHeight}
            onChange={(e) =>
              setPerso((p) => ({
                ...p,
                lineHeight: clampLine(Number(e.target.value) || p.lineHeight),
              }))
            }
            aria-label="Line height"
          />
          <button
            type="button"
            className="px-2 py-1 mr-1 rounded-md border border-gray-300 bg-white text-sm"
            onClick={() =>
              setPerso((p) => ({
                ...p,
                lineHeight: clampLine(
                  parseFloat((p.lineHeight - 0.1).toFixed(2))
                ),
              }))
            }
            title="Decrease line height"
          >
            −
          </button>
          <button
            type="button"
            className="px-2 py-1 mr-2 rounded-md border border-gray-300 bg-white text-sm"
            onClick={() =>
              setPerso((p) => ({
                ...p,
                lineHeight: clampLine(
                  parseFloat((p.lineHeight + 0.1).toFixed(2))
                ),
              }))
            }
            title="Increase line height"
          >
            +
          </button>
          <input
            type="range"
            min={MIN_LINE}
            max={MAX_LINE}
            step={0.1}
            value={perso.lineHeight}
            onChange={(e) =>
              setPerso((p) => ({
                ...p,
                lineHeight: clampLine(Number(e.target.value) || p.lineHeight),
              }))
            }
            className="w-40 h-2 mr-2 mb-1 cursor-pointer"
            aria-label="Line height slider"
          />
          <select
            className="mr-2 mb-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
            value={
              LINE_PRESETS.includes(Number(perso.lineHeight.toFixed(1)))
                ? String(Number(perso.lineHeight.toFixed(1)))
                : ""
            }
            onChange={(e) => {
              const v = Number(e.target.value);
              if (!isNaN(v))
                setPerso((p) => ({ ...p, lineHeight: clampLine(v) }));
            }}
            aria-label="Line height presets"
          >
            <option value="" disabled>
              Preset
            </option>
            {LINE_PRESETS.map((lh) => (
              <option key={lh} value={String(lh)}>
                {lh}
              </option>
            ))}
          </select>

          <label className="text-xs mr-2">Width</label>
          <select
            className="mr-2 mb-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
            value={perso.pageWidth}
            onChange={(e) =>
              setPerso((p) => ({
                ...p,
                pageWidth: e.target.value as Personalization["pageWidth"],
              }))
            }
          >
            <option value="narrow">Narrow</option>
            <option value="normal">Normal</option>
            <option value="wide">Wide</option>
          </select>

          <div className="ml-auto flex items-center">
            <button
              type="button"
              className="px-3 py-1 mr-2 rounded-md border border-gray-300 bg-white text-sm"
              onClick={saveDocument}
            >
              Save
            </button>
            {savedAt && (
              <span className="text-xs text-(--color-text-muted) mr-2">
                Saved ✓
              </span>
            )}
            <button
              type="button"
              className="px-3 py-1 mr-2 rounded-md border border-gray-300 bg-white text-sm"
              onClick={exportHTML}
            >
              Export HTML
            </button>
            <button
              type="button"
              className="px-3 py-1 mr-2 rounded-md border border-gray-300 bg-white text-sm"
              onClick={exportText}
            >
              Export TXT
            </button>
            <button
              type="button"
              className="px-3 py-1 mr-2 rounded-md border border-gray-300 bg-white text-sm"
              onClick={exportPng}
            >
              Export PNG
            </button>
            <button
              type="button"
              className="px-3 py-1 mr-2 rounded-md border border-gray-300 bg-white text-sm"
              onClick={exportJpeg}
            >
              Export JPG
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm"
              onClick={printSaved}
            >
              Print
            </button>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            <button
              type="button"
              className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm"
              onClick={() =>
                setPerso((p) => ({
                  ...p,
                  theme: p.theme === "light" ? "dark" : "light",
                }))
              }
            >
              {perso.theme === "light" ? "Dark" : "Light"} Theme
            </button>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div
        className={`mx-auto ${wrapperMaxW} shadow-sm rounded-xl border border-(--card-border) overflow-hidden`}
      >
        <div
          ref={captureRef}
          className={`${themeClasses} p-4 sm:p-6`}
          style={{
            fontFamily: perso.fontFamily
              ? `'${perso.fontFamily}', serif`
              : undefined,
          }}
        >
          <div
            className="min-h-[60vh]"
            style={{ fontSize: perso.fontSize, lineHeight: perso.lineHeight }}
          >
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}
