"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import to ensure TipTap only runs on the client
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { ssr: false });

export default function EditorPage(): React.ReactElement {
  return (
    <div className="w-full h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-(--color-primary)">Document Editor</h1>
        <p className="text-sm text-(--color-text-muted)">Write, format, and personalize your text like Word.</p>
      </div>
      <RichTextEditor />
    </div>
  );
}
