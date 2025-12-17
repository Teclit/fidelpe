````md
# Free Geez Fonts (Public Release)

A curated collection of free-to-use Geez fonts, organized by Eritrean cities.  
Goal: enable **non-commercial** use (personal/education) on desktop and web through an open, clean, and structured distribution.

**Current version:** v1.00 — May 24, 2023

---

## Overview

- **Content:** Geez font families (Sans/Serif, multiple weights and widths) grouped by city folders under `fonts/`.
- **Use cases:** documents (Word, LibreOffice), design (Adobe, Figma), web (sites and apps) — with performance best practices.
- **Non-technical guide:** see `Non-Technical-Guide-Word-GoogleDocs.md`.

## Key Features

- **Wide style coverage:** Regular, Bold, Thin, Condensed/Extra Condensed, etc.
- **Clear organization:** grouped by city (Asmara, Keren, Massawa, …).
- **Cross-platform:** Windows / macOS / Linux.

---

## Quick Install

### Windows (per-user install, no admin)

- File Explorer: select `.ttf` files → right-click → **Install**.
- PowerShell (copy fonts into the current user fonts folder):

```powershell
$dest = Join-Path $env:LOCALAPPDATA "Microsoft\Windows\Fonts"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

Get-ChildItem -Path ".\fonts" -Recurse -Filter "*.ttf" |
  Copy-Item -Destination $dest -Force

Write-Host "Fonts copied. Restart your apps to see the new fonts."
````

> Note: System-wide installation (all users) usually requires admin rights and goes through **Settings → Fonts** or `C:\Windows\Fonts`. Per-user installation is recommended.

### macOS

```bash
mkdir -p ~/Library/Fonts
find fonts -type f -name "*.ttf" -exec cp -f {} ~/Library/Fonts \;
# Or double-click a .ttf file and click "Install Font" in Font Book
```

### Linux (most distributions)

```bash
mkdir -p ~/.local/share/fonts
find fonts -type f -name "*.ttf" -exec cp -f {} ~/.local/share/fonts \;
fc-cache -f -v
```

Tip: after adding/removing fonts, refresh the font cache (Linux: `fc-cache -f -v`).

---

## Using the Fonts in Desktop Apps

* Select the family by name (e.g. **“Asmara Sans Geez”**, **“Asmara Serif Geez”**, **“Keren”**).
* Pick the correct style/weight (Regular, Bold, Thin, Condensed…). Avoid “fake bold/italic” and prefer provided native variants.
* If the font does not appear: restart the app, or log out/in.

---

## Web Usage (Best Practices)

* For quick prototypes, loading `.ttf` can work. In production, prefer **`.woff2`** to reduce size and improve load times.
* **Subsetting:** keep only the glyphs you need to reduce weight, while ensuring full Geez coverage for your target content.
* Minimal example (adjust paths to your deployment structure):

```css
@font-face {
  font-family: "AsmaraSansGeez";
  src: url("fonts/Asmara/AsmaraSansGeez-Regular.ttf") format("truetype");
  /* Production: prefer woff2 */
  /* src: url("./Asmara/AsmaraSansGeez-Regular.woff2") format("woff2"); */
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: "AsmaraSansGeez", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
```

Additional production guidance:

* **Preload:**
  `<link rel="preload" as="font" type="font/woff2" crossorigin href="./Asmara/AsmaraSansGeez-Regular.woff2">`
* Limit embedded variants/weights; enable HTTP compression and strong caching headers.

---

## Demo HTML (Preview "ሰላም")

A simple demo page is included to preview the word **"ሰላም"** using the bundled fonts with an accordion and a dropdown.

- File: `demo.html` at the project root
- How to open: double-click `demo.html` (or open in your browser)
- Note: the demo currently references `fonts/Asmara/AsmaraSansGeez-Regular.ttf` and `fonts/Asmara/AsmaraSerifGeez-Regular.ttf` via `@font-face`. Adjust paths if you reorganize fonts.
- Performance: for production, prefer `woff2` and proper caching/preload as noted earlier.

---

## Repository Layout

* `fonts/<City>/`: TTF files grouped by city (see `Eritrean-city.md`).
* `README.md`: catalog + instructions (this file).
* `Non-Technical-Guide-Word-GoogleDocs.md`: step-by-step guide for non-technical users.

Example folders:

* `fonts/Asmara/` — Sans/Serif families with multiple weights and widths.
* `fonts/Keren/`, `fonts/Massawa/`, `fonts/Senafe/`, etc.

> Note: the repository currently contains ~188 TTF files (approximate count). A script may be added to recalculate and automatically update this number.

---

## License & Usage Terms

These fonts are made available under the following terms:

* **Allowed:** personal use and non-profit educational projects.
* **Commercial use:** any commercial usage, redistribution, modification, or inclusion in products for sale requires **prior written permission** from FidelPE.

License text:

> This font may be used free of charge for personal or educational non-profit projects only. Any commercial use, redistribution, modification, or inclusion in products intended for sale requires prior written permission from FidelPE.

If you are a rights holder or have a licensing request, please contact us (see **Support & Contact**).

---

## Attribution, Copyright & Trademark

* Copyright: “Geez font © FidelPE — Asmara, May 24, 2023. All rights reserved.”
* Trademark: “Geez font © FidelPE — Asmara”
* Please credit the authors when publishing work/sites using these fonts, following standard attribution practices.

---

## Changelog & Versioning

* **v1.00 (May 24, 2023):** initial public release.
* Next versions: this README will serve as the changelog baseline (date, additions/removals, fixes).

---

## Contributing

Contributions are welcome.

* **Adding fonts:** place new `.ttf` files under the correct `fonts/<City>/` folder.
* **Naming:** follow the existing convention (e.g. `Family-Weight.ttf`).
* **Docs:** update this README (counts/sections) when adding/removing fonts.
* **PRs:** open a Pull Request with a short description and (if possible) a usage screenshot.

---

## Support & Contact

* Questions/bugs/licensing: open a public Issue or contact **FidelPE Projects**.
* Response times are not guaranteed; we respond as availability allows.

---

## Acknowledgements

Geez and Eritrean community, contributors, and the typography toolchain ecosystem.  
Special thanks to **YPFDJ Europe & Carriere Lab** as the main contributor for their support and contributions. Thank you for your support and feedback.

---

## Metadata (Reference)

* `version` = "Geez font Version 1.0.0.0"
* `copyright` = "Geez font © FidelPE — Asmara, 24 May 2023. All rights reserved."
* `trademark` = "Geez font © FidelPE — Asmara"
* `manufacturer` = "FidelPE Projects"
* `designer` = "FidelPE Team"
* `license_description` = "This font may be used free of charge for personal or educational non-profit projects only. Any commercial use, redistribution, modification, or inclusion in products intended for sale requires prior written permission from FidelPE."
* `compatible_full` = "[https://hdrimedia.com/](https://hdrimedia.com/)"

Suggestion: move these metadata into a dedicated file (`METADATA.md` or `metadata.json`) for tooling and easier maintenance.
````
