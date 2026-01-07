import Link from "next/link";

const highlights = [
  {
    title: "Make text easier",
    detail:
      "Simplify long or messy text so people new to digital tools can read and use it quickly.",
  },
  {
    title: "Respect low-connectivity",
    detail:
      "Keep things light, fast, and readable. Most features work without heavy downloads.",
  },
  {
    title: "Support local scripts",
    detail:
      "Use Geez-friendly fonts and layouts that handle Tigrinya comfortably.",
  },
];

const actions = [
  {
    href: "/",
    title: "Simplify text",
    detail:
      "Paste or upload and get a clearer version for sharing or printing.",
  },
  {
    href: "/aetd",
    title: "AETD dictionary",
    detail: "Look up English ⇄ Tigrinya with offline caching after first load.",
  },
  {
    href: "/fonts-demo",
    title: "Geez font gallery",
    detail: "Preview and download typefaces for documents and posters.",
  },
  {
    href: "/editor",
    title: "Document editor",
    detail: "Format and export notes without leaving the browser.",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-[rgba(17,24,39,0.06)] bg-white shadow-sm">
        <div className="absolute inset-0 bg-linear-to-br from-(--color-secondary) via-white to-[rgba(116,72,42,0.08)]" />
        <div className="relative p-6 sm:p-8 flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.2em] text-(--color-text-muted)">
            About
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-(--color-primary)">
            Why we built FidelPE
          </h1>
          <p className="text-(--color-text-muted) text-base sm:text-lg leading-relaxed max-w-4xl">
            FidelPE is a small toolkit for people who are not comfortable with
            digital technology. It focuses on making text clearer, offering
            helpful fonts, and keeping Tigrinya learning resources in one place.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-[rgba(17,24,39,0.06)] bg-(--color-secondary) p-4"
              >
                <h2 className="text-lg font-semibold text-(--color-primary) mb-1">
                  {item.title}
                </h2>
                <p className="text-sm text-(--color-text-muted) leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[rgba(17,24,39,0.06)] bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-(--color-text-muted)">
              What you can do here
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold text-(--color-primary)">
              Tools in this workspace
            </h2>
          </div>
          <span className="text-sm px-3 py-2 rounded-xl bg-(--color-secondary) text-(--color-primary-dark) border border-(--card-border)">
            Pick a path and start in one click
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-xl border border-[rgba(17,24,39,0.06)] bg-(--color-secondary) p-4 flex flex-col gap-2 hover:border-(--color-accent) hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-(--color-primary)">
                  {action.title}
                </h3>
                <span className="text-xs px-2 py-1 rounded-full bg-white border border-[rgba(17,24,39,0.06)] text-(--color-primary-dark)">
                  Open
                </span>
              </div>
              <p className="text-sm text-(--color-text-muted) leading-relaxed">
                {action.detail}
              </p>
              <span className="text-sm text-(--color-accent) font-semibold group-hover:translate-x-1 transition-transform">
                Go →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
