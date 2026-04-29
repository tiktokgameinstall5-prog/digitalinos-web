"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(27,181,196,0.18),transparent_70%)]"
      />
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Badge
            variant="secondary"
            className="mb-5 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            <span className="mr-2 inline-block size-1.5 rounded-full bg-brand" />
            v0.2 · Bouncing overlays, quality templates, 1-click launcher
          </Badge>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
          className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl"
        >
          Batch video processing,{" "}
          <span className="text-brand">offline and unlimited.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
          className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
        >
          Watermark, upscale, and export dozens of videos in one click. Your clips
          never leave your PC. No usage caps. No subscriptions you&apos;ll forget
          about.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button asChild size="lg" className="h-11 px-6 text-sm font-medium">
            <Link href="/install">
              <Download className="mr-2 size-4" />
              Get started — free
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-11 px-6 text-sm font-medium"
          >
            <Link href="/#how">
              How it works
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="mt-5 text-xs text-muted-foreground"
        >
          Free for the first 10 videos. No credit card required.
        </motion.p>
      </div>

      {/* App screenshot frame */}
      <div className="mx-auto mt-14 max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="relative rounded-2xl border border-border/60 bg-card/60 p-2 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.25)] ring-1 ring-border/40 backdrop-blur-sm"
        >
          <div className="flex items-center gap-1.5 px-3 py-2">
            <span className="size-2.5 rounded-full bg-red-400/80" />
            <span className="size-2.5 rounded-full bg-yellow-400/80" />
            <span className="size-2.5 rounded-full bg-emerald-400/80" />
            <span className="ml-3 text-xs text-muted-foreground">
              Digitalinos · batch processing
            </span>
          </div>
          <div className="grid gap-3 rounded-xl bg-muted/40 p-4 md:grid-cols-[1fr_340px]">
            <div className="space-y-2">
              {[
                { name: "clip_001.mp4", progress: 100, meta: "1920×1080 · 00:42" },
                { name: "clip_002.mp4", progress: 100, meta: "1920×1080 · 01:03" },
                { name: "clip_003.mp4", progress: 72, meta: "3840×2160 · 00:58" },
                { name: "clip_004.mp4", progress: 0, meta: "1920×1080 · 00:31" },
                { name: "clip_005.mp4", progress: 0, meta: "1920×1080 · 00:24" },
              ].map((c) => (
                <div
                  key={c.name}
                  className="flex items-center gap-3 rounded-lg bg-background/80 px-3 py-2 text-sm"
                >
                  <span className="flex-1 truncate font-medium">{c.name}</span>
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    {c.meta}
                  </span>
                  <div className="relative h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-border/60 bg-background/80 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Quality template
              </p>
              <p className="mt-1 text-sm font-semibold">CapCut Ultra HD · 1440p</p>
              <div className="mt-4 h-px bg-border" />
              <p className="mt-4 text-xs font-medium text-muted-foreground">
                Watermark
              </p>
              <p className="mt-1 text-sm">
                Text · <span className="text-brand">Bounce</span> · slow
              </p>
              <div className="mt-4 h-px bg-border" />
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Queue</span>
                <span className="text-sm font-semibold">3 of 5 done</span>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[62%] rounded-full bg-brand" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
