## 🏗️ Project Structure fidelpe-extractx

Créer une application web ou un module qui permet à l’utilisateur de téléverser un fichier (image, PDF, document, etc.), puis d’extraire automatiquement le texte qu’il contient, de le simplifier linguistiquement (résumé, reformulation, ou traduction claire), et enfin de copier facilement le texte obtenu.

```
fidelpe-extractx/
│
├─ app/                          # Next.js App Router (frontend only)
│  ├─ layout.tsx                 # Global layout (Navbar, Footer, etc.)
│  ├─ page.tsx                   # Home page
│  │
│  ├─ upload/                    # Upload page
│  │   └─ page.tsx
│  ├─ extract/                   # Text extraction flow
│  │   └─ page.tsx
│  ├─ simplify/                  # Simplify or summarize text
│  │   └─ page.tsx
│  ├─ api/                       # Next.js serverless API routes (frontend only)
│  │   ├─ extract/route.ts
│  │   └─ simplify/route.ts
│  └─ globals.css
│
├─ components/
│  ├─ layout/
│  │   ├─ Navbar.tsx
│  │   └─ Footer.tsx
│  ├─ common/
│  │   ├─ Button.tsx
│  │   ├─ Loader.tsx
│  │   ├─ FileInput.tsx
│  │   └─ Alert.tsx
│  ├─ upload/
│  │   ├─ FileUploader.tsx
│  │   └─ UploadPreview.tsx
│  ├─ extract/
│  │   ├─ ExtractArea.tsx
│  │   └─ TextDisplay.tsx
│  └─ simplify/
│      └─ SimplifyPanel.tsx
│
├─ hooks/
│  ├─ useFileUpload.ts           # Handles file input logic
│  ├─ useTextExtract.ts          # Handles text extraction call
│  ├─ useSimplify.ts             # Handles simplification call
│  └─ useToast.ts                # Notifications
│
├─ services/                     # API logic layer
│  ├─ apiClient.ts               # Axios / fetch wrapper
│  ├─ extractService.ts          # Handles /api/extract
│  └─ simplifyService.ts         # Handles /api/simplify
│
├─ lib/
│  ├─ helpers.ts                 # Utilities (clean text, format, etc.)
│  ├─ constants.ts               # Global constants
│  └─ types.ts                   # TS interfaces (TextData, FileInfo, etc.)
│
├─ store/                        # Global state (optional - Zustand)
│  └─ useAppStore.ts
│
├─ public/
│   └─ logo.png
│
├─ styles/
│   └─ globals.css
│
├─ .env.local                    # Env vars (e.g., OPENAI_API_KEY)
├─ package.json
├─ tsconfig.json
└─ tailwind.config.js
```

## 🚦 CI/CD

This repo ships with a GitHub Actions CI workflow and an optional deploy workflow:

- `.github/workflows/ci.yml` runs on pushes and PRs to `main` and `develop`:

  - Installs dependencies with Yarn 4 (Corepack)
  - Lints the codebase (ESLint)
  - Type-checks (TypeScript, no emit)
  - Builds the Next.js app and uploads the `.next` folder as an artifact

- `.github/workflows/deploy-vercel.yml` provides a manual deploy via Vercel CLI. To use it:
  1.  In GitHub repository settings, add secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
  2.  Go to the Actions tab, run the "Deploy (Vercel)" workflow, choose `preview` or `production`.
  3.  Optionally duplicate/adjust the workflow to auto-deploy on push to `main`.

### Local checks

Run the same checks locally before pushing:

```powershell
yarn install
yarn lint
yarn typecheck
yarn build
```

Requirements: Node.js >= 20.10 with Corepack enabled (Yarn >= 4). The CI enforces these via `package.json` engines.

## ✍️ Word‑like Editor (/editor)

This project includes a rich text editor page similar to Word for writing, formatting, and personalizing documents.

- Route: `/editor` (linked in the sidebar as "Editor")
- Features:
  - Formatting: bold, italic, underline, strike, highlight
  - Headings (H1–H3), paragraphs, bullet and numbered lists
  - Alignment: left, center, right, justify
  - Links and auto-linking
  - Personalization: font family (uses bundled Ethiopic fonts), font size, line height, page width, light/dark theme
  - Auto‑save to the browser (localStorage)
  - Export: HTML or TXT; Print to PDF via the browser print dialog

Notes:

- Fonts come from `src/app/fonts/loader.ts` via CSS variables (e.g., `--font-menbere`). The editor applies the selected font directly to the content.
- The editor runs client‑side only and is dynamically imported to avoid SSR issues.
