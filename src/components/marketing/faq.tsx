const faqs = [
  {
    q: "Does my video data leave my PC?",
    a: "No. Digitalinos runs FFmpeg locally. We never see, store, or upload your video files. The web app only manages your account and license keys.",
  },
  {
    q: "How many videos can I process?",
    a: "Unlimited on any paid plan. The free trial lets you process your first 10 videos, then you'll be asked to enter a license key.",
  },
  {
    q: "Can I use one license on multiple PCs?",
    a: "Starter and Pro come with 1 device slot. Studio includes 2 device slots. You can release a device from your dashboard and re-activate on a new PC anytime.",
  },
  {
    q: "What happens when my license expires?",
    a: "The desktop app stops processing new videos and asks you to renew. Clips you've already exported are yours to keep.",
  },
  {
    q: "Does it work offline?",
    a: "Yes — after the first license check-in, the app works offline for up to 30 days before it asks you to reconnect briefly to re-verify.",
  },
  {
    q: "Which platforms are supported?",
    a: "Windows is the primary target (installer + 1-click launcher). macOS and Linux work via Python + FFmpeg with the same codebase.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="border-t border-border/60 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Frequently asked
          </h2>
        </div>
        <dl className="mt-10 space-y-4">
          {faqs.map((f) => (
            <div
              key={f.q}
              className="rounded-xl border border-border/60 bg-card p-6"
            >
              <dt className="text-base font-semibold">{f.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
