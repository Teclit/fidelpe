"use client";

import React, { useEffect, useMemo, useState } from "react";

interface Font {
  path: string;
  city: string;
  file: string;
  family: string;
  subfamily: string;
  full_name: string;
}

interface CityMap {
  [key: string]: string;
}

/**
 * Geez Fonts Demonstration Component
 * Displays fonts organized by city with live preview and controls
 */
export default function FontsDemo() {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [cityMap, setCityMap] = useState<CityMap>({});
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedFont, setSelectedFont] = useState<string>("");
  const [previewText, setPreviewText] = useState<string>("ሰላም");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>(
    {
      quick: true,
      controls: false,
      grid: false,
    }
  );

  // Helper function to sanitize font name - moved up to use in useEffect
  const sanitizeName = (str: string): string => {
    return "Geez_" + str.replace(/[^a-zA-Z0-9_\-]/g, "_");
  };

  // Load fonts configuration
  useEffect(() => {
    setLoading(true);
    setError("");

    Promise.all([
      fetch("/fonts.min.json").then((res) => {
        if (!res.ok)
          throw new Error(`Failed to fetch fonts.min.json: ${res.status}`);
        return res.json();
      }),
      fetch("/city_name.json").then((res) => {
        if (!res.ok)
          throw new Error(`Failed to fetch city_name.json: ${res.status}`);
        return res.json();
      }),
    ])
      .then(([fontsData, cityData]) => {
        const fontsList = fontsData.fonts || [];
        console.log(`Loaded ${fontsList.length} fonts from fonts.min.json`);

        if (fontsList.length === 0) {
          setError("No fonts found in fonts.min.json");
          setLoading(false);
          return;
        }

        setFonts(fontsList);
        setCityMap(cityData);

        // Set initial city and font
        const firstCity = fontsList[0].city;
        setSelectedCity(firstCity);
        setSelectedFont(
          sanitizeName(
            (fontsList[0].file || fontsList[0].path || "").replace(
              /\.ttf$/i,
              ""
            )
          )
        );

        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load fonts:", err);
        setError(`Error loading fonts: ${err.message}`);
        setLoading(false);
      });
  }, []);

  // Dynamically inject @font-face rules
  useEffect(() => {
    if (fonts.length === 0) return;

    const styleId = "dynamic-fonts";
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    const rules = fonts
      .map((f) => {
        const faceName = sanitizeName(
          (f.file || f.path || "").replace(/\.ttf$/i, "")
        );
        return `@font-face { font-family: "${faceName}"; src: url('/${f.path}') format('truetype'); font-weight: 400; font-style: normal; font-display: swap; }`;
      })
      .join("\n");

    styleEl.textContent = rules;
    console.log(`Injected ${fonts.length} @font-face rules`);
  }, [fonts]);

  // Group fonts by city
  const fontsByCity = useMemo(() => {
    const grouped = new Map<string, Font[]>();
    fonts.forEach((f) => {
      if (!grouped.has(f.city)) grouped.set(f.city, []);
      grouped.get(f.city)!.push(f);
    });
    return grouped;
  }, [fonts]);

  // Get sorted cities
  const cities = useMemo(() => {
    return Array.from(fontsByCity.keys()).sort();
  }, [fontsByCity]);

  // Get fonts for selected city
  const cityFonts = useMemo(() => {
    return fontsByCity.get(selectedCity) || [];
  }, [fontsByCity, selectedCity]);

  // Toggle accordion
  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Get city label (Tigrigna or English)
  const getCityLabel = (cityEn: string): string => {
    return cityMap[cityEn] || cityEn;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading fonts...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 font-semibold mb-2">
            Error Loading Fonts
          </h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (fonts.length === 0) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-yellow-800 font-semibold mb-2">No Fonts Found</h2>
          <p className="text-yellow-600">
            No fonts were loaded from fonts.min.json. Please check the file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-3 text-gray-900">
          Geez Fonts for Your Projects
        </h1>
        <p className="text-gray-600">
          Try, preview, and download {fonts.length} fonts for
          <span className="text-[#418FDE] text-2xl font-bold italic">
            {" "}
            Geez,
          </span>
          <span className="text-[#FFC72C] text-2xl font-bold italic">
            {" "}
            Tigre,
          </span>
          <span className="text-[#E4002B] text-2xl font-bold italic">
            {" "}
            Tigrinya,
          </span>
          and
          <span className="text-[#43B02A] text-2xl font-bold italic">
            {" "}
            Amharic{" "}
          </span>
          languages from {cities.length} different cities. All fonts here are
          free to try and download for non-profit use.
        </p>
      </div>

      {/* Quick Preview by Sample */}
      <details
        open={openAccordions.quick}
        className="mb-4 border border-gray-200 bg-white rounded-lg shadow-sm"
      >
        <summary
          onClick={(e) => {
            e.preventDefault();
            toggleAccordion("quick");
          }}
          className="cursor-pointer flex items-center justify-between p-4 list-none select-none hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                openAccordions.quick ? "rotate-90" : ""
              }`}
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                d="M5 8l5 5 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-lg font-semibold text-gray-900">
              Quick preview by sample
            </span>
          </div>
        </summary>

        {openAccordions.quick && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cities.slice(0, 6).map((city) => {
                const cityFontsPreview = fontsByCity.get(city) || [];
                const firstFont = cityFontsPreview[0];
                if (!firstFont) return null;
                const faceName = sanitizeName(
                  (firstFont.file || firstFont.path || "").replace(
                    /\.ttf$/i,
                    ""
                  )
                );

                return (
                  <div
                    key={city}
                    className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span className="text-sm font-medium text-gray-700">
                        {getCityLabel(city)}
                      </span>
                    </div>
                    <div
                      className="text-2xl text-gray-900"
                      style={{
                        fontFamily: `'${faceName}', system-ui, sans-serif`,
                      }}
                    >
                      {previewText}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </details>

      {/* Dropdown & Controls */}
      <details
        open={openAccordions.controls}
        className="mb-4 border border-gray-200 bg-white rounded-lg shadow-sm"
      >
        <summary
          onClick={(e) => {
            e.preventDefault();
            toggleAccordion("controls");
          }}
          className="cursor-pointer flex items-center justify-between p-4 list-none select-none hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                openAccordions.controls ? "rotate-90" : ""
              }`}
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                d="M5 8l5 5 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-lg font-semibold text-gray-900">
              Choose your font & preview text
            </span>
          </div>
        </summary>

        {openAccordions.controls && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1 min-w-50">
                <label
                  htmlFor="citySelect"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Font Group:
                </label>
                <select
                  id="citySelect"
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    const newCityFonts = fontsByCity.get(e.target.value) || [];
                    if (newCityFonts.length > 0) {
                      setSelectedFont(
                        sanitizeName(
                          (
                            newCityFonts[0].file ||
                            newCityFonts[0].path ||
                            ""
                          ).replace(/\.ttf$/i, "")
                        )
                      );
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {getCityLabel(city)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-50">
                <label
                  htmlFor="fontSelect"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Font:
                </label>
                <select
                  id="fontSelect"
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {cityFonts.map((f) => {
                    const faceName = sanitizeName(
                      (f.file || f.path || "").replace(/\.ttf$/i, "")
                    );
                    return (
                      <option key={faceName} value={faceName}>
                        {f.family || f.full_name || f.file}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex-1 min-w-50">
                <label
                  htmlFor="textInput"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Text:
                </label>
                <input
                  id="textInput"
                  type="text"
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value || "ሰላም")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div
              className="p-6 border-2 border-gray-200 rounded-lg bg-gray-50 text-center text-4xl"
              style={{ fontFamily: `'${selectedFont}', system-ui, sans-serif` }}
            >
              {previewText}
            </div>
          </div>
        )}
      </details>

      {/* Preview Grid for Selected City */}
      <details
        open={openAccordions.grid}
        className="mb-4 border border-gray-200 bg-white rounded-lg shadow-sm"
      >
        <summary
          onClick={(e) => {
            e.preventDefault();
            toggleAccordion("grid");
          }}
          className="cursor-pointer flex items-center justify-between p-4 list-none select-none hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${
                openAccordions.grid ? "rotate-90" : ""
              }`}
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                d="M5 8l5 5 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-lg font-semibold text-gray-900">
              Browse & download fonts by city
            </span>
          </div>
          {selectedCity && (
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {cityFonts.length} {cityFonts.length === 1 ? "font" : "fonts"}
            </span>
          )}
        </summary>

        {openAccordions.grid && (
          <div className="p-4 pt-0 border-t border-gray-100">
            <div className="mb-4 text-lg font-semibold text-gray-700">
              Font Group: {getCityLabel(selectedCity)} ({selectedCity})
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cityFonts.map((f) => {
                const faceName = sanitizeName(
                  (f.file || f.path || "").replace(/\.ttf$/i, "")
                );

                return (
                  <div
                    key={f.path}
                    className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-green-500 shrink-0"></span>
                        <span className="text-xs text-gray-600 truncate">
                          {f.family || f.full_name || f.file}
                        </span>
                      </div>
                      <a
                        href={`/${f.path}`}
                        download={f.file}
                        className="text-xs text-blue-600 hover:text-blue-800 underline shrink-0"
                      >
                        Download
                      </a>
                    </div>
                    <div className="text-[11px] text-gray-500 mb-2">
                      Free for non-profit use; preview live before you download.
                    </div>
                    <div
                      className="text-xl text-gray-900 wrap-break-word"
                      style={{
                        fontFamily: `'${faceName}', system-ui, sans-serif`,
                      }}
                    >
                      {previewText}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </details>
    </div>
  );
}
