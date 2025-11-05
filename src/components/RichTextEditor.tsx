"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
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

type Personalization = {
  theme: "light" | "dark";
  fontVar: string; // CSS var name e.g. --font-menbere
  fontSize: number; // px
  lineHeight: number; // unitless
  pageWidth: "narrow" | "normal" | "wide";
};

const DEFAULT_PERSO: Personalization = {
  theme: "light",
  fontVar: "--font-menbere",
  fontSize: 18,
  lineHeight: 1.6,
  pageWidth: "normal",
};

const STORAGE_KEY_CONTENT = "editor.document.html";
const STORAGE_KEY_PERSO = "editor.perso";

const FONT_OPTIONS: Array<{ label: string; varName: string }> = [
  { label: "Menbere (Google)", varName: "--font-menbere" },
  { label: "Noto Sans Ethiopic", varName: "--font-noto-sans-ethiopic" },
  { label: "Noto Serif Ethiopic", varName: "--font-noto-serif-ethiopic" },
  { label: "Abyssinica SIL", varName: "--font-abyssinica-sil" },
  { label: "Brana (RaeyType)", varName: "--font-brana" },
  { label: "Geez Gothic (RaeyType)", varName: "--font-geez-gothic" },
  { label: "Addis Sans (Zamran)", varName: "--font-addis-sans" },
];

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
      className={"px-2 py-1 rounded-md border text-sm mr-1 mb-1 transition " +
        (active ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]" : "bg-white hover:bg-gray-50 border-gray-300 text-[var(--color-text-dark)]") +
        (disabled ? " opacity-50 cursor-not-allowed" : "")}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor(): React.ReactElement {
  const [perso, setPerso] = useState<Personalization>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PERSO);
      return raw ? { ...DEFAULT_PERSO, ...JSON.parse(raw) } : DEFAULT_PERSO;
    } catch {
      return DEFAULT_PERSO;
    }
  });

  const initialContent = useMemo(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(STORAGE_KEY_CONTENT) || "<h2>Welcome</h2><p>Start typing your document here…</p>";
  }, []);

  const editor = useEditor({
    extensions: [
  Color.configure({ types: ["textStyle"] }),
  TextStyle,
      FontFamily,
      Underline,
      Highlight,
      Link.configure({ openOnClick: true, autolink: true, protocols: ["http", "https", "mailto"] }),
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
        class: "max-w-none focus:outline-none min-h-[50vh] [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl [&_p]:my-2 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:ml-6 [&_ol]:ml-6",
      },
    },
  });

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

  const themeClasses = perso.theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-[var(--color-text-dark)]";

  const wrapperMaxW = perso.pageWidth === "narrow" ? "max-w-2xl" : perso.pageWidth === "wide" ? "max-w-6xl" : "max-w-4xl";

  const exportHTML = () => {
    const html = editor?.getHTML() ?? "";
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "document.html";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const exportText = () => {
    const text = editor?.getText() ?? "";
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "document.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 mb-3 p-2 rounded-lg border border-[var(--card-border)] bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="flex flex-wrap items-center">
          <ToolbarButton title="Undo" onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo?.()}>↶</ToolbarButton>
          <ToolbarButton title="Redo" onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo?.()}>↷</ToolbarButton>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          <ToolbarButton title="Bold" active={!!editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()}>B</ToolbarButton>
          <ToolbarButton title="Italic" active={!!editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()}><em>I</em></ToolbarButton>
          <ToolbarButton title="Underline" active={!!editor?.isActive("underline")} onClick={() => editor?.chain().focus().toggleUnderline().run()}><u>U</u></ToolbarButton>
          <ToolbarButton title="Strike" active={!!editor?.isActive("strike")} onClick={() => editor?.chain().focus().toggleStrike().run()}><s>S</s></ToolbarButton>
          <ToolbarButton title="Highlight" active={!!editor?.isActive("highlight")} onClick={() => editor?.chain().focus().toggleHighlight().run()}>HL</ToolbarButton>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          <ToolbarButton title="H1" active={!!editor?.isActive("heading", { level: 1 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>H1</ToolbarButton>
          <ToolbarButton title="H2" active={!!editor?.isActive("heading", { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolbarButton>
          <ToolbarButton title="H3" active={!!editor?.isActive("heading", { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolbarButton>
          <ToolbarButton title="Paragraph" active={!!editor?.isActive("paragraph")} onClick={() => editor?.chain().focus().setParagraph().run()}>P</ToolbarButton>

          <ToolbarButton title="Bullet List" active={!!editor?.isActive("bulletList")} onClick={() => editor?.chain().focus().toggleBulletList().run()}>• List</ToolbarButton>
          <ToolbarButton title="Ordered List" active={!!editor?.isActive("orderedList")} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>1. List</ToolbarButton>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          <ToolbarButton title="Align Left" active={!!editor?.isActive({ textAlign: "left" })} onClick={() => editor?.chain().focus().setTextAlign("left").run()}>⟸</ToolbarButton>
          <ToolbarButton title="Align Center" active={!!editor?.isActive({ textAlign: "center" })} onClick={() => editor?.chain().focus().setTextAlign("center").run()}>≡</ToolbarButton>
          <ToolbarButton title="Align Right" active={!!editor?.isActive({ textAlign: "right" })} onClick={() => editor?.chain().focus().setTextAlign("right").run()}>⟹</ToolbarButton>
          <ToolbarButton title="Justify" active={!!editor?.isActive({ textAlign: "justify" })} onClick={() => editor?.chain().focus().setTextAlign("justify").run()}>≣</ToolbarButton>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          <label className="text-xs mr-2">Font</label>
          <select
            className="mr-2 mb-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
            value={perso.fontVar}
            onChange={(e) => setFont(e.target.value)}
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.varName} value={f.varName}>{f.label}</option>
            ))}
          </select>

          <label className="text-xs mr-2">Size</label>
          <input
            type="number"
            className="w-16 mr-2 mb-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
            value={perso.fontSize}
            onChange={(e) => setPerso((p) => ({ ...p, fontSize: Math.max(10, Math.min(72, Number(e.target.value) || 16)) }))}
          />

          <label className="text-xs mr-2">Line</label>
          <input
            type="number"
            step="0.1"
            className="w-16 mr-2 mb-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
            value={perso.lineHeight}
            onChange={(e) => setPerso((p) => ({ ...p, lineHeight: Math.max(1, Math.min(3, Number(e.target.value) || 1.6)) }))}
          />

          <label className="text-xs mr-2">Width</label>
          <select
            className="mr-2 mb-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
            value={perso.pageWidth}
            onChange={(e) => setPerso((p) => ({ ...p, pageWidth: e.target.value as Personalization["pageWidth"] }))}
          >
            <option value="narrow">Narrow</option>
            <option value="normal">Normal</option>
            <option value="wide">Wide</option>
          </select>

          <div className="ml-auto flex items-center">
            <button
              type="button"
              className="px-3 py-1 mr-2 rounded-md border border-gray-300 bg-white text-sm"
              onClick={exportHTML}
            >Export HTML</button>
            <button
              type="button"
              className="px-3 py-1 mr-2 rounded-md border border-gray-300 bg-white text-sm"
              onClick={exportText}
            >Export TXT</button>
            <button
              type="button"
              className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm"
              onClick={() => window.print()}
            >Print</button>

            <div className="w-px h-6 bg-gray-200 mx-2" />

            <button
              type="button"
              className="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm"
              onClick={() => setPerso((p) => ({ ...p, theme: p.theme === "light" ? "dark" : "light" }))}
            >{perso.theme === "light" ? "Dark" : "Light"} Theme</button>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className={`mx-auto ${wrapperMaxW} shadow-sm rounded-xl border border-[var(--card-border)] overflow-hidden`}> 
        <div
          className={`${themeClasses} p-4 sm:p-6`}
          style={{
            fontFamily: `var(${perso.fontVar})`,
          }}
        >
          <div className="min-h-[60vh]" style={{ fontSize: perso.fontSize, lineHeight: perso.lineHeight }}>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}
