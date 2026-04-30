import {
  Layers,
  Wand2,
  ShieldCheck,
  FolderDown,
  Sliders,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Batch everything",
    body: "Drop dozens of clips at once — drag-and-drop, metadata auto-detected, sequential naming on export.",
  },
  {
    icon: Wand2,
    title: "Bouncing watermarks",
    body: "DVD-screensaver text or logo overlays at slow / medium / fast — plus fixed positions and shadows.",
  },
  {
    icon: Sparkles,
    title: "Quality templates",
    body: "One-click CapCut Ultra HD 1440p, 4K Crisp 2160p, or YouTube 1080p with built-in Lanczos + sharpen.",
  },
  {
    icon: FolderDown,
    title: "ZIP export",
    body: "Bundle every processed clip into a single ZIP the second the queue finishes.",
  },
  {
    icon: Sliders,
    title: "Presets that stick",
    body: "Save your look — watermark, quality template, output folder — and reuse it forever.",
  },
  {
    icon: ShieldCheck,
    title: "Fully offline",
    body: "FFmpeg runs on your machine. No uploads, no cloud bills, no 2-minute free tier caps.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-border/60 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need for polished batch output.
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Built for creators who cut dozens of clips a week and want them to look
            identical, fast.
          </p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-border/60 bg-card p-5 transition-colors hover:border-border"
            >
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <f.icon className="size-5" />
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
