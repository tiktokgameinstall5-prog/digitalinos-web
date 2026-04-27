const quotes = [
  {
    quote:
      "Went from 40 minutes of manual watermarking to a single queue. This paid for itself in a week.",
    name: "Priya S.",
    role: "Content studio, 3-person team",
  },
  {
    quote:
      "The CapCut Ultra HD template is what finally made my edits look crisp at 1440p. No more blur.",
    name: "Marcus K.",
    role: "YouTube shorts creator",
  },
  {
    quote:
      "Offline is the killer feature. My client footage never has to touch a cloud — and my laptop does the work.",
    name: "Ana M.",
    role: "Wedding videographer",
  },
];

export function Testimonials() {
  return (
    <section className="border-t border-border/60 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Loved by creators who batch for a living.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {quotes.map((q) => (
            <figure
              key={q.name}
              className="flex flex-col justify-between rounded-xl border border-border/60 bg-card p-6"
            >
              <blockquote className="text-sm leading-relaxed text-foreground">
                “{q.quote}”
              </blockquote>
              <figcaption className="mt-6 text-sm">
                <div className="font-medium">{q.name}</div>
                <div className="text-muted-foreground">{q.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
