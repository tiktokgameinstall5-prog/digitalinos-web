import { ShieldCheck, Cpu, Package, Infinity as InfinityIcon } from "lucide-react";

const items = [
  { icon: Cpu, text: "Runs on your CPU/GPU — never the cloud" },
  { icon: Package, text: "Single signed .exe — no install hell" },
  { icon: ShieldCheck, text: "Hardware-bound license keys" },
  { icon: InfinityIcon, text: "Unlimited videos on every paid plan" },
];

export function TrustStrip() {
  return (
    <section className="border-y border-border/60 bg-muted/30 py-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-4 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.text} className="flex items-center gap-2">
              <it.icon className="size-4 shrink-0 text-brand" />
              <span>{it.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
