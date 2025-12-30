import Link from "next/link";

const thanks = [
  {
    title: "Tekie Tesfay",
    detail:
      "For leading, experimenting, and sharing work that keeps Geez-script tools moving forward.",
  },
  {
    title: "Developers of Geez-script languages",
    detail:
      "Everyone who codes keyboards, fonts, parsers, and learning apps that make writing in Tigrinya, Tigre, and Amharic smoother.",
  },
  {
    title: "Eritrean authors and educators",
    detail:
      "Teachers, writers, and community members who document and grow local languages for readers everywhere.",
  },
];

export default function AcknowledgementPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-[rgba(17,24,39,0.06)] bg-white shadow-sm">
        <div className="absolute inset-0 bg-linear-to-br from-(--color-secondary) via-white to-[rgba(116,72,42,0.08)]" />
        <div className="relative p-6 sm:p-8 flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.2em] text-(--color-text-muted)">
            Acknowledgement
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-(--color-primary)">
            Gratitude to the people behind this work
          </h1>
          <p className="text-(--color-text-muted) text-base sm:text-lg leading-relaxed max-w-4xl">
            FidelpeExtractX exists because many hands keep Geez-script languages alive
            in digital spaces. This page honors the individuals and communities who
            build, teach, and share.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {thanks.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-[rgba(17,24,39,0.06)] bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-(--color-primary) mb-2">
              {item.title}
            </h2>
            <p className="text-sm text-(--color-text-muted) leading-relaxed">
              {item.detail}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-[rgba(17,24,39,0.06)] bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-(--color-text-muted)">
              Featured link
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold text-(--color-primary)">
              Tribute and inspiration
            </h2>
          </div>
          <span className="text-sm px-3 py-2 rounded-xl bg-(--color-secondary) text-(--color-primary-dark) border border-(--card-border)">
            Watch and share
          </span>
        </div>
        <div className="rounded-xl border border-[rgba(17,24,39,0.06)] bg-(--color-secondary) p-4 flex flex-col gap-2">
          <p className="text-(--color-text-dark) text-sm">
            A video honoring Tekie Tesfay and everyone advancing Geez-script languages.
          </p>
          <Link
            href="https://youtu.be/9023azbD-fI"
            target="_blank"
            className="inline-flex items-center gap-2 text-(--color-accent) font-semibold hover:underline"
          >
            Open YouTube tribute
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
