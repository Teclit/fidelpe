"use client";

import { useEffect, useMemo, useState } from "react";
import { geezAlphabet, type GeezCharacter } from "@/data/geez";
import { sanitizeFontFaceName } from "@/lib/fonts";

type ViewMode = "carousel" | "grid";
type FontOption = {
  faceName: string;
  label: string;
  path: string;
};

const AUTO_ADVANCE_MS = 5000;
const DEFAULT_FONT = "__default_ethiopic__";
const DEFAULT_FONT_STACK = "'Noto Sans Ethiopic', 'Abyssinica SIL', serif";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isString = (value: unknown): value is string => typeof value === "string";

const parseFontOptions = (payload: unknown): FontOption[] => {
  if (!isRecord(payload) || !Array.isArray(payload.fonts)) return [];

  const options: FontOption[] = [];
  const seen = new Set<string>();

  payload.fonts.forEach((entry) => {
    if (!isRecord(entry)) return;

    const path = isString(entry.path) ? entry.path : "";
    if (!path) return;

    const file = isString(entry.file)
      ? entry.file
      : (path.split("/").pop() ?? path);
    const city = isString(entry.city) ? entry.city : "Font";
    const displayName = file.replace(/\.(ttf|otf)$/i, "");
    const faceName = sanitizeFontFaceName(displayName);

    if (seen.has(faceName)) return;
    seen.add(faceName);

    options.push({
      faceName,
      label: `${city} - ${displayName}`,
      path,
    });
  });

  return options;
};

