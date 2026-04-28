import Link from "next/link";
import {
  CheckCircle2,
  Download,
  ExternalLink,
  FolderOpen,
  KeyRound,
  PlayCircle,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata = { title: "Download & install" };

const ZIP_HREF = "/downloads/Digitalinos-v0.2.zip";
const ZIP_FILENAME = "Digitalinos-v0.2.zip";

type Step = {
  n: number;
  title: string;
  body: React.ReactNode;
  icon: React.ReactNode;
};

const STEPS: Step[] = [
  {
    n: 1,
    title: "Install Python (one time)",
    icon: <Terminal className="size-5" />,
    body: (
      <>
        <p className="text-sm">
          Digitalinos uses Python to do the video processing. Download
          Python 3.11 (or newer) and install it.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="https://www.python.org/downloads/" target="_blank">
              Download Python <ExternalLink className="ml-1.5 size-3" />
            </Link>
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          <strong>Important (Windows users):</strong> on the first installer
          screen, tick the box that says{" "}
          <em>&ldquo;Add python.exe to PATH&rdquo;</em> before clicking
          Install. Without this, the launcher will not find Python.
        </p>
      </>
    ),
  },
  {
    n: 2,
    title: "Install FFmpeg (one time)",
    icon: <Terminal className="size-5" />,
    body: (
      <>
        <p className="text-sm">
          FFmpeg is the engine that actually encodes and merges your videos.
          The Digitalinos app will not start without it. Pick your OS below
          and copy-paste the commands into your terminal.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <p className="text-sm font-semibold">Windows (recommended path)</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Open <strong>PowerShell</strong> as Administrator (Start menu
              &rarr; type &ldquo;PowerShell&rdquo; &rarr; right-click &rarr;{" "}
              <em>Run as administrator</em>) and paste:
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border/60 bg-muted/40 p-3 text-xs leading-relaxed">
              <code>{`winget install --id Gyan.FFmpeg --silent`}</code>
            </pre>
            <p className="mt-2 text-xs text-muted-foreground">
              <strong>Then close PowerShell and open a NEW one</strong> so PATH
              picks up the new install. Verify with{" "}
              <code className="rounded bg-muted/40 px-1 py-0.5 text-[0.7rem]">
                ffmpeg -version
              </code>
              .
            </p>
            <details className="mt-2 text-xs text-muted-foreground">
              <summary className="cursor-pointer font-medium">
                No <code>winget</code>? Manual install
              </summary>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>
                  Download the &ldquo;release essentials&rdquo; ZIP from{" "}
                  <Link
                    href="https://www.gyan.dev/ffmpeg/builds/"
                    target="_blank"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    gyan.dev/ffmpeg/builds
                  </Link>
                  .
                </li>
                <li>
                  Right-click &rarr; <strong>Extract All&hellip;</strong> &rarr;
                  move the resulting folder to{" "}
                  <code>C:\ffmpeg</code> so the path becomes{" "}
                  <code>C:\ffmpeg\bin\ffmpeg.exe</code>.
                </li>
                <li>
                  Open <strong>PowerShell as Administrator</strong> and paste:
                </li>
              </ol>
              <pre className="mt-2 overflow-x-auto rounded-lg border border-border/60 bg-muted/40 p-3 text-xs leading-relaxed">
                <code>{`[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\\ffmpeg\\bin", "Machine")`}</code>
              </pre>
              <p className="mt-2">
                Close ALL PowerShell / Command Prompt windows, open a new one,
                and run <code>ffmpeg -version</code>. If you still see
                &ldquo;not recognized&rdquo;, restart your PC once.
              </p>
            </details>
          </div>

          <div>
            <p className="text-sm font-semibold">macOS</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Open <strong>Terminal</strong> (Spotlight &rarr; type
              &ldquo;Terminal&rdquo;) and paste:
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border/60 bg-muted/40 p-3 text-xs leading-relaxed">
              <code>{`# Install Homebrew first if you don't have it:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install FFmpeg:
brew install ffmpeg

# Verify:
ffmpeg -version`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm font-semibold">
              Linux (Ubuntu / Debian / Mint)
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border/60 bg-muted/40 p-3 text-xs leading-relaxed">
              <code>{`sudo apt update
sudo apt install -y ffmpeg
ffmpeg -version`}</code>
            </pre>
            <p className="mt-2 text-xs text-muted-foreground">
              On Fedora/RHEL: <code>sudo dnf install ffmpeg</code>. On Arch:{" "}
              <code>sudo pacman -S ffmpeg</code>.
            </p>
          </div>
        </div>

        <p className="mt-4 rounded-md border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
          <strong>Verify it worked:</strong> open a NEW terminal window and
          run{" "}
          <code className="rounded bg-muted/40 px-1 py-0.5 text-[0.7rem]">
            ffmpeg -version
          </code>
          . You should see &ldquo;ffmpeg version&hellip;&rdquo; followed by
          build info. If you see &ldquo;ffmpeg not recognized&rdquo; or
          &ldquo;command not found&rdquo;, FFmpeg isn&apos;t on your PATH yet
          &mdash; close every terminal window and open a fresh one (PATH only
          updates for new sessions).
        </p>
      </>
    ),
  },
  {
    n: 3,
    title: "Download Digitalinos",
    icon: <Download className="size-5" />,
    body: (
      <>
        <p className="text-sm">
          Click the button below. The download starts immediately &mdash; no
          GitHub, no extra accounts.
        </p>
        <div className="mt-4">
          <Button asChild size="lg">
            <a href={ZIP_HREF} download={ZIP_FILENAME}>
              <Download className="mr-2 size-4" />
              Download {ZIP_FILENAME}
            </a>
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          File size ~46 KB. The Python source code that makes Digitalinos
          run.
        </p>
      </>
    ),
  },
  {
    n: 4,
    title: "Extract the ZIP",
    icon: <FolderOpen className="size-5" />,
    body: (
      <>
        <p className="text-sm">
          Right-click the downloaded{" "}
          <code className="rounded bg-muted/40 px-1 py-0.5 text-[0.7rem]">
            {ZIP_FILENAME}
          </code>{" "}
          file and choose <strong>Extract All&hellip;</strong> (Windows),{" "}
          double-click it (macOS), or <code>unzip</code> it (Linux).
        </p>
        <p className="mt-2 text-sm">
          You&apos;ll get a folder called{" "}
          <code className="rounded bg-muted/40 px-1 py-0.5 text-[0.7rem]">
            Digitalinos-v0.2
          </code>
          . Move it somewhere convenient like{" "}
          <code className="rounded bg-muted/40 px-1 py-0.5 text-[0.7rem]">
            Documents
          </code>{" "}
          or your desktop.
        </p>
      </>
    ),
  },
  {
    n: 5,
    title: "Launch the app",
    icon: <PlayCircle className="size-5" />,
    body: (
      <>
        <p className="text-sm">
          Open the <code>Digitalinos-v0.2</code> folder and:
        </p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm">
          <li>
            <strong>Windows:</strong> double-click{" "}
            <code className="rounded bg-muted/40 px-1 py-0.5 text-[0.7rem]">
              launch.bat
            </code>
            .
          </li>
          <li>
            <strong>macOS / Linux:</strong> open Terminal in that folder and
            run{" "}
            <code className="rounded bg-muted/40 px-1 py-0.5 text-[0.7rem]">
              ./launch.sh
            </code>
            .
          </li>
        </ul>
        <p className="mt-3 text-sm">
          The first run takes about 60&ndash;90 seconds &mdash; the launcher
          builds an isolated Python environment and downloads the libraries
          it needs. After that, every launch is instant.
        </p>
      </>
    ),
  },
  {
    n: 6,
    title: "Use your free trial",
    icon: <CheckCircle2 className="size-5" />,
    body: (
      <>
        <p className="text-sm">
          The app opens with a clean batch processor. Drag &amp; drop your
          videos in, pick a quality template, and hit{" "}
          <strong>Start</strong>. The first <strong>10 videos</strong> are
          free &mdash; no signup needed inside the app.
        </p>
      </>
    ),
  },
  {
    n: 7,
    title: "Enter your license key",
    icon: <KeyRound className="size-5" />,
    body: (
      <>
        <p className="text-sm">
          When the trial is used up, the app shows{" "}
          <em>&ldquo;Trial finished &mdash; enter your license key&rdquo;</em>
          . Click <strong>Activate License</strong> and paste the key you
          bought (format{" "}
          <code className="rounded bg-muted/40 px-1 py-0.5 text-[0.7rem]">
            DGIT-XXXX-XXXX-XXXX-XXXX
          </code>
          ).
        </p>
        <p className="mt-3 text-sm">
          The app validates the key with this site, binds it to your PC, and
          unlocks unlimited processing for the duration of your plan.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/pricing">Buy a key</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/dashboard">View your keys</Link>
          </Button>
        </div>
      </>
    ),
  },
];

export default function DownloadPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Download &amp; install Digitalinos
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Follow the 7 steps below. Most people are processing their first
          video in under 5 minutes. Your clips never leave your PC.
        </p>
      </div>

      <Card className="border-primary/40 bg-primary/5">
        <CardContent className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Just want the file?</p>
            <p className="text-xs text-muted-foreground">
              Direct download &mdash; no GitHub, no redirects.
            </p>
          </div>
          <Button asChild size="lg">
            <a href={ZIP_HREF} download={ZIP_FILENAME}>
              <Download className="mr-2 size-4" />
              Download {ZIP_FILENAME}
            </a>
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-5">
        {STEPS.map((step) => (
          <Card key={step.n} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-sm font-semibold">{step.n}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-base font-semibold">
                    <span className="text-muted-foreground/80">{step.icon}</span>
                    {step.title}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pl-[calc(2.5rem+1rem)]">
              {step.body}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Need help?</h2>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Launcher closes immediately?</strong> Open Command Prompt /
            Terminal in the folder and run{" "}
            <code className="rounded bg-muted/40 px-1 py-0.5 text-[0.7rem]">
              python run.py
            </code>{" "}
            &mdash; you&apos;ll see the actual error.
          </p>
          <p>
            <strong>&ldquo;python is not recognized&rdquo;:</strong> you missed
            the &ldquo;Add to PATH&rdquo; checkbox in step 1. Re-run the Python
            installer and tick it.
          </p>
          <p>
            <strong>&ldquo;ffmpeg not found&rdquo;:</strong> step 2 was skipped
            or FFmpeg isn&apos;t on your PATH. Open a new terminal and run{" "}
            <code className="rounded bg-muted/40 px-1 py-0.5 text-[0.7rem]">
              ffmpeg -version
            </code>{" "}
            to verify.
          </p>
          <p>
            <strong>License won&apos;t activate?</strong> Make sure you copied
            the full <code>DGIT-</code> key including the dashes. Each key is
            tied to your account and bound to one PC.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
