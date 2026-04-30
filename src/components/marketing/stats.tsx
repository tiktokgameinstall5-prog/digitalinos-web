const stats = [
  { value: "100%", label: "Offline processing" },
  { value: "30d", label: "Offline grace after activation" },
  { value: "0", label: "Watermarks on output" },
  { value: "1", label: "Click to launch" },
];

export function Stats() {
  return (
    <section className="border-t border-border/60 bg-muted/20 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="text-center"
            >
              <div className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
