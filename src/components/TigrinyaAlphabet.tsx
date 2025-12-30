"use client";

import { useEffect, useMemo, useState } from "react";
import { geezAlphabet, type GeezCharacter } from "@/data/geez";

type ViewMode = "carousel" | "grid";

const AUTO_ADVANCE_MS = 5000;

export default function TigrinyaAlphabet(): React.ReactElement {
  const alphabetRows = useMemo<GeezCharacter[]>(
    () => [...geezAlphabet].sort((a, b) => a.order - b.order),
    []
  );
  const [view, setView] = useState<ViewMode>("carousel");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (view !== "carousel") return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % alphabetRows.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [view, alphabetRows.length]);

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
        charIndex
      }))
      .filter(({ char, transliteration }) => char && transliteration);

    return (
      <div
        className={`flex flex-wrap justify-center gap-3 ${
          large ? "mt-4" : ""
        }`}
      >
        {entries.map(({ char, transliteration, charIndex }) => (
          <div
            key={`${row.phoneticGroup}-${char}-${charIndex}`}
            className={`flex flex-col items-center rounded-xl bg-white border border-[rgba(17,24,39,0.06)] shadow-sm ${
              large ? "px-4 py-3 min-w-22" : "px-3 py-2 min-w-17.5"
            } transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-md`}
          >
            <span
              className={`${
                large ? "text-3xl" : "text-2xl"
              } font-semibold text-(--color-primary)`}
            >
              {char}
            </span>
            <span
              className={`${
                large ? "text-sm" : "text-xs"
              } text-(--color-text-muted) mt-1`}
            >
              {transliteration}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="rounded-2xl border border-[rgba(17,24,39,0.08)] bg-white shadow-sm p-5 sm:p-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-(--color-text-muted)">
            Geez / Tigrinya alphabet
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold text-(--color-primary)"
          >
            ፊደል፡ ትግርኛ
          </h2>
          <p className="text-(--color-text-muted) text-sm sm:text-base">
            Toggle between a slow carousel to focus on each phonetic group or a
            full grid to scan and compare all rows at once.
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
            Carousel view
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
            Grid view
          </button>
        </div>
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
              className="rounded-2xl border border-[rgba(17,24,39,0.06)] bg-(--color-secondary) p-4 shadow-sm flex flex-col gap-3"
            >
              <header className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-(--color-text-muted)">
                    Group
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
  );
}
