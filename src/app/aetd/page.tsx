"use client";

import Link from "next/link";
import React, { useCallback, useMemo, useState } from "react";

type DictionaryEntry = {
  entry: string;
  def: string;
  parentid?: number;
  partofsp?: string;
  pronunc?: string;
  supportinfo?: string;
};

const DATA_URL = "/EnglishTigrigna/AdvancedEnglishTigrinyaDictionary.json";
type SearchScope = "headword" | "all";

export default function AetdPage(): React.ReactElement {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<DictionaryEntry[] | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState("");
  const [maxResults, setMaxResults] = useState(30);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchScope, setSearchScope] = useState<SearchScope>("headword");
  const [prefixOnly, setPrefixOnly] = useState(true);
  const [showSearchOptions, setShowSearchOptions] = useState(false);

  const loadDictionary = useCallback(async () => {
    if (entries || loadingData) return;
    try {
      setLoadingData(true);
      setError("");
      const res = await fetch(DATA_URL);
      if (!res.ok) {
        throw new Error(`Unable to load dictionary (${res.status})`);
      }
      const json = await res.json();
      if (!Array.isArray(json)) {
        throw new Error("Dictionary payload is not an array");
      }
      setEntries(json);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error while loading";
      setError(message);
    } finally {
      setLoadingData(false);
    }
  }, [entries, loadingData]);

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value);
      if (value.trim().length >= 2) {
        setHasSearched(true);
        void loadDictionary();
      }
    },
    [loadDictionary]
  );

  const filteredEntries = useMemo(() => {
    if (!entries || query.trim().length === 0) return [];
    const term = query.trim().toLowerCase();

    const normalize = (value?: string): string => value?.toLowerCase() ?? "";

    const getRank = (item: DictionaryEntry): number => {
      const entryText = normalize(item.entry);
      const defText = normalize(item.def);
      const partText = normalize(item.partofsp);
      const pronText = normalize(item.pronunc);

      if (searchScope === "headword") {
        if (entryText.startsWith(term)) return 0;
        if (!prefixOnly && entryText.includes(term)) return 1;
        return 6;
      }

      if (entryText.startsWith(term)) return 0;
      if (defText.startsWith(term)) return 1;
      if (partText.startsWith(term) || pronText.startsWith(term)) return 2;
      if (!prefixOnly && entryText.includes(term)) return 3;
      if (!prefixOnly && defText.includes(term)) return 4;
      if (!prefixOnly && (partText.includes(term) || pronText.includes(term)))
        return 5;
      return 6;
    };

    return entries
      .map((item) => {
        const entryText = normalize(item.entry);
        const defText = normalize(item.def);
        const partText = normalize(item.partofsp);
        const pronText = normalize(item.pronunc);

        const scopeFields =
          searchScope === "headword"
            ? [entryText]
            : [entryText, defText, partText, pronText];

        const matches = scopeFields.some((field) =>
          prefixOnly ? field.startsWith(term) : field.includes(term)
        );

        return matches ? { item, rank: getRank(item) } : null;
      })
      .filter((v): v is { item: DictionaryEntry; rank: number } => v !== null)
      .sort((a, b) => {
        if (a.rank !== b.rank) return a.rank - b.rank;
        const aEntry = a.item.entry ?? "";
        const bEntry = b.item.entry ?? "";
        return aEntry.localeCompare(bEntry);
      })
      .slice(0, maxResults)
      .map((wrapped) => wrapped.item);
  }, [entries, maxResults, prefixOnly, query, searchScope]);

  const showEmptyState = query.trim().length < 2;

  return (
    <div className="flex flex-col gap-5">
      <header className="bg-white/90 border border-[rgba(17,24,39,0.06)] shadow-sm rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-(--color-text-muted) mb-1">
              AETD
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-(--color-primary)">
              Advanced English-Tigrinya Dictionary
            </h1>
            <p className="text-(--color-text-muted) mt-2 text-sm sm:text-base leading-relaxed">
              Search the offline dictionary for quick English ⇄ Tigrinya
              lookups. Data loads on first search (≈8 MB) and stays in memory.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap text-sm text-(--color-text-muted) items-center">
            <Link
              href="/EnglishTigrigna/help.html"
              target="_blank"
              className="px-3 py-2 rounded-xl bg-gray-100 border border-[rgba(17,24,39,0.06)] text-(--color-primary) hover:border-(--color-primary-one) hover:text-(--color-primary-dark)"
            >
              Open AETD help
            </Link>
          </div>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-[rgba(17,24,39,0.06)] shadow-sm p-4 sm:p-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex-1">
            <label
              htmlFor="query"
              className="block text-sm font-semibold text-(--color-primary) mb-2"
            >
              Search term
            </label>
            <input
              id="query"
              type="search"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Type an English headword or Tigrinya definition (min. 2 chars)"
              className="w-full rounded-xl border border-[rgba(17,24,39,0.1)] px-3 py-3 text-base shadow-[inset_0_1px_0_rgba(0,0,0,0.03)] focus:outline focus:outline-[rgba(133,88,50,0.14)] bg-white text-(--color-text-dark)"
            />
          </div>
          <div className="flex flex-col sm:w-56">
            <label
              htmlFor="limit"
              className="block text-sm font-semibold text-(--color-primary) mb-2"
            >
              Max results
            </label>
            <select
              id="limit"
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              className="rounded-xl border border-[rgba(17,24,39,0.1)] px-3 py-3 text-base bg-white text-(--color-text-dark) focus:outline focus:outline-[rgba(133,88,50,0.14)]"
            >
              {[10, 20, 30, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n} results
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-[rgba(17,24,39,0.06)] bg-white/60">
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-3 sm:px-4 sm:py-3 text-sm font-semibold text-(--color-primary)"
            onClick={() => setShowSearchOptions((prev) => !prev)}
            aria-expanded={showSearchOptions}
            aria-controls="search-options-panel"
          >
            <span>Search options</span>
            <span className="text-(--color-text-muted) text-xs">
              {showSearchOptions ? "Hide" : "Show"} options
            </span>
          </button>
          {showSearchOptions && (
            <div
              id="search-options-panel"
              className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-(--color-text-dark) border-t border-[rgba(17,24,39,0.06)] px-3 py-3 sm:px-4 sm:py-4"
            >
              <div className="flex flex-col gap-2 rounded-xl border border-[rgba(17,24,39,0.08)] bg-(--color-secondary) p-3">
                <p className="font-semibold text-(--color-primary)">
                  Search scope
                </p>
                <div className="flex flex-wrap gap-3">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="scope"
                      value="headword"
                      checked={searchScope === "headword"}
                      onChange={() => setSearchScope("headword")}
                    />
                    Headwords only (fastest)
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="scope"
                      value="all"
                      checked={searchScope === "all"}
                      onChange={() => setSearchScope("all")}
                    />
                    All fields (definitions, part of speech, pronunciation)
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-2 rounded-xl border border-[rgba(17,24,39,0.08)] bg-(--color-secondary) p-3">
                <p className="font-semibold text-(--color-primary)">Match type</p>
                <div className="flex flex-wrap gap-3">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="match"
                      value="prefix"
                      checked={prefixOnly}
                      onChange={() => setPrefixOnly(true)}
                    />
                    Starts with (recommended)
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="match"
                      value="contains"
                      checked={!prefixOnly}
                      onChange={() => setPrefixOnly(false)}
                    />
                    Contains anywhere
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm text-(--color-text-muted)">
          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-(--color-secondary) border border-[rgba(17,24,39,0.06)]">
            {loadingData
              ? "Loading dictionary…"
              : entries
              ? "Dictionary ready"
              : "Dictionary not loaded"}
          </span>
          {error && (
            <span className="text-(--color-error)">Error: {error}</span>
          )}
          {hasSearched &&
            !loadingData &&
            entries &&
            filteredEntries.length === 0 &&
            !error && <span>No matches found.</span>}
          {!hasSearched && showEmptyState && (
            <span>Type at least 2 characters to start searching.</span>
          )}
          {!loadingData && entries && !error && (
            <span>
              Scope:{" "}
              {searchScope === "headword" ? "Headwords only" : "All fields"},{" "}
              {prefixOnly ? "starts with" : "contains"}{" "}
              {query.trim() && <span>“{query.trim()}”</span>}
            </span>
          )}
        </div>
      </div>

      <section className="bg-white rounded-2xl border border-[rgba(17,24,39,0.06)] shadow-sm p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-(--color-primary)">
            Results
          </h2>
          <div className="text-sm text-(--color-text-muted)">
            {filteredEntries.length} shown
          </div>
        </div>

        {showEmptyState && (
          <div className="text-(--color-text-muted) text-sm">
            Start typing to search across headwords, definitions,
            pronunciations, and parts of speech.
          </div>
        )}

        {!showEmptyState && (
          <div className="flex flex-col gap-3">
            {filteredEntries.map((item) => (
              <article
                key={`${item.parentid ?? "entry"}-${item.entry}`}
                className="border border-[rgba(17,24,39,0.06)] rounded-xl p-3 sm:p-4 bg-(--color-secondary)"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-(--color-primary)">
                      {item.entry}
                    </h3>
                    {item.partofsp && (
                      <p className="text-(--color-text-muted) text-sm">
                        Part of speech: {item.partofsp}
                      </p>
                    )}
                    {item.pronunc && (
                      <p className="text-(--color-text-muted) text-sm">
                        Pronunciation: {item.pronunc}
                      </p>
                    )}
                  </div>
                </div>
                <p
                  className="mt-3 text-base leading-7 text-(--color-text-dark)"
                  style={{
                    fontFamily:
                      "'Noto Sans Ethiopic', 'Geez Able', 'Arial', sans-serif",
                  }}
                >
                  {item.def}
                </p>
                {item.supportinfo && (
                  <p className="mt-2 text-sm text-(--color-text-muted)">
                    {item.supportinfo}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
