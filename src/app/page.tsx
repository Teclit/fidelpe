"use client";

import React, {useState, useCallback} from "react";

export default function Home(): React.ReactElement {
    const [text, setText] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const simplifyText = useCallback((input: string) => {
        const collapsed = input.replace(/\s+/g, " ").trim();
        return collapsed
            .split(/(?<=\.)\s+/)
            .map((s) => s.trim())
            .map((s) => (s.length > 200 ? s.slice(0, 197) + "..." : s))
            .join(" ");
    }, []);

    const handleProcess = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) {
            setResult("[Aucun texte fourni]");
            return;
        }
        setLoading(true);
        await new Promise((r) => setTimeout(r, 300));
        setResult(simplifyText(text));
        setLoading(false);
    };

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setText((prev) => `${prev ? `${prev}\n` : ""}[Image: ${file.name}]`);
        }
    }, []);

    const handleReset = useCallback(() => {
        setText("");
        setResult("");
    }, []);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }, [result]);

    return (
        <main className="space-y-4 flex flex-col min-h-full">
            <header className="text-center mb-3">
                <h1 className="font-geez-gothic font-bold text-2xl sm:text-3xl md:text-4xl leading-tight text-[var(--color-primary)] mb-2">ፊደልፐ ምስ ጽሑፋት</h1>
                <h1 className="text-xl sm:text-2xl md:text-3xl leading-tight text-[var(--color-primary)] mb-2">FidelpeExtractX — Rendre les textes faciles</h1>
                <p className="m-0 text-[var(--color-text-muted)] text-sm sm:text-base md:text-lg leading-[1.45]">
                    Cet outil est pour les personnes qui n&rsquo;utilisent pas souvent les outils numériques.
                    Copiez un texte ou importez une photo (facture, lettre, note). Nous extrayons
                    et simplifions les phrases pour que ce soit plus clair.
                </p>
            </header>

            <form onSubmit={handleProcess} className="">
                <label htmlFor="text" className="block font-bold text-[var(--color-primary)] mb-[0.6rem] text-[0.98rem]">Votre texte ou image</label>

                <textarea
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Collez le texte ici ou importez une photo/scan."
                    className="w-full min-h-[12rem] sm:min-h-[14rem] p-3 sm:p-[0.9rem] rounded-[12px] border border-[rgba(54,41,37,0.12)] bg-white text-[var(--color-text-dark)] resize-y shadow-[inset_0_1px_0_rgba(0,0,0,0.02)] text-sm sm:text-base focus:outline focus:outline-[3px] focus:outline-[rgba(133,88,50,0.12)] focus:border-[var(--color-accent-cta)]"
                />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
                    <label className="inline-flex gap-2 items-center justify-center text-center py-[0.6rem] px-[0.9rem] bg-[var(--color-secondary)] border border-[rgba(0,0,0,0.06)] rounded-[12px] cursor-pointer text-[#111827] text-[0.98rem] w-full sm:w-auto">
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        📁 Importer une photo / un scan
                    </label>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-[0.6rem] py-3 px-4 rounded-[12px] font-bold cursor-pointer border-0 text-[0.98rem] bg-gradient-to-b from-[var(--color-accent-cta)] to-[var(--color-accent)] text-white shadow-[0_8px_22px_rgba(133,88,50,0.12)] focus:outline focus:outline-[3px] focus:outline-[rgba(133,88,50,0.14)] disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                            {loading ? 'Traitement...' : 'Simplifier'}
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="inline-flex items-center justify-center gap-[0.6rem] py-3 px-4 rounded-[12px] font-bold cursor-pointer text-[0.98rem] bg-white text-[var(--color-primary)] border border-[rgba(17,24,39,0.06)] disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                            Réinitialiser
                        </button>
                    </div>
                </div>
            </form>

            {result && (
                <section className="mt-4 sm:mt-5">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-[var(--color-primary)]">Texte simplifié</h2>
                        <button
                            onClick={handleCopy}
                            className={`inline-flex items-center gap-2 py-2 px-3 rounded-[10px] font-bold text-white ${copied ? 'bg-[var(--color-primary-two)]' : 'bg-[var(--color-accent)]'}`}
                            aria-label={copied ? 'Copié' : 'Copier'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                                <rect x="9" y="9" width="11" height="11" rx="2" />
                                <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                            </svg>
                            {copied ? 'Copié !' : 'Copier'}
                        </button>
                    </div>

                    <pre className="whitespace-pre-wrap bg-[#fff8f3] p-3 sm:p-4 rounded-[10px] border border-[rgba(17,24,39,0.06)] text-[var(--color-text-dark)] max-h-[50vh] overflow-auto text-sm sm:text-base leading-6">{result}</pre>
                </section>
            )}

            <footer className="text-center text-[var(--color-text-muted)] text-[0.95rem] mt-auto">© {new Date().getFullYear()} FidelpeExtractX — Pour les personnes peu à l&rsquo;aise avec le numérique.</footer>
        </main>
    );
}
