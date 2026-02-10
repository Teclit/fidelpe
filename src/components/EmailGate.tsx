"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { tsoronaAsmara } from "@/lib/fonts";

const STORAGE_KEY = "fidelpe.email";
const DEFAULT_ERROR_MESSAGE = "We could not save your email. Please try again.";

const extractErrorMessage = async (response: Response): Promise<string | null> => {
  const text = (await response.text()).trim();
  if (!text) {
    return null;
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return text;
  }
  const match = /"error"\s*:\s*"([^"]+)"/.exec(text);
  return match?.[1] ?? null;
};

type EmailGateProps = {
  children: React.ReactNode;
};

export default function EmailGate({ children }: EmailGateProps): React.ReactElement {
  const [email, setEmail] = useState("");
  const [hasEmail, setHasEmail] = useState(false);
  const [checked, setChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedEmail = window.localStorage.getItem(STORAGE_KEY);
    if (savedEmail?.trim()) {
      setHasEmail(true);
    }
    setChecked(true);
  }, []);

  const gated = !checked || !hasEmail;

  useEffect(() => {
    if (!gated) {
      return undefined;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [gated]);

  const isValid = useMemo(() => {
    const trimmed = email.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  }, [email]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isValid || saving) {
        return;
      }
      const trimmed = email.trim();
      setSaving(true);
      setError(null);
      fetch("/api/useremail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const message = (await extractErrorMessage(response)) ?? DEFAULT_ERROR_MESSAGE;
            throw new Error(message);
          }
          window.localStorage.setItem(STORAGE_KEY, trimmed);
          setHasEmail(true);
        })
        .catch((err: Error) => {
          setError(err.message);
        })
        .finally(() => {
          setSaving(false);
        });
    },
    [email, isValid, saving]
  );

  return (
    <div className="relative min-h-full">
      <div
        className={`transition duration-200 ${gated ? "pointer-events-none select-none blur-sm" : ""}`}
        aria-hidden={gated ? "true" : undefined}
      >
        {children}
      </div>
      {gated && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200/80 bg-white/95 p-6 shadow-2xl">
            <div className="mb-4">
              <p className={`${tsoronaAsmara.className} text-xl font-semibold text-(--color-primary)`}>
                ፊደልፐ ምስ ግእዝ
              </p>
              <h2 className="text-2xl font-semibold text-(--color-text-dark)">
                Enter your email to continue
              </h2>
              <p className="mt-2 text-sm text-(--color-text-muted)">
                This application is designed to enhance user experience.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-(--color-text-dark)">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-(--color-text-dark) shadow-sm focus:border-(--color-accent) focus:outline-none focus:ring-2 focus:ring-(--color-accent)/30"
                />
              </div>
              {error && <p className="text-sm text-(--color-error)">{error}</p>}
              <button
                type="submit"
                disabled={!isValid || saving}
                className={`w-full rounded-md px-4 py-2 text-sm font-semibold transition ${
                  isValid && !saving
                    ? "bg-(--color-accent) text-white hover:bg-(--color-primary-one)"
                    : "cursor-not-allowed bg-gray-200 text-gray-500"
                }`}
              >
                {saving ? "Saving..." : "Continue"}
              </button>
            </form>
            <p className="mt-3 text-xs text-(--color-text-muted)">
              We use your email only to allow access to the application.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
