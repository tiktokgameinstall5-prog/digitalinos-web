import { Download, MousePointer2, Play, Sparkles } from "lucide-react";

const steps = [
  {
    n: "01",
    title: "Download Digitalinos",
    body: "Single ZIP, ~70 KB. No installer signup, no GitHub redirect, no \"freemium\" sign-up wall. Works on Windows, macOS, and Linux.",
    icon: Download,
  },
  {
    n: "02",
    title: "Double-click launch",
    body: "launch.bat (Windows) or launch.sh (macOS/Linux) builds an isolated Python environment on first run. Takes about 60 seconds — once.",
    icon: Play,
  },
  {
    n: "03",
    title: "Drop your clips",
    body: "Drag-and-drop dozens of MP4s into the queue. Pick a quality template (1080p / 1440p / 4K), add a watermark, and hit Start.",
    icon: MousePointer2,
  },
  {
    n: "04",
    title: "Walk away",
    body: "FFmpeg encodes everything in parallel on your CPU/GPU. Get a ZIP of all the polished output when done.",
    icon: Sparkles,
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="border-t border-border/60 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            How it works
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            From zero to processed clips in under 5 minutes.
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            No accounts inside the app. No cloud upload waits. Open and go.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div
              key={s.n}
              className="relative rounded-xl border border-border/60 bg-card p-5"
            >
              <div className="flex items-start justify-between">
                <div className="inline-flex size-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <s.icon className="size-5" />
                </div>
                <span className="text-xs font-semibold tracking-widest text-muted-foreground/60">
                  {s.n}
                </span>
              </div>
              <h3 className="mt-5 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
