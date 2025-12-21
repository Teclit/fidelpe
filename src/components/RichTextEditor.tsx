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

type Personalization = {
  theme: "light" | "dark";
  fontVar: string; // CSS var name e.g. --font-menbere
  fontSize: number; // px
  lineHeight: number; // unitless
  pageWidth: "narrow" | "normal" | "wide";
  pageSize: "A4" | "Letter";
  orientation: "portrait" | "landscape";
  printMargin: "small" | "normal" | "large";
};

const DEFAULT_PERSO: Personalization = {
  theme: "light",
  fontVar: "--font-menbere",
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

const FONT_OPTIONS: Array<{ label: string; varName: string }> = [
  // RaeyType (from layout.tsx)
  { label: "Brana (RaeyType)", varName: "--font-brana" },
  { label: "Geez Manuscript (RaeyType)", varName: "--font-geez-manuscript" },
  { label: "GF Zemen U (RaeyType)", varName: "--font-gfzemenu" },
  { label: "Geez Fantuwua (RaeyType)", varName: "--font-geez-fantuwua" },
  { label: "Geez Hiwua (RaeyType)", varName: "--font-geez-hiwua" },
  { label: "Geez Jiret (RaeyType)", varName: "--font-geez-jiret" },
  { label: "Geez Tint (RaeyType)", varName: "--font-geez-tint" },
  { label: "Geez Wookianos (RaeyType)", varName: "--font-geez-wookianos" },
  { label: "Geez Yebse (RaeyType)", varName: "--font-geez-yebse" },
  { label: "Geez Goffer (RaeyType)", varName: "--font-geez-goffer" },
  { label: "Geez Gothic (RaeyType)", varName: "--font-geez-gothic" },
  { label: "Geez Zelan (RaeyType)", varName: "--font-geez-zelan" },

  // Google
  { label: "Menbere (Google)", varName: "--font-menbere" },
  { label: "Agbalumo (Google)", varName: "--font-agbalumo" },

  // Noto
  { label: "Noto Sans Ethiopic", varName: "--font-noto-sans-ethiopic" },
  { label: "Noto Serif Ethiopic", varName: "--font-noto-serif-ethiopic" },

  // SIL
  { label: "Abyssinica SIL", varName: "--font-abyssinica-sil" },
  {
    label: "Abyssinica SIL Connected",
    varName: "--font-abyssinica-sil-connected",
  },

  // Wazéma
  {
    label: "Addis Abeba Unicode (Wazéma)",
    varName: "--font-addis-abeba-unicode",
  },
  { label: "Desta Unicode (Wazéma)", varName: "--font-desta-unicode" },
  { label: "Tesfa Unicode (Wazéma)", varName: "--font-tesfa-unicode" },

  // SurGraphics
  { label: "SurGraphics", varName: "--font-surgraphics" },

  // TypeHabesha
  { label: "Loga (TypeHabesha)", varName: "--font-loga" },
  { label: "Loga Display (TypeHabesha)", varName: "--font-loga-display" },
  {
    label: "Habesha Serif Distort (TypeHabesha)",
    varName: "--font-habesha-serif-distort",
  },
  { label: "Zibriqriq (TypeHabesha)", varName: "--font-zibriqriq" },

  // AnbassaDesign
  { label: "Adwa (AnbassaDesign)", varName: "--font-adwa" },
  {
    label: "Adwa Sans Serif (AnbassaDesign)",
    varName: "--font-adwa-sans-serif",
  },
  { label: "Entoto (AnbassaDesign)", varName: "--font-entoto" },
  { label: "Godana (AnbassaDesign)", varName: "--font-godana" },
  { label: "Meaza (AnbassaDesign)", varName: "--font-meaza" },
  { label: "Neteru (AnbassaDesign)", varName: "--font-neteru" },
  { label: "Shiromeda (AnbassaDesign)", varName: "--font-shiromeda" },
  {
    label: "Shiromeda Serif (AnbassaDesign)",
    varName: "--font-shiromeda-serif",
  },
  { label: "Tayitu (AnbassaDesign)", varName: "--font-tayitu" },

  // HaaHu
  { label: "ETH Gofa (HaaHu)", varName: "--font-eth-gofa" },

  // HalwoteHareg
  { label: "HH Lemd Mono (HalwoteHareg)", varName: "--font-hh-lemd-mono" },

  // Qedron
  { label: "Kiros (Qedron)", varName: "--font-kiros" },

  // GeezFonts
  { label: "Geez Pixels 2 (GeezFonts)", varName: "--font-geez-pixels-2" },
  { label: "Geez Digital V1 (GeezFonts)", varName: "--font-geez-digital-v1" },

  // RoadToEthiopia
  { label: "Addis (RoadToEthiopia)", varName: "--font-addis" },
  { label: "Dire Dawa (RoadToEthiopia)", varName: "--font-dire-dawa" },

  // EducationalFonts
  {
    label: "Geez Handwriting (EducationalFonts)",
    varName: "--font-geez-handwriting",
  },

  // BlackFoundry
  { label: "Abba Garima (BlackFoundry)", varName: "--font-abba-garima" },

  // Fixedsys
  { label: "Fixedsys", varName: "--font-fixedsys" },

  // TITUS
  { label: "TITUS Cyberbit Basic", varName: "--font-titus-cyberbit-basic" },

  // YonathanSeyoum
  {
    label: "Habesha Typewriter (YonathanSeyoum)",
    varName: "--font-habesha-typewriter",
  },
  {
    label: "Habesha Stencil (YonathanSeyoum)",
    varName: "--font-habesha-stencil",
  },
  {
    label: "Habesha Pixels (YonathanSeyoum)",
    varName: "--font-habesha-pixels",
  },
  {
    label: "Habesha Blocks (YonathanSeyoum)",
    varName: "--font-habesha-blocks",
  },

  // ZamranStudio
  { label: "Addis Sans (ZamranStudio)", varName: "--font-addis-sans" },
  { label: "Jegena Zamaric (ZamranStudio)", varName: "--font-jegena-zamaric" },
  {
    label: "Jegena Title Zamaric (ZamranStudio)",
    varName: "--font-jegena-title-zamaric",
  },
  { label: "Zamaric (ZamranStudio)", varName: "--font-zamaric" },

  // AdilCreative
  { label: "Adil (AdilCreative)", varName: "--font-adil" },
  { label: "Selam (AdilCreative)", varName: "--font-selam" },

  // DotBoxDesignStudio
  { label: "Ketefa (DotBox)", varName: "--font-ketefa" },
  { label: "Semayawi (DotBox)", varName: "--font-semayawi" },

  // MetaAppz
  { label: "Chiret (MetaAppz)", varName: "--font-chiret" },
  { label: "Seat (MetaAppz)", varName: "--font-seat" },
  { label: "Tera (MetaAppz)", varName: "--font-tera" },

  // Mulat
  { label: "Mulat Abay", varName: "--font-mulat-abay" },
  { label: "Mulat Addis", varName: "--font-mulat-addis" },
  { label: "Mulat Ahmed", varName: "--font-mulat-ahmed" },
  { label: "Mulat Asmara", varName: "--font-mulat-asmara" },
  { label: "Mulat Awash", varName: "--font-mulat-awash" },

  // GNU
  { label: "FreeSerif (GNU)", varName: "--font-free-serif" },

  // Senamirmir
  { label: "Ethiopic Abay (Senamirmir)", varName: "--font-ethiopic-abay" },
  { label: "Ethiopic Lessan (Senamirmir)", varName: "--font-ethiopic-lessan" },
  {
    label: "Ethiopic Le Tewahedo (Senamirmir)",
    varName: "--font-ethiopic-le-tewahedo",
  },
  { label: "Ethiopic Sadiss (Senamirmir)", varName: "--font-ethiopic-sadiss" },
];

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
  const [perso, setPerso] = useState<Personalization>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PERSO);
      return raw ? { ...DEFAULT_PERSO, ...JSON.parse(raw) } : DEFAULT_PERSO;
    } catch {
      return DEFAULT_PERSO;
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

  const saveDocument = useCallback(() => {
    const html = editor?.getHTML() ?? "";
    try {
      localStorage.setItem(STORAGE_KEY_CONTENT, html);
      setSavedAt(Date.now());
    } catch (e) {
      console.error("Save failed", e);
      alert("Save failed. Check storage permissions and retry.");
    }
  }, [editor]);

  // Prefer current editor content when exporting/printing; fall back to saved
  const getHtmlForExport = useCallback((): string => {
    const htmlNow = editor?.getHTML() ?? "";
    // Determine if current content has any visible text
    const tmp = document.createElement("div");
    tmp.innerHTML = htmlNow;
    const textNow = (tmp.textContent || "").trim();
    if (textNow.length > 0) return htmlNow;
    return getSavedHtml();
  }, [editor, getSavedHtml]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PERSO, JSON.stringify(perso));
    } catch {}
  }, [perso]);

  const setFont = useCallback(
    (varName: string) => {
      setPerso((p) => ({ ...p, fontVar: varName }));
      editor?.chain().focus().setFontFamily(`var(${varName})`).run();
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
    // Keep saved copy in sync, but export uses current content if present
    saveDocument();
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
    // Keep saved copy in sync, but export uses current content if present
    saveDocument();
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
    node.style.fontFamily = `var(${perso.fontVar})`;
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
    // Keep saved copy in sync, but export uses current content if present
    saveDocument();
    const html = getHtmlForExport();
    if (!html.trim()) {
      alert("Nothing to export.");
      return;
    }
    const node = buildOffscreenNodeFromSaved(html);
    const bg = perso.theme === "dark" ? "#111827" : "#ffffff";
    // Resolve CSS variable to an actual font-family stack string for capture
    const root = document.documentElement;
    const varValue = getComputedStyle(root)
      .getPropertyValue(perso.fontVar)
      ?.trim();
    const resolvedFont =
      varValue || (node ? getComputedStyle(node).fontFamily : "serif");
    try {
      // Ensure fonts are loaded; skipFonts avoids problematic font parsing/embedding
      type FontFaceSetLike = { ready?: Promise<void> };
      const fonts = (document as Document & { fonts?: FontFaceSetLike }).fonts;
      await fonts?.ready;
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
    // Keep saved copy in sync, but export uses current content if present
    saveDocument();
    const html = getHtmlForExport();
    if (!html.trim()) {
      alert("Nothing to export.");
      return;
    }
    const node = buildOffscreenNodeFromSaved(html);
    const bg = perso.theme === "dark" ? "#111827" : "#ffffff";
    const root = document.documentElement;
    const varValue = getComputedStyle(root)
      .getPropertyValue(perso.fontVar)
      ?.trim();
    const resolvedFont =
      varValue || (node ? getComputedStyle(node).fontFamily : "serif");
    try {
      type FontFaceSetLike = { ready?: Promise<void> };
      const fonts = (document as Document & { fonts?: FontFaceSetLike }).fonts;
      await fonts?.ready;
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
    // Keep saved copy in sync, but print uses current content if present
    saveDocument();
    const html = getHtmlForExport();
    if (!html.trim()) {
      alert("Nothing to print.");
      return;
    }
    // Build/attach a print target container
    const printTarget = document.createElement("div");
    printTarget.className = `print-target ${CONTENT_CLASSES} ${themeClasses}`;
    printTarget.style.fontFamily = `var(${perso.fontVar})`;
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
    const fonts = (document as Document & { fonts?: FontFaceSetLike }).fonts;
    await fonts?.ready;

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
            value={perso.fontVar}
            onChange={(e) => setFont(e.target.value)}
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.varName} value={f.varName}>
                {f.label}
              </option>
            ))}
          </select>

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
            fontFamily: `var(${perso.fontVar})`,
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
