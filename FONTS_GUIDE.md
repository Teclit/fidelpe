# FidelpeExtractX - Guide des Polices

## 🎨 Polices Disponibles

Ce projet inclut **12 polices éthiopiennes** du répertoire RaeyType. Toutes les polices peuvent être utilisées séparément dans votre application.

## 📖 Visualiser les Polices

Pour voir une démonstration de toutes les polices disponibles, accédez à :
```
http://localhost:3001/fonts-demo
```

## 🚀 Utilisation des Polices

### Méthode 1 : Classes CSS Utilitaires (Recommandé)

La méthode la plus simple :

```jsx
<h1 className="font-brana">ፊደልፐ ምስ ጽሑፋት</h1>
<h2 className="font-geez-manuscript">ጽሑፋት በጊዝ መጽሐፍ</h2>
<p className="font-geez-gothic">Texte en Geez Gothic</p>
```

### Méthode 2 : Import Direct depuis Layout

```jsx
import { brana, geezManuscript, geezGothic } from '@/app/layout';

export default function MyComponent() {
    return (
        <>
            <h1 className={brana.className}>ፊደልፐ ምስ ጽሑፋት</h1>
            <h2 className={geezManuscript.className}>Texte en Geez</h2>
            <p className={geezGothic.className}>Texte en Gothic</p>
        </>
    );
}
```

### Méthode 3 : Variables CSS Inline

```jsx
<h1 style={{ fontFamily: 'var(--font-brana)' }}>
    ፊደልፐ ምስ ጽሑፋት
</h1>
<h2 style={{ fontFamily: 'var(--font-geez-manuscript)' }}>
    ጽሑፋት በጊዝ መጽሐፍ
</h2>
```

## 📚 Liste Complète des Polices

| Police | Classe CSS | Variable CSS | Import |
|--------|-----------|--------------|--------|
| Brana | `font-brana` | `var(--font-brana)` | `brana` |
| Geez Manuscript | `font-geez-manuscript` | `var(--font-geez-manuscript)` | `geezManuscript` |
| GF Zemenu | `font-gfzemenu` | `var(--font-gfzemenu)` | `gfzemenu` |
| Geez Fantuwua | `font-geez-fantuwua` | `var(--font-geez-fantuwua)` | `geezFantuwua` |
| Geez Hiwua | `font-geez-hiwua` | `var(--font-geez-hiwua)` | `geezHiwua` |
| Geez Jiret | `font-geez-jiret` | `var(--font-geez-jiret)` | `geezJiret` |
| Geez Tint | `font-geez-tint` | `var(--font-geez-tint)` | `geezTint` |
| Geez Wookianos | `font-geez-wookianos` | `var(--font-geez-wookianos)` | `geezWookianos` |
| Geez Yebse | `font-geez-yebse` | `var(--font-geez-yebse)` | `geezYebse` |
| Geez Goffer | `font-geez-goffer` | `var(--font-geez-goffer)` | `geezGoffer` |
| **Geez Gothic** ⭐ | `font-geez-gothic` | `var(--font-geez-gothic)` | `geezGothic` |
| Geez Zelan | `font-geez-zelan` | `var(--font-geez-zelan)` | `geezZelan` |

⭐ **Geez Gothic** est la police par défaut appliquée à toute l'application.

## 💡 Exemples Pratiques

### Combiner avec Tailwind CSS

```jsx
<h1 className="font-brana text-4xl font-bold text-center">
    ፊደልፐ ምስ ጽሑፋት
</h1>

<p className="font-geez-yebse text-lg leading-relaxed">
    Votre paragraphe avec police Geez Yebse
</p>
```

### Utilisation Conditionnelle

```jsx
const fontClass = isEthiopian ? 'font-brana' : 'font-geez-gothic';

<h1 className={fontClass}>
    {title}
</h1>
```

### Avec des Classes Dynamiques

```jsx
import { useState } from 'react';

export default function FontSelector() {
    const [selectedFont, setSelectedFont] = useState('font-geez-gothic');
    
    return (
        <div>
            <select onChange={(e) => setSelectedFont(e.target.value)}>
                <option value="font-brana">Brana</option>
                <option value="font-geez-manuscript">Geez Manuscript</option>
                <option value="font-geez-gothic">Geez Gothic</option>
            </select>
            
            <h1 className={selectedFont}>
                ፊደልፐ ምስ ጽሑፋት
            </h1>
        </div>
    );
}
```

## 📁 Emplacement des Fichiers

- **Fichiers de polices :** `src/app/fonts/RaeyType/*.ttf`
- **Configuration :** `src/app/layout.tsx`
- **Classes CSS :** `src/app/globals.css` (lignes finales)
- **Composant démo :** `src/components/FontsDemo.tsx`
- **Page démo :** `src/app/fonts-demo/page.tsx`

## 🔧 Configuration Technique

Les polices sont configurées avec :
- `display: 'swap'` pour une meilleure performance
- Variables CSS pour une utilisation flexible
- Exports TypeScript pour une utilisation type-safe
- Classes utilitaires CSS pour une utilisation facile

## ⚠️ Notes Importantes

1. **Police par défaut :** Geez Gothic est appliquée globalement via `layout.tsx`
2. **Performance :** Toutes les polices sont préchargées, ce qui peut affecter le temps de chargement initial
3. **Support des caractères :** Toutes les polices supportent les caractères éthiopiens (guèze)

## 🆘 Besoin d'aide ?

Consultez le composant de démonstration à `/fonts-demo` pour voir toutes les polices en action !

