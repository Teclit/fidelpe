import Link from "next/link";

type Module = {
  title: string;
  summary: string;
  points: string[];
};

type Phrase = {
  tig: string;
  latin: string;
  meaning: string;
};

const modules: Module[] = [
  {
    title: "Start with the Fidel",
    summary: "Learn the base characters and their seven sounds.",
    points: [
      "Group letters into rows of seven and practice aloud.",
      "Write by hand to memorize stroke order and rhythm.",
      "Pair each symbol with a simple word you already know.",
    ],
  },
  {
    title: "Listening & speaking",
    summary: "Short, daily speaking keeps the sounds in your ear.",
    points: [
      "Shadow 2–3 sentences from songs, news, or friends.",
      "Record yourself and compare for stress and tone.",
      "Reuse the same sentences in daily conversations.",
    ],
  },
  {
    title: "Useful patterns",
    summary: "Reuse sentence frames so you can swap words quickly.",
    points: [
      "Build with subject + verb + object: ኣነ እምሃር ትግርኛ (I learn Tigrinya).",
      "Practice questions: እንታይ ይብሉ? (What do they say?).",
      "Add time markers first: ሎሚ, ግዜ ምሸት, ድሕሪ ስራሕ.",
    ],
  },
  {
    title: "Daily writing",
    summary: "Short notes cement spelling and word order.",
    points: [
      "Rewrite a text from the day into simpler words.",
      "Label objects at home or work in Tigrinya.",
      "Keep a 3-sentence journal entry every evening.",
    ],
  },
];

const routine = [
  "5 min: read Fidel rows aloud, trace them once.",
  "5 min: shadow two sentences (listen, repeat, record).",
  "5 min: write three sentences about your day using one new verb.",
  "Bonus: look up one new word in the dictionary and use it twice.",
];

const phrases: Phrase[] = [
  { tig: "ሰላም", latin: "selam", meaning: "Hello" },
  { tig: "ከመይ ኣለኪ?", latin: "kemey aleki?", meaning: "How are you?" },
  { tig: "በጃኻ ሓግዘኒ", latin: "bejakha hagzeni", meaning: "Please help me" },
  { tig: "የቐንየለይ", latin: "yeqenyeley", meaning: "Thank you" },
  { tig: "ጥንቅቅ በል", latin: "tinqiq bel", meaning: "Take care" },
  { tig: "ኣበይ ዝርከብ …?", latin: "abey zerekhb …?", meaning: "Where is …?" },
];

const resources = [
  {
    href: "/aetd",
    title: "AETD Dictionary",
    detail: "Search English ⇄ Tigrinya entries offline once loaded.",
  },
  {
    href: "/fonts-demo",
    title: "Geez fonts",
    detail: "Preview and download typefaces for notes or posters.",
  },
  {
    href: "/editor",
    title: "Document editor",
    detail: "Draft lessons, printables, or handouts in the browser.",
  },
];

