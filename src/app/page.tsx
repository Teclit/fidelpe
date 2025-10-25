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
        <main className="card">
            <header className="header">
                <h1 className="font-geez-gothic font-bold text-lg">ፊደልፐ ምስ ጽሑፋት</h1>
                <h1>FidelpeExtractX — Rendre les textes faciles</h1>
                <p className="lead">
                    Cet outil est pour les personnes qui n'utilisent pas souvent les outils numériques.
                    Copiez un texte ou importez une photo (facture, lettre, note). Nous extrayons
                    et simplifions les phrases pour que ce soit plus clair.
                </p>
            </header>

            <form onSubmit={handleProcess} className="">
                <label htmlFor="text" className="label">Votre texte ou image</label>

                <textarea
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Collez le texte ici ou importez une photo/scan."
                    className="textarea"
                />

                <div style={{display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 12}}>
                    <label className="file-label">
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        📁 Importer une photo / un scan
                    </label>

                    <div style={{display: 'flex', gap: 8}}>
                        <button type="submit" disabled={loading} className={`btn btn-primary`}>
                            {loading ? 'Traitement...' : 'Simplifier'}
                        </button>
                        <button type="button" onClick={handleReset} className="btn btn-secondary">
                            Réinitialiser
                        </button>
                    </div>
                </div>
            </form>

            {result && (
                <section className="result">
                    <div className="result-header">
                        <h2 className="text-primary">Texte simplifié</h2>
                        <button onClick={handleCopy} className={`copy-btn ${copied ? 'copied' : ''}`} aria-label={copied ? 'Copié' : 'Copier'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                                <rect x="9" y="9" width="11" height="11" rx="2" />
                                <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                            </svg>
                            {copied ? 'Copié !' : 'Copier'}
                        </button>
                    </div>

                    <pre className="custom-scrollbar">{result}</pre>
                </section>
            )}

            <footer className="app-footer">© {new Date().getFullYear()} FidelpeExtractX — Pour les personnes peu à l'aise avec le numérique.</footer>
        </main>
    );
}
