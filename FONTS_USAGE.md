# Guide d'utilisation des polices

Toutes les polices du répertoire RaeyType sont maintenant disponibles séparément dans votre application.

## Polices disponibles

1. **Brana** - `--font-brana`
2. **Geez Manuscript** - `--font-geez-manuscript`
3. **GF Zemenu** - `--font-gfzemenu`
4. **Geez Fantuwua** - `--font-geez-fantuwua`
5. **Geez Hiwua** - `--font-geez-hiwua`
6. **Geez Jiret** - `--font-geez-jiret`
7. **Geez Tint** - `--font-geez-tint`
8. **Geez Wookianos** - `--font-geez-wookianos`
9. **Geez Yebse** - `--font-geez-yebse`
10. **Geez Goffer** - `--font-geez-goffer`
11. **Geez Gothic** - `--font-geez-gothic` (police par défaut)
12. **Geez Zelan** - `--font-geez-zelan`

## Comment utiliser les polices

### Méthode 1 : Avec CSS (via les variables CSS)

Dans votre fichier `globals.css` :

```css
.font-brana {
    font-family: var(--font-brana);
}

.font-geez {
    font-family: var(--font-geez-manuscript);
}

.font-gfzemenu {
    font-family: var(--font-gfzemenu);
}

.font-geez-fantuwua {
    font-family: var(--font-geez-fantuwua);
}

/* etc. pour les autres polices */
```

Puis dans votre JSX :
```jsx
<h1 className="font-brana">ፊደልፐ ምስ ጽሑፋት</h1>
<p className="font-geez">Texte en Geez Manuscript</p>
```

### Méthode 2 : Directement dans le composant (Importation)

Dans `page.tsx`, vous pouvez importer les polices depuis le layout :

1. D'abord, exportez les polices dans `layout.tsx` :
```typescript
export { brana, geezManuscript, geezGothic, /* etc */ }
```

2. Puis utilisez-les dans `page.tsx` :
```jsx
import { brana, geezManuscript } from './layout';

<h1 className={brana.className}>Texte avec Brana</h1>
<h2 className={geezManuscript.className}>Texte avec Geez Manuscript</h2>
```

### Méthode 3 : Inline style avec les variables CSS

```jsx
<h1 style={{ fontFamily: 'var(--font-brana)' }}>
    ፊደልፐ ምስ ጽሑፋት
</h1>
```

## Police par défaut

La police **Geez Gothic** est appliquée par défaut à toute l'application via `className={geezGothic.className}` sur l'élément `<html>`.