export default function TigrinyaAlphabet(): React.ReactElement {
  const alphabetRows = useMemo<GeezCharacter[]>(
    () => [...geezAlphabet].sort((a, b) => a.order - b.order),
    [],
  );
  const [view, setView] = useState<ViewMode>("carousel");
  const [index, setIndex] = useState(0);
  const [fontOptions, setFontOptions] = useState<FontOption[]>([]);
  const [activeFont, setActiveFont] = useState<string>(DEFAULT_FONT);

  useEffect(() => {
    let mounted = true;

    const loadFonts = async () => {
      try {
        const response = await fetch("/fonts.min.json");
        if (!response.ok) return;

        const payload: unknown = await response.json();
        if (!mounted) return;

        const parsed = parseFontOptions(payload);
        setFontOptions(parsed);
      } catch {
        setFontOptions([]);
      }
    };

    loadFonts().catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (view !== "carousel") return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % alphabetRows.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [view, alphabetRows.length]);

  const selectedFont = useMemo(
    () => fontOptions.find((font) => font.faceName === activeFont) ?? null,
    [fontOptions, activeFont],
  );

  useEffect(() => {
    if (!selectedFont) return;

    const styleId = `alphabet-font-${selectedFont.faceName}`;
    if (document.getElementById(styleId)) return;

    const styleEl = document.createElement("style");
    const format = selectedFont.path.toLowerCase().endsWith(".otf")
      ? "opentype"
      : "truetype";

    styleEl.id = styleId;
    styleEl.textContent = `@font-face { font-family: "${selectedFont.faceName}"; src: url('/${selectedFont.path}') format('${format}'); font-weight: 400; font-style: normal; font-display: swap; }`;
    document.head.appendChild(styleEl);
  }, [selectedFont]);

  const geezFontStyle = useMemo(
    () => ({
      fontFamily: selectedFont
        ? `'${selectedFont.faceName}', ${DEFAULT_FONT_STACK}`
        : DEFAULT_FONT_STACK,
    }),
    [selectedFont],
  );

  const current = alphabetRows[index];

  const goPrevious = () => {
    setIndex((prev) => (prev - 1 + alphabetRows.length) % alphabetRows.length);
  };

  const goNext = () => {
    setIndex((prev) => (prev + 1) % alphabetRows.length);
  };

  const renderRow = (row: GeezCharacter, large = false) => {
    const entries = row.geez
      .map((char, charIndex) => ({
        char,
        transliteration: row.latinTransliteration[charIndex],
        charIndex,
      }))
      .filter(({ char, transliteration }) => char && transliteration);

    return (
      <div
        className={`character-row flex flex-wrap justify-center gap-3 ${
          large ? "mt-4 large" : ""
        }`}
      >
        {entries.map(({ char, transliteration, charIndex }) => (
          <div
            key={`${row.phoneticGroup}-${char}-${charIndex}`}
            className={`character-cell flex flex-col items-center rounded-xl bg-white border border-[rgba(17,24,39,0.06)] shadow-sm ${
              large ? "px-4 py-3 min-w-22 large" : "px-3 py-2 min-w-17.5"
            } transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-md`}
          >
            <span
              className={`${
                large ? "text-3xl" : "text-2xl"
              } font-semibold text-(--color-primary) tigrinya-char ${large ? "large" : ""}`}
              style={geezFontStyle}
            >
              {char}
            </span>
            <span
              className={`${
                large ? "text-sm" : "text-xs"
              } text-(--color-text-muted) mt-1 latin-char ${large ? "large" : ""}`}
            >
              {transliteration}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <section className="rounded-2xl border border-[rgba(17,24,39,0.08)] bg-white shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-(--color-text-muted)">
              Alphabet Reference
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-(--color-primary)">
              Geez and Tigrinya Alphabet Explorer
            </h2>
            <p className="text-(--color-text-muted) text-sm sm:text-base">
              Use carousel mode for focused review of each phonetic group, or
              switch to grid mode for full side-by-side comparison.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setView("carousel")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                view === "carousel"
                  ? "bg-(--color-accent) text-white border-(--color-accent)"
                  : "bg-white text-(--color-primary) border-[rgba(17,24,39,0.06)] hover:bg-(--color-secondary)"
              }`}
            >
              Carousel Mode
            </button>
            <button
              type="button"
              onClick={() => setView("grid")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                view === "grid"
                  ? "bg-(--color-accent) text-white border-(--color-accent)"
                  : "bg-white text-(--color-primary) border-[rgba(17,24,39,0.06)] hover:bg-(--color-secondary)"
              }`}
            >
              Grid Mode
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          <label
            htmlFor="alphabet-font"
            className="text-xs uppercase tracking-[0.15em] text-(--color-text-muted)"
          >
            Font Selection
          </label>
          <select
            id="alphabet-font"
            value={activeFont}
            onChange={(event) => setActiveFont(event.target.value)}
            className="px-3 py-2 rounded-xl text-sm font-medium border border-[rgba(17,24,39,0.08)] bg-white text-(--color-primary) focus:outline-none focus:ring-2 focus:ring-(--color-accent)"
          >
            <option value={DEFAULT_FONT}>Default Font Set</option>
            {fontOptions.map((font) => (
              <option key={font.faceName} value={font.faceName}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        {view === "carousel" ? (
          <div className="relative overflow-hidden rounded-2xl border border-[rgba(17,24,39,0.06)] bg-(--color-secondary) p-4 sm:p-6">
            <div className="flex flex-col gap-4 items-center text-center">
              <div className="text-sm uppercase tracking-[0.15em] text-(--color-text-muted)">
                {index + 1} / {alphabetRows.length}
              </div>
              <div className="rounded-xl bg-white px-4 py-2 border border-[rgba(17,24,39,0.06)] shadow-sm">
                <p className="text-lg font-semibold text-(--color-primary) capitalize">
                  {current.phoneticGroup.replace(/-/g, " ")}
                </p>
              </div>
              {renderRow(current, true)}
            </div>

            <div className="absolute inset-y-0 left-2 flex items-center">
              <button
                type="button"
                aria-label="Previous phonetic group"
                onClick={goPrevious}
                className="h-10 w-10 rounded-full bg-white border border-[rgba(17,24,39,0.08)] shadow-md text-(--color-primary) hover:bg-(--color-secondary)"
              >
                {"<"}
              </button>
            </div>
            <div className="absolute inset-y-0 right-2 flex items-center">
              <button
                type="button"
                aria-label="Next phonetic group"
                onClick={goNext}
                className="h-10 w-10 rounded-full bg-white border border-[rgba(17,24,39,0.08)] shadow-md text-(--color-primary) hover:bg-(--color-secondary)"
              >
                {">"}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {alphabetRows.map((row) => (
              <article
                key={row.phoneticGroup}
                className="character-card rounded-2xl border border-[rgba(17,24,39,0.06)] bg-(--color-secondary) p-4 shadow-sm flex flex-col gap-3"
              >
                <header className="character-group flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-(--color-text-muted)">
                      Phonetic Group
                    </p>
                    <h3 className="text-lg font-semibold text-(--color-primary) capitalize">
                      {row.phoneticGroup.replace(/-/g, " ")}
                    </h3>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-white border border-[rgba(17,24,39,0.06)] text-(--color-primary-dark)">
                    {row.order}
                  </span>
                </header>
                {renderRow(row)}
              </article>
            ))}
          </div>
        )}
      </section>
      <style jsx>{`
        .character-card {
          background-color: #f8f9fa;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 1rem;
          width: 100%;
          max-width: 100%;
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .character-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
        }

        .character-group h3 {
          color: #343a40;
          margin-bottom: 1rem;
          text-transform: capitalize;
          font-size: 1.2rem;
          text-align: center;
          border-bottom: 2px solid #dee2e6;
          padding-bottom: 0.5rem;
        }

        .character-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.5rem;
        }

        .character-row.large {
          gap: 0.75rem;
        }

        .character-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem;
          border-radius: 4px;
          background-color: #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          min-width: 50px;
          text-align: center;
          transition:
            background-color 0.3s ease,
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .character-cell.large {
          min-width: 70px;
          padding: 0.75rem;
        }

        .character-cell:hover {
          background: radial-gradient(
            circle at top,
            var(--primary-color, #735557) 50%,
            white 70%
          );
          transform: translateY(-5px) scale(1.05);
          box-shadow:
            0 8px 20px rgba(115, 85, 87, 0.8),
            0 4px 8px rgba(0, 0, 0, 0.2);
          border-top: 1px solid var(--primary-color, #735557);
          cursor: pointer;
        }

        .character-cell:hover .tigrinya-char {
          color: white;
        }

        .character-cell:hover .latin-char {
          color: var(--primary-color, #735557);
          font-weight: bold;
          text-transform: uppercase;
        }

        .tigrinya-char {
          font-size: 1.5rem;
          font-weight: bold;
          color: #212529;
          margin-bottom: 0.25rem;
          transition: color 0.3s ease;
        }

        .tigrinya-char.large {
          font-size: 1.9rem;
        }

        .latin-char {
          font-size: 0.8rem;
          color: #6c757d;
          transition:
            color 0.3s ease,
            font-weight 0.3s ease,
            text-transform 0.3s ease;
        }

        .latin-char.large {
          font-size: 0.95rem;
        }
      `}</style>
    </>
  );
}
