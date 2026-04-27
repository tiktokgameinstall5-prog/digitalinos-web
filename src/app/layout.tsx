import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Digitalinos — Professional batch video processing",
    template: "%s · Digitalinos",
  },
  description:
    "Offline batch video processor with watermarks, quality templates, and DVD-style bouncing overlays. Process unlimited videos on your own PC.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Strip attributes injected by browser extensions (Bitdefender,
          Grammarly, etc.) that run before React hydrates and cause hydration
          mismatches. Runs synchronously in <head>, before the React bundle.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{new MutationObserver(function(muts){muts.forEach(function(m){if(m.type==='attributes'&&/^(bis_|__processed|data-gr|data-new-gr)/.test(m.attributeName||'')){m.target.removeAttribute(m.attributeName)}})}).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['bis_skin_checked','bis_register','__processed_','data-gr-ext-installed','data-new-gr-c-s-check-loaded']})}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <TooltipProvider>
          {children}
          <Toaster position="top-right" richColors />
        </TooltipProvider>
      </body>
    </html>
  );
}
