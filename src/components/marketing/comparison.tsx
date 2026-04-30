import { Check, X } from "lucide-react";

const rows = [
  {
    feature: "Batch process dozens of clips",
    digitalinos: true,
    premiere: "Manual",
    capcut: "Manual",
    handbrake: true,
  },
  {
    feature: "Bouncing / DVD-style watermarks",
    digitalinos: true,
    premiere: "Plugin",
    capcut: false,
    handbrake: false,
  },
  {
    feature: "1-click quality templates (1080p / 1440p / 4K)",
    digitalinos: true,
    premiere: false,
    capcut: false,
    handbrake: "Manual",
  },
  {
    feature: "Works fully offline (no upload)",
    digitalinos: true,
    premiere: true,
    capcut: false,
    handbrake: true,
  },
  {
    feature: "ZIP export when queue finishes",
    digitalinos: true,
    premiere: false,
    capcut: false,
    handbrake: false,
  },
  {
    feature: "Subscription required",
    digitalinos: "One-time",
    premiere: true,
    capcut: true,
    handbrake: false,
  },
  {
    feature: "Free first videos",
    digitalinos: "10 free",
    premiere: false,
    capcut: false,
    handbrake: "Always",
  },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <div className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
        <Check className="size-3.5" />
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground/60">
        <X className="size-3.5" />
      </div>
    );
  }
  return (
    <span className="text-xs font-medium text-muted-foreground">{value}</span>
  );
}

export function Comparison() {
  return (
    <section className="border-t border-border/60 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Why Digitalinos
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for the batch jobs other tools make painful.
          </h2>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-border/60 bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30">
                  <th className="px-5 py-4 text-left font-medium text-muted-foreground">
                    Feature
                  </th>
                  <th className="px-5 py-4 text-center font-semibold text-foreground">
                    Digitalinos
                  </th>
                  <th className="px-5 py-4 text-center font-medium text-muted-foreground">
                    Premiere
                  </th>
                  <th className="px-5 py-4 text-center font-medium text-muted-foreground">
                    CapCut
                  </th>
                  <th className="px-5 py-4 text-center font-medium text-muted-foreground">
                    HandBrake
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr
                    key={r.feature}
                    className={
                      i === rows.length - 1 ? "" : "border-b border-border/40"
                    }
                  >
                    <td className="px-5 py-4 text-foreground">{r.feature}</td>
                    <td className="px-5 py-4 text-center">
                      <Cell value={r.digitalinos} />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Cell value={r.premiere} />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Cell value={r.capcut} />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Cell value={r.handbrake} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Comparison reflects each tool&apos;s default capability without
          third-party plugins. Adobe Premiere is a registered trademark of
          Adobe Inc.; CapCut of Bytedance; HandBrake is open source.
        </p>
      </div>
    </section>
  );
}
