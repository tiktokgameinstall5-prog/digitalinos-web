import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Offline batch video processing with watermarks, quality templates, and
            bouncing overlays. Your clips never leave your PC.
          </p>
        </div>
        <Column title="Product">
          <FooterLink href="/#features">Features</FooterLink>
          <FooterLink href="/pricing">Pricing</FooterLink>
          <FooterLink href="/signup">Download</FooterLink>
        </Column>
        <Column title="Support">
          <FooterLink href="/#faq">FAQ</FooterLink>
          <FooterLink href="mailto:support@digitalinos.app">
            Email support
          </FooterLink>
          <FooterLink href="https://github.com/munnataiwan123-gif/video-batch-pro">
            GitHub
          </FooterLink>
        </Column>
        <Column title="Legal">
          <FooterLink href="/terms">Terms</FooterLink>
          <FooterLink href="/privacy">Privacy</FooterLink>
        </Column>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Digitalinos. All rights reserved.</p>
          <p>Made for creators who ship.</p>
        </div>
      </div>
    </footer>
  );
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-medium text-foreground">{title}</h4>
      <ul className="space-y-2 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        {children}
      </Link>
    </li>
  );
}
