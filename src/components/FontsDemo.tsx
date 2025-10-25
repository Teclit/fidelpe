'use client';

import React from 'react';

/**
 * Composant de démonstration pour toutes les polices disponibles
 * Utilisez ce composant pour visualiser et tester toutes les polices
 */
export default function FontsDemo() {
    const sampleText = "ፊደልፐ ምስ ጽሑፋት - Sample Text 123";

    const fonts = [
        { name: 'Brana', className: 'font-brana' },
        { name: 'Geez Manuscript', className: 'font-geez-manuscript' },
        { name: 'GF Zemenu', className: 'font-gfzemenu' },
        { name: 'Geez Fantuwua', className: 'font-geez-fantuwua' },
        { name: 'Geez Hiwua', className: 'font-geez-hiwua' },
        { name: 'Geez Jiret', className: 'font-geez-jiret' },
        { name: 'Geez Tint', className: 'font-geez-tint' },
        { name: 'Geez Wookianos', className: 'font-geez-wookianos' },
        { name: 'Geez Yebse', className: 'font-geez-yebse' },
        { name: 'Geez Goffer', className: 'font-geez-goffer' },
        { name: 'Geez Gothic', className: 'font-geez-gothic' },
        { name: 'Geez Zelan', className: 'font-geez-zelan' },
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>
                Démonstration de toutes les polices
            </h1>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {fonts.map((font) => (
                    <div
                        key={font.className}
                        style={{
                            padding: '1rem',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            background: '#fff'
                        }}
                    >
                        <div style={{
                            fontSize: '0.875rem',
                            color: '#666',
                            marginBottom: '0.5rem',
                            fontFamily: 'system-ui'
                        }}>
                            {font.name} <code style={{
                                background: '#f5f5f5',
                                padding: '0.125rem 0.375rem',
                                borderRadius: '3px',
                                fontSize: '0.75rem'
                            }}>
                                .{font.className}
                            </code>
                        </div>
                        <div
                            className={font.className}
                            style={{
                                fontSize: '1.5rem',
                                lineHeight: '1.5'
                            }}
                        >
                            {sampleText}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: '#f9f9f9',
                borderRadius: '8px'
            }}>
                <h3 style={{ marginTop: 0 }}>Comment utiliser :</h3>
                <pre style={{
                    background: '#fff',
                    padding: '1rem',
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '0.875rem'
                }}>
{`// Méthode 1 : Avec className
<h1 className="font-brana">Votre texte</h1>

// Méthode 2 : Avec style inline
<h1 style={{ fontFamily: 'var(--font-brana)' }}>
  Votre texte
</h1>

// Méthode 3 : Import direct
import { brana } from './layout';
<h1 className={brana.className}>Votre texte</h1>`}
                </pre>
            </div>
        </div>
    );
}

