"use client";

import React, {useState, useCallback} from "react";

export default function Home(): React.ReactElement {
    const [text, setText] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    // --- Text Simplification Logic ---
    const simplifyText = useCallback((input: string) => {
        const collapsed = input.replace(/\s+/g, " ").trim();
        return collapsed
            .split(/(?<=\.)\s+/)
            .map((sentence) => sentence.trim())
            .map((sentence) =>
                sentence.length > 200 ? sentence.slice(0, 197) + "..." : sentence
            )
            .join(" ");
    }, []);

    // --- Handle Submit ---
    const handleProcess = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) {
            setResult("[Aucun texte fourni]");
            return;
        }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 300)); // simulate delay
        setResult(simplifyText(text));
        setLoading(false);
    };

    // --- Handle File Input ---
    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                setText((prev) => `${prev ? `${prev}\n` : ""}[Image: ${file.name}]`);
            }
        },
        []
    );

    // --- Handle Reset ---
    const handleReset = useCallback(() => {
        setText("");
        setResult("");
    }, []);

    // --- Handle Copy ---
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }, [result]);

    return (
        <main
            className="w-full min-h-screen flex items-center justify-center bg-transparent px-4 py-10">
            <div
                className="w-full max-w-3xl bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-10 flex flex-col">
                {/* Header */}
                <header className="text-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                        FidelpeExtractX — Simplifier vos documents facilement
                    </h1>
                    <p className="text-secondary text-sm sm:text-base leading-relaxed">
                        Collez un texte ou importez une photo/scan d&#39;un document. Nous allons
                        extraire le texte et le rendre plus simple à lire, en phrases courtes
                        et claires. Pas besoin d&#39;être expert en informatique.
                    </p>
                </header>

                {/* Form */}
                <form onSubmit={handleProcess} className="flex flex-col gap-4 w-full">
                    <label htmlFor="text" className="text-primary">
                        Votre texte ou image
                    </label>

                    <textarea
                        id="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Collez votre texte ici, ou cliquez sur 'Importer une photo' pour ajouter une image ou un scan"
                        className="w-full h-40 sm:h-52 md:h-64 p-3 border rounded-lg resize-y text-primary
                       border-[#030769]  focus:ring-1 focus:ring-[#010F39FF]  transition"
                    />

                    {/* Buttons & File Input */}
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 items-center">
                        <div className="flex items-center gap-3">
                            <label
                                className="cursor-pointer bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <span className="text-sm text-gray-700">📁 Importer une photo ou un scan</span>
                            </label>
                        </div>

                        <div className="flex gap-3 flex-wrap">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                           disabled:opacity-60 transition-all shadow-sm active:scale-95"
                            >
                                {loading ? "Traitement..." : "Simplifier le texte"}
                            </button>

                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-5 py-2 border border-gray-400 rounded-lg text-gray-700
                           hover:bg-gray-100 transition-all active:scale-95"
                            >
                                Tout effacer
                            </button>
                        </div>
                    </div>
                </form>

                {/* Result Section */}
                {result && (
                    <section className="mt-8">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-semibold text-primary">Texte simplifié</h2>

                            {/* Copy button */}
                            <button
                                type="button"
                                onClick={handleCopy}
                                aria-label={copied ? "Copié" : "Copier"}
                                className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg shadow-sm transition-all active:scale-95 
                  ${copied ? "bg-green-600" : "bg-[#010F39FF] hover:bg-blue-700"} text-white`}
                            >
                                {/* Inline SVG copy icon (accessible, uses currentColor) */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                    focusable="false"
                                >
                                    <rect x="9" y="9" width="11" height="11" rx="2"/>
                                    <path d="M5 15V5a2 2 0 0 1 2-2h10"/>
                                </svg>
                                {copied ? "Copié !" : "Copier"}
                            </button>
                        </div>

                        <pre
                            className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-800
                         overflow-auto max-h-[50vh] text-sm sm:text-base leading-relaxed"
                        >
              {result}
            </pre>
                    </section>
                )}

                {/* Footer */}
                <footer className="mt-8 text-center text-xs text-gray-500">
                    © {new Date().getFullYear()} FidelpeExtractX — Conçu pour les personnes peu à l'aise avec le
                    numérique.
                </footer>
            </div>
        </main>
    );
}