export default function LearnTigrinyaPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-[rgba(17,24,39,0.06)] bg-white shadow-sm">
        <div className="absolute inset-0 bg-linear-to-br from-(--color-secondary) via-white to-[rgba(116,72,42,0.08)]" />
        <div className="relative p-6 sm:p-8 flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.2em] text-(--color-text-muted)">
            Learn Tigrinya
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="space-y-3 max-w-3xl">
              <h1 className="text-3xl sm:text-4xl font-bold text-(--color-primary)">
                Build a simple routine for speaking, reading, and writing Tigrinya
              </h1>
              <p className="text-(--color-text-muted) text-base sm:text-lg leading-relaxed">
                Short, daily practice beats long sessions once a week. Use these
                prompts, quick phrases, and links to tools already in this workspace.
              </p>
              <div
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-(--color-secondary) border border-(--card-border) text-sm text-(--color-primary-dark)"
                style={{
                  fontFamily:
                    "'Noto Sans Ethiopic', 'Geez Able', 'Arial', sans-serif",
                }}
              >
                ትግርኛ ብዛዕባ ህይወትካ ብቀሊል ብቀሊል ትግበር።
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm text-(--color-text-muted)">
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-(--color-secondary) border border-(--card-border)">
                Ideal: 15–20 minutes per day
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-(--color-secondary) border border-(--card-border)">
                Tools: notebook, phone recorder, this site
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((module) => (
          <article
            key={module.title}
            className="flex flex-col gap-3 rounded-2xl border border-[rgba(17,24,39,0.06)] bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-(--color-primary)">
                  {module.title}
                </h2>
                <p className="text-sm text-(--color-text-muted)">{module.summary}</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-(--color-secondary) text-(--color-primary-dark)">
                Step
              </span>
            </div>
            <ul className="space-y-2 text-(--color-text-dark) text-sm leading-relaxed">
              {module.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2 rounded-lg bg-(--color-secondary) px-3 py-2 border border-[rgba(17,24,39,0.06)]"
                >
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-(--color-accent)" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-[rgba(17,24,39,0.06)] bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-(--color-text-muted)">
              Daily rhythm
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold text-(--color-primary)">
              A 15-minute loop you can reuse every day
            </h2>
          </div>
          <span className="text-sm px-3 py-2 rounded-xl bg-(--color-secondary) text-(--color-primary-dark) border border-(--card-border)">
            Repeat 5 days a week
          </span>
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {routine.map((item, index) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-xl border border-[rgba(17,24,39,0.06)] bg-(--color-secondary) p-3"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-(--color-primary) font-semibold border border-[rgba(17,24,39,0.06)] shadow-sm">
                {index + 1}
              </span>
              <p className="text-(--color-text-dark) text-sm">{item}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-[rgba(17,24,39,0.06)] bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-(--color-text-muted)">
              Speak faster
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold text-(--color-primary)">
              Quick phrases to reuse everywhere
            </h2>
            <p className="text-sm text-(--color-text-muted)">
              Say each line three times: first read, then from memory, then record yourself.
            </p>
          </div>
          <div className="text-sm px-3 py-2 rounded-xl bg-(--color-secondary) border border-(--card-border)">
            Swap one word to create a new sentence.
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {phrases.map((phrase) => (
            <article
              key={phrase.tig}
              className="rounded-xl border border-[rgba(17,24,39,0.06)] bg-(--color-secondary) p-3 flex flex-col gap-2"
            >
              <div
                className="text-lg font-semibold text-(--color-primary)"
                style={{
                  fontFamily:
                    "'Noto Sans Ethiopic', 'Geez Able', 'Arial', sans-serif",
                }}
              >
                {phrase.tig}
              </div>
              <p className="text-sm text-(--color-text-muted) italic">
                {phrase.latin}
              </p>
              <p className="text-(--color-text-dark) text-sm">{phrase.meaning}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[rgba(17,24,39,0.06)] bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-(--color-text-muted)">
              Practice tasks
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold text-(--color-primary)">
              Mini assignments you can finish today
            </h2>
          </div>
          <span className="text-sm px-3 py-2 rounded-xl bg-(--color-secondary) border border-(--card-border) text-(--color-primary-dark)">
            Keep each task under 10 minutes
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl border border-[rgba(17,24,39,0.06)] p-4 bg-(--color-secondary)">
            <h3 className="text-base font-semibold text-(--color-primary) mb-2">
              Listen & shadow
            </h3>
            <p className="text-sm text-(--color-text-dark) leading-relaxed">
              Pick a 20–30 second clip (radio, YouTube, family voice note). Play it three times,
              repeating after each pause. Note one new word and add it to your journal.
            </p>
          </div>
          <div className="rounded-xl border border-[rgba(17,24,39,0.06)] p-4 bg-(--color-secondary)">
            <h3 className="text-base font-semibold text-(--color-primary) mb-2">
              Write & simplify
            </h3>
            <p className="text-sm text-(--color-text-dark) leading-relaxed">
              Describe your day in four sentences, then rewrite each one shorter. Check spelling
              and word order with the dictionary and your own ear.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[rgba(17,24,39,0.06)] bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-(--color-text-muted)">
              Tools inside this site
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold text-(--color-primary)">
              Keep everything in one workspace
            </h2>
          </div>
          <span className="text-sm px-3 py-2 rounded-xl bg-(--color-secondary) text-(--color-primary-dark) border border-(--card-border)">
            Open a link to start practicing now
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {resources.map((resource) => (
            <Link
              key={resource.href}
              href={resource.href}
              className="group rounded-xl border border-[rgba(17,24,39,0.06)] bg-(--color-secondary) p-4 flex flex-col gap-2 hover:border-(--color-accent) hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-(--color-primary)">
                  {resource.title}
                </h3>
                <span className="text-xs px-2 py-1 rounded-full bg-white border border-[rgba(17,24,39,0.06)] text-(--color-primary-dark)">
                  Open
                </span>
              </div>
              <p className="text-sm text-(--color-text-muted) leading-relaxed">
                {resource.detail}
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
