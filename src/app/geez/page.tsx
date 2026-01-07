import TigrinyaAlphabet from "@/components/TigrinyaAlphabet";

const practiceTips = [
  "Read each row aloud, then whisper it to focus on the vowel changes.",
  "Pair every Geez symbol with a familiar word (name, place, food).",
  "Switch to grid view after two rounds to compare similar consonants.",
];

const quickUses = [
  "Teach a 5-minute warm-up before lessons or calls with family.",
  "Print the grid view as a compact reference sheet.",
  "Use the carousel on a phone for slow, single-row review.",
];

export default function GeezPage(): React.ReactElement {
  return (
    <main className="space-y-6">
      <section className="rounded-2xl border border-[rgba(17,24,39,0.08)] bg-white shadow-sm p-6 sm:p-7">
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-(--color-text-muted)">
            Alphabet
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-(--color-primary)">
            Geez / Tigrinya alphabet explorer
          </h1>
          <p className="text-(--color-text-muted) text-sm sm:text-base leading-relaxed">
            Adapted for quick toggling between slow practice and fast reference.
            Works on mobile, uses Ethiopic fonts when available, and keeps
            transliterations beside every symbol.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-(--color-secondary) border border-(--card-border)">
            <span className="text-(--color-primary)">ፊደል፣ ትግርኛ</span>
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
