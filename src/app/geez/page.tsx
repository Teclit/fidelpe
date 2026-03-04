import TigrinyaAlphabet from "@/components/TigrinyaAlphabet";

export default function GeezPage(): React.ReactElement {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-[rgba(17,24,39,0.08)] bg-white shadow-sm p-6 sm:p-7">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-(--color-text-muted)">
            Typography Guidance
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-(--color-primary)">
            Geez and Tigrinya Script Reference
          </h1>
          <p className="text-(--color-text-muted) text-sm sm:text-base leading-relaxed">
            Use this page to review Geez and Tigrinya characters, evaluate font
            behavior, and train teams on consistent script usage. Switch between
            carousel and grid views to support document preparation, quality
            checks, and professional publishing workflows.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-(--color-secondary) border border-(--card-border)">
            <span className="text-(--color-primary)">
              Font Evaluation and Script Training
            </span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-4">
        <div className="space-y-4">
          <TigrinyaAlphabet />
        </div>
      </section>
    </main>
  );
}
