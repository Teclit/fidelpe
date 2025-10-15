'use client'

import React, {useState} from 'react'

export default function Home(): React.ReactElement {
    const [text, setText] = useState<string>('')
    const [result, setResult] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const handleProcess = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simulate processing delay
        await new Promise((r) => setTimeout(r, 400))

        // Simple "simplify" logic: collapse whitespace, trim, shorten long sentences
        const collapsed = text.replace(/\s+/g, ' ').trim()
        const shortened = collapsed
            .split(/(?<=\.)\s+/)
            .map((s) => s.trim())
            .map((s) => (s.length > 200 ? s.slice(0, 197) + '...' : s))
            .join(' ')

        setResult(shortened || '[Aucun texte fourni]')
        setLoading(false)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        // No OCR here: we just append a placeholder referencing the image name
        setText((prev) => prev + (prev ? '\n' : '') + `[Image: ${file.name}]`)
    }

    return (
        <main className="w-full bg-[var(--color-primary-light)] p-10 rounded-lg shadow-lg">
            <header className="mb-4">
                <h1 className="text-3xl font-bold mb-1 text-white">Simple Text Extractor &amp; Simplifier</h1>
                <p className="text-sm text-primary-light opacity-90">
                    Collez du texte ou sélectionnez une image (OCR non implémenté). Cliquez sur&nbsp;
                    &quot;Extraire &amp; Simplifier&quot; pour exécuter la simulation.
                </p>
            </header>

            <form onSubmit={handleProcess} className="flex flex-col gap-3">
                <label className="text-sm font-medium text-primary">Texte</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Collez votre texte ici..."
                    className="w-full h-40 p-3 border rounded resize-vertical custom-scrollbar"
                    style={{borderColor: 'var(--color-gray-light)', background: 'var(--color-white)'}}
                />

                <div className="flex flex-wrap gap-2 items-center">
                    <input type="file" accept="image/*" onChange={handleFileChange}/>

                    <button
                        type="submit"
                        className="px-4 py-2 rounded disabled:opacity-60"
                        style={{backgroundColor: 'var(--color-primary)', color: 'white'}}
                        disabled={loading}
                    >
                        {loading ? 'Traitement...' : 'Extraire &amp; Simplifier'}
                    </button>

                    <button
                        type="button"
                        className="px-3 py-2 border rounded"
                        onClick={() => {
                            setText('')
                            setResult('')
                        }}
                    >
                        Effacer
                    </button>
                </div>
            </form>

            {result && (
                <section className="mt-6">
                    <h2 className="font-semibold text-primary">Résultat</h2>
                    <pre className="whitespace-pre-wrap bg-white p-3 rounded mt-2 border text-primary"
                         style={{borderColor: 'var(--color-gray-light)'}}>
              {result}
            </pre>
                </section>
            )}

            <footer className="mt-6 text-xs text-primary">Powered by your local demo — personnalisé avec globals.css
            </footer>
        </main>
    )
}
