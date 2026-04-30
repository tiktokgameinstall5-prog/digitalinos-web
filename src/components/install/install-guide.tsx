import Link from "next/link";
import {
  Clock,
  Download,
  ExternalLink,
  FolderOpen,
  KeyRound,
  PlayCircle,
  Sparkles,
  Terminal,
  Eye,
  MousePointer2,
  Settings2,
  Image as ImageIcon,
  Zap,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";



const ZIP_HREF = "/downloads/Digitalinos-v0.2.1.zip";
const ZIP_FILENAME = "Digitalinos-v0.2.1.zip";

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="mt-2 overflow-x-auto rounded-lg border border-border/60 bg-muted/40 p-3 text-xs leading-relaxed">
      <code>{children}</code>
    </pre>
  );
}

function Inline({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted/40 px-1 py-0.5 text-[0.72rem] font-medium">
      {children}
    </code>
  );
}

function Expected({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 flex items-start gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs">
      <Eye className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
      <div>
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          What you should see:
        </span>{" "}
        <span className="text-foreground/80">{children}</span>
      </div>
    </div>
  );
}

function Explain({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 rounded-md border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
      <span className="font-semibold text-foreground">What this does: </span>
      {children}
    </div>
  );
}

type Step = {
  n: number;
  title: string;
  time: string;
  body: React.ReactNode;
  icon: React.ReactNode;
};

const STEPS: Step[] = [
  {
    n: 1,
    title: "Install Python (one time)",
    time: "~3 min",
    icon: <Terminal className="size-5" />,
    body: (
      <>
        <p className="text-sm">
          Digitalinos is built on Python. Download Python 3.11 (or newer) and
          run the installer.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="https://www.python.org/downloads/" target="_blank">
              Download Python <ExternalLink className="ml-1.5 size-3" />
            </Link>
          </Button>
        </div>

        <div className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs">
          <p className="font-semibold text-amber-600 dark:text-amber-400">
            Critical for Windows users:
          </p>
          <p className="mt-1 text-foreground/80">
            On the very first installer screen, tick the box{" "}
            <em>&ldquo;Add python.exe to PATH&rdquo;</em> at the bottom{" "}
            <strong>before</strong> clicking Install. Without this checkbox,
            the launcher will fail with{" "}
            <Inline>&apos;python&apos; is not recognized</Inline>.
          </p>
        </div>

        <p className="mt-3 text-sm">
          To verify the install worked, open a fresh terminal (PowerShell on
          Windows, Terminal on macOS / Linux) and run:
        </p>
        <CodeBlock>{`python --version`}</CodeBlock>
        <Expected>
          A line like <Inline>Python 3.11.9</Inline> (any 3.11+ is fine). On
          some systems the command is <Inline>python3</Inline> — try that if{" "}
          <Inline>python</Inline> isn&apos;t found.
        </Expected>
      </>
    ),
  },
  {
    n: 2,
    title: "Install FFmpeg (one time)",
    time: "~2 min",
    icon: <Terminal className="size-5" />,
    body: (
      <>
        <p className="text-sm">
          FFmpeg is the video encoder Digitalinos uses to actually process your
          clips. The app will not start without it. Pick your operating system
          below.
        </p>

        <div className="mt-5 space-y-6">
          {/* Windows */}
          <div className="rounded-lg border border-border/60 bg-card p-4">
            <p className="text-sm font-semibold">Windows</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Open <strong>PowerShell as Administrator</strong>: press the Start
              key, type <Inline>PowerShell</Inline>, right-click the result and
              choose <em>Run as administrator</em>. Click <em>Yes</em> on the
              UAC prompt. Then paste:
            </p>
            <CodeBlock>{`winget install --id Gyan.FFmpeg --silent`}</CodeBlock>
            <Explain>
              <Inline>winget</Inline> is Windows&apos; built-in package manager
              (ships with Windows 10 22H2+ and all Windows 11). This downloads
              FFmpeg from the official Gyan.dev build and adds it to your
              system PATH automatically. No GUI, no &quot;Next, Next, Finish&quot;.
            </Explain>
            <Expected>
              A few lines of progress, then{" "}
              <Inline>Successfully installed</Inline>. Takes ~30&ndash;60s
              depending on internet speed.
            </Expected>
            <p className="mt-3 text-xs text-foreground">
              <strong>Important:</strong> close that PowerShell window and open
              a <em>fresh</em> one — environment variables only refresh in new
              sessions. Then run:
            </p>
            <CodeBlock>{`ffmpeg -version`}</CodeBlock>
            <Expected>
              Multiple lines starting with{" "}
              <Inline>ffmpeg version 7.x.x</Inline> followed by build
              configuration. If you see{" "}
              <Inline>&apos;ffmpeg&apos; is not recognized</Inline>, your old
              terminal didn&apos;t pick up the new PATH — close every terminal
              window and open a new one (or reboot once).
            </Expected>

            <details className="mt-3 text-xs text-muted-foreground">
              <summary className="cursor-pointer font-medium text-foreground">
                No <Inline>winget</Inline>? Manual install (older Windows 10)
              </summary>
              <ol className="mt-2 list-decimal space-y-1.5 pl-5">
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
                  Right-click → <strong>Extract All&hellip;</strong> → move the
                  resulting folder to <Inline>C:\ffmpeg</Inline> so the path
                  becomes <Inline>C:\ffmpeg\bin\ffmpeg.exe</Inline>.
                </li>
                <li>
                  Open <strong>PowerShell as Administrator</strong> and paste:
                  <CodeBlock>{`[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\\ffmpeg\\bin", "Machine")`}</CodeBlock>
                </li>
                <li>
                  Close all terminals, open a fresh one, run{" "}
                  <Inline>ffmpeg -version</Inline>. If still failing, reboot.
                </li>
              </ol>
            </details>
          </div>

          {/* macOS */}
          <div className="rounded-lg border border-border/60 bg-card p-4">
            <p className="text-sm font-semibold">macOS</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Open <strong>Terminal</strong> (Spotlight ⌘+Space → type{" "}
              <Inline>Terminal</Inline> → Enter). Paste:
            </p>
            <CodeBlock>{`# 1. Install Homebrew if you don't already have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Install FFmpeg
brew install ffmpeg

# 3. Verify
ffmpeg -version`}</CodeBlock>
            <Explain>
              Line 1 installs Homebrew, the de-facto package manager on macOS.
              Line 2 fetches FFmpeg and all its codec libraries (~150 MB).
              Line 3 confirms the install worked.
            </Explain>
            <Expected>
              Step 1 will ask for your Mac password (admin install). Step 2
              shows download/build progress for ~3 minutes. Step 3 prints{" "}
              <Inline>ffmpeg version 7.x.x</Inline> with build details.
            </Expected>
          </div>

          {/* Linux */}
          <div className="rounded-lg border border-border/60 bg-card p-4">
            <p className="text-sm font-semibold">
              Linux (Ubuntu / Debian / Mint)
            </p>
            <CodeBlock>{`sudo apt update
sudo apt install -y ffmpeg
ffmpeg -version`}</CodeBlock>
            <Explain>
              <Inline>apt update</Inline> refreshes the package index.{" "}
              <Inline>apt install -y ffmpeg</Inline> installs FFmpeg + every
              codec library Digitalinos uses (the <Inline>-y</Inline> auto-
              accepts the &quot;OK to install ~80 MB?&quot; prompt).
            </Explain>
            <Expected>
              <Inline>ffmpeg version 6.x.x</Inline> on Ubuntu 24.04, or{" "}
              <Inline>ffmpeg version 4.x</Inline> on older distros — both
              work. On Fedora: <Inline>sudo dnf install ffmpeg</Inline>. On
              Arch: <Inline>sudo pacman -S ffmpeg</Inline>.
            </Expected>
          </div>
        </div>
      </>
    ),
  },
  {
    n: 3,
    title: "Download Digitalinos",
    time: "~5 sec",
    icon: <Download className="size-5" />,
    body: (
      <>
        <p className="text-sm">
          Click the button below. The download starts immediately — no GitHub,
          no redirects, no extra accounts.
        </p>
        <div className="mt-4">
          <Button asChild size="lg">
            <a href={ZIP_HREF} download={ZIP_FILENAME}>
              <Download className="mr-2 size-4" />
              Download {ZIP_FILENAME}
            </a>
          </Button>
        </div>
        <Explain>
          ~46 KB ZIP containing the Python source for Digitalinos v0.2 — the
          batch processor, the launcher scripts, and the requirements file.
          The first launch will pull in heavier libraries (PyQt6, Pillow,
          ffmpeg-python) automatically.
        </Explain>
      </>
    ),
  },
  {
    n: 4,
    title: "Extract the ZIP",
    time: "~10 sec",
    icon: <FolderOpen className="size-5" />,
    body: (
      <>
        <p className="text-sm">
          Find the downloaded <Inline>{ZIP_FILENAME}</Inline> file (usually in
          your <Inline>Downloads</Inline> folder) and extract it:
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm">
          <li>
            <strong>Windows:</strong> right-click →{" "}
            <em>Extract All&hellip;</em> → choose a destination → Extract.
          </li>
          <li>
            <strong>macOS:</strong> double-click the ZIP. Finder unpacks it
            into a new folder next to the ZIP.
          </li>
          <li>
            <strong>Linux:</strong> right-click → <em>Extract Here</em>, or
            run <Inline>unzip {ZIP_FILENAME}</Inline> in Terminal.
          </li>
        </ul>
        <p className="mt-3 text-sm">
          You&apos;ll get a folder called <Inline>Digitalinos-v0.2</Inline>.
          Move it somewhere convenient — your <Inline>Documents</Inline> or
          desktop is fine. Avoid paths with non-ASCII characters or spaces in
          unusual places.
        </p>
        <Expected>
          Inside the folder you should see: <Inline>app/</Inline>,{" "}
          <Inline>tests/</Inline>, <Inline>launch.bat</Inline>,{" "}
          <Inline>launch.sh</Inline>, <Inline>requirements.txt</Inline>,{" "}
          <Inline>run.py</Inline>, <Inline>README.md</Inline>,{" "}
          <Inline>LICENSE</Inline>.
        </Expected>
      </>
    ),
  },
  {
    n: 5,
    title: "Launch the app",
    time: "~60–90 sec first time, instant after",
    icon: <PlayCircle className="size-5" />,
    body: (
      <>
        <p className="text-sm">
          Open the <Inline>Digitalinos-v0.2</Inline> folder. Pick the path
          for your OS below.
        </p>

        <div className="mt-3 rounded-lg border border-border/60 bg-card p-4">
          <p className="text-sm font-semibold">Windows — recommended (PowerShell)</p>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm">
            <li>
              Press <Inline>Win</Inline> + <Inline>X</Inline> →{" "}
              <em>Windows PowerShell</em> (or <em>Terminal</em> on
              Windows 11). A regular user PowerShell is fine — no admin
              needed.
            </li>
            <li>
              Run, in order:
              <CodeBlock>{`cd C:\\Digitalinos-v0.2
python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`}</CodeBlock>
              When prompted, press <Inline>Y</Inline> and{" "}
              <Inline>Enter</Inline>.
            </li>
            <li>
              Then install dependencies and start the app:
              <CodeBlock>{`python -m pip install --upgrade pip
pip install -r requirements.txt
python run.py`}</CodeBlock>
            </li>
          </ol>
          <div className="mt-3 rounded-md border border-border/40 bg-muted/30 p-3 text-xs">
            <p className="font-semibold text-foreground">
              If you see <Inline>Activate.ps1 cannot be loaded</Inline>:
            </p>
            <p className="mt-1 text-muted-foreground">
              Run this once in the same PowerShell window, then re-run the
              activate line above:
            </p>
            <CodeBlock>{`Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\\.venv\\Scripts\\Activate.ps1`}</CodeBlock>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Subsequent launches: open PowerShell in the folder and just run{" "}
            <Inline>.\\.venv\\Scripts\\Activate.ps1</Inline> then{" "}
            <Inline>python run.py</Inline> — the venv is already set up.
          </p>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-card p-4">
            <p className="text-sm font-semibold">Windows — quick path</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Double-click <Inline>launch.bat</Inline>. It runs the same
              steps automatically inside a Command Prompt window.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              SmartScreen may show a warning the first time — click{" "}
              <em>More info</em> → <em>Run anyway</em>. The script is plain
              text; open it in Notepad first if you want to inspect it.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-card p-4">
            <p className="text-sm font-semibold">macOS / Linux</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Open Terminal in that folder and run:
            </p>
            <CodeBlock>{`chmod +x launch.sh
./launch.sh`}</CodeBlock>
          </div>
        </div>

        <Explain>
          The first launch creates an isolated Python environment in{" "}
          <Inline>.venv</Inline>, upgrades <Inline>pip</Inline>, then
          installs PyQt5 (the GUI framework), Pillow (image processing),
          and the other dependencies listed in{" "}
          <Inline>requirements.txt</Inline>. Everything stays inside the
          folder — uninstall = delete the folder.
        </Explain>

        <Expected>
          You&apos;ll see PowerShell scroll text like{" "}
          <Inline>Collecting PyQt5...</Inline>,{" "}
          <Inline>Downloading PyQt5_Qt5-5.x.x...</Inline>, then{" "}
          <Inline>Successfully installed&hellip;</Inline>. After 60&ndash;90
          seconds the <strong>Digitalinos app window</strong> opens. Every
          subsequent launch is instant (the venv is reused).
        </Expected>

        <div className="mt-4 rounded-md border border-border/40 bg-muted/30 p-3 text-xs text-muted-foreground">
          <strong className="text-foreground">Stuck on an error?</strong>{" "}
          Paste the exact PowerShell text or a screenshot in your support
          email and we&apos;ll fix it line-by-line.
        </div>
      </>
    ),
  },
];

type UsageStep = {
  n: number;
  title: string;
  body: React.ReactNode;
  icon: React.ReactNode;
};

const USAGE: UsageStep[] = [
  {
    n: 1,
    title: "Add your videos to the queue",
    icon: <MousePointer2 className="size-5" />,
    body: (
      <>
        <p className="text-sm">
          The app opens to an empty queue. Two ways to add clips:
        </p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm">
          <li>
            <strong>Drag &amp; drop:</strong> select files in your file manager
            and drop them anywhere on the queue area. Hold{" "}
            <Inline>Ctrl</Inline> / <Inline>Shift</Inline> to multi-select.
          </li>
          <li>
            <strong>Add files button:</strong> click <em>Add files</em> in the
            toolbar to open a native file picker.
          </li>
        </ul>
        <p className="mt-3 text-sm">
          Each row shows filename, resolution, and duration. Reorder by
          dragging, remove with the <Inline>×</Inline> button on hover.
        </p>
      </>
    ),
  },
  {
    n: 2,
    title: "Pick a quality template",
    icon: <Settings2 className="size-5" />,
    body: (
      <>
        <p className="text-sm">
          On the right panel, choose how the output should be encoded. You
          don&apos;t need to know FFmpeg flags — the templates handle it.
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="rounded-md border border-border/60 bg-muted/20 p-2.5">
            <strong>YouTube 1080p</strong> — H.264, CRF 18, fast. Good for
            standard YouTube uploads. Most-used setting.
          </li>
          <li className="rounded-md border border-border/60 bg-muted/20 p-2.5">
            <strong>CapCut Ultra HD 1440p</strong> — H.264, CRF 16, Lanczos
            upscale + sharpen. Crisp at 1440p without re-shooting.
          </li>
          <li className="rounded-md border border-border/60 bg-muted/20 p-2.5">
            <strong>4K Crisp 2160p</strong> — H.265 (HEVC), CRF 20, Lanczos
            upscale. Premium quality, larger files, slower encode.
          </li>
        </ul>
      </>
    ),
  },
  {
    n: 3,
    title: "(Optional) Add a watermark",
    icon: <ImageIcon className="size-5" />,
    body: (
      <>
        <p className="text-sm">
          Switch to the <em>Watermark</em> tab. Pick one of:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          <li>
            <strong>Text watermark:</strong> type any string — your channel
            name, a hashtag, &copy; line.
          </li>
          <li>
            <strong>Image / logo:</strong> upload a transparent PNG.
          </li>
        </ul>
        <p className="mt-3 text-sm">
          Choose <strong>fixed position</strong> (corner / center) or{" "}
          <strong>bouncing</strong> (DVD-screensaver style with slow / medium /
          fast speeds). Drop-shadow toggle is included.
        </p>
      </>
    ),
  },
  {
    n: 4,
    title: "Pick output folder + click Start",
    icon: <Zap className="size-5" />,
    body: (
      <>
        <p className="text-sm">
          At the bottom, set <em>Output folder</em> (defaults to{" "}
          <Inline>./output</Inline> next to your input). Tick{" "}
          <em>Bundle as ZIP when done</em> if you want one archive instead of
          loose files. Then click the big <strong>Start</strong> button.
        </p>
        <p className="mt-3 text-sm">
          A progress bar appears per row plus an overall ETA. The status pane
          shows live FFmpeg output (frames/sec, bitrate). Pause / cancel any
          time. You can keep adding new clips while a queue is running.
        </p>
        <Expected>
          When done, the status bar shows{" "}
          <Inline>Finished — N clips in M:SS</Inline> and (optionally) a{" "}
          <Inline>ZIP saved to&hellip;</Inline> line. The output folder opens
          automatically on Windows.
        </Expected>
      </>
    ),
  },
  {
    n: 5,
    title: "First 10 videos are free",
    icon: <Sparkles className="size-5" />,
    body: (
      <>
        <p className="text-sm">
          Trial counter sits in the top-right corner — every successfully
          processed clip ticks it up. After 10 videos the app pauses the queue
          and asks for a license key.
        </p>
      </>
    ),
  },
  {
    n: 6,
    title: "Activate your license",
    icon: <KeyRound className="size-5" />,
    body: (
      <>
        <p className="text-sm">
          Click <strong>Activate License</strong> (or <em>Settings → License</em>
          ). Paste your key in <Inline>DGIT-XXXX-XXXX-XXXX-XXXX</Inline> format
          and click <em>Activate</em>.
        </p>
        <p className="mt-3 text-sm">
          The app contacts <Inline>digitalinos-web.vercel.app</Inline>,
          validates the key, binds it to this PC&apos;s hardware fingerprint
          (CPU + motherboard + MAC), and unlocks unlimited processing for the
          duration of your plan.
        </p>
        <Expected>
          A green banner: <Inline>License active — Pro plan, expires
          DD/MM/YYYY</Inline>. The trial counter disappears. You can keep using
          the app offline for up to 30 days between online check-ins.
        </Expected>
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

export function InstallGuide() {
  const totalTime = "~5–10 min";
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <Badge
          variant="secondary"
          className="mb-3 rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 text-[0.7rem] font-medium text-muted-foreground"
        >
          <Clock className="mr-1.5 size-3" />
          Total time {totalTime}
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Download &amp; install Digitalinos
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Two parts: <strong>Install</strong> (one-time prerequisites + the
          app), then <strong>Use</strong> (drag clips, pick a template, click
          Start). All processing happens on your PC — your videos never leave
          your machine.
        </p>
      </div>

      {/* Quick download */}
      <Card className="border-primary/40 bg-gradient-to-br from-primary/10 via-background to-background">
        <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Already done the install?</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Direct download — no GitHub, no redirects.
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

      {/* Part 1 - Install */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Package className="size-4" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Part 1 — Install (one time, ~5 min)
            </h2>
            <p className="text-xs text-muted-foreground">
              Set up Python + FFmpeg + the app. You only do this once per PC.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {STEPS.map((step) => (
            <Card key={step.n} className="overflow-hidden">
              <CardHeader className="border-b border-border/60 bg-muted/20">
                <div className="flex items-start gap-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                    <span className="text-sm font-semibold">{step.n}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base font-semibold">
                      <span className="text-muted-foreground/80">
                        {step.icon}
                      </span>
                      {step.title}
                      <Badge
                        variant="secondary"
                        className="ml-1 rounded-full border border-border/60 bg-background px-2 py-0 text-[0.65rem] font-normal text-muted-foreground"
                      >
                        <Clock className="mr-1 size-2.5" />
                        {step.time}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pl-[calc(2.25rem+1.5rem)] pt-5">
                {step.body}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Part 2 - Usage */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-500">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Part 2 — How to use Digitalinos
            </h2>
            <p className="text-xs text-muted-foreground">
              Once the app window is open, here&apos;s exactly what you do.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {USAGE.map((u) => (
            <Card key={u.n} className="overflow-hidden">
              <CardHeader className="border-b border-border/60 bg-emerald-500/5">
                <div className="flex items-start gap-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/30 dark:text-emerald-400">
                    <span className="text-sm font-semibold">{u.n}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-base font-semibold">
                      <span className="text-muted-foreground/80">{u.icon}</span>
                      {u.title}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pl-[calc(2.25rem+1.5rem)] pt-5">
                {u.body}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Troubleshooting */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader>
          <h2 className="text-lg font-semibold">Common problems &amp; fixes</h2>
          <p className="text-xs text-muted-foreground">
            Every issue we&apos;ve seen, with the exact command to fix it.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="font-semibold">Launcher window flashes and closes</p>
            <p className="mt-1 text-muted-foreground">
              The launcher hit an error and the window auto-closed. Open
              PowerShell / Terminal in the <Inline>Digitalinos-v0.2</Inline>{" "}
              folder and run the launcher manually:
            </p>
            <CodeBlock>{`# Windows PowerShell
.\\launch.bat

# macOS / Linux
./launch.sh`}</CodeBlock>
            <p className="mt-1 text-xs text-muted-foreground">
              You&apos;ll now see the actual error message before the window
              closes.
            </p>
          </div>

          <div>
            <p className="font-semibold">
              <Inline>&apos;python&apos; is not recognized</Inline>
            </p>
            <p className="mt-1 text-muted-foreground">
              You skipped the &ldquo;Add Python to PATH&rdquo; checkbox in
              step 1. Re-run the Python installer, choose <em>Modify</em>, and
              tick the PATH option. Or uninstall + reinstall with the box
              ticked.
            </p>
          </div>

          <div>
            <p className="font-semibold">
              <Inline>ffmpeg not found</Inline> or{" "}
              <Inline>ffmpeg: command not found</Inline>
            </p>
            <p className="mt-1 text-muted-foreground">
              FFmpeg installed but isn&apos;t on this terminal&apos;s PATH yet.
              Close every terminal window, open a new one, and re-run:
            </p>
            <CodeBlock>{`ffmpeg -version`}</CodeBlock>
            <p className="mt-1 text-muted-foreground">
              If still missing, FFmpeg never installed correctly — repeat
              step 2 above. On Windows, a one-time reboot fixes 99% of stuck
              cases.
            </p>
          </div>

          <div>
            <p className="font-semibold">
              First-launch <Inline>pip install</Inline> hangs or fails
            </p>
            <p className="mt-1 text-muted-foreground">
              Usually a network / firewall issue. Try a different network or
              run manually:
            </p>
            <CodeBlock>{`# Inside the Digitalinos-v0.2 folder
python -m pip install --upgrade pip
python -m pip install -r requirements.txt`}</CodeBlock>
          </div>

          <div>
            <p className="font-semibold">License won&apos;t activate</p>
            <p className="mt-1 text-muted-foreground">
              Make sure you copied the <em>full</em> key including all dashes
              (<Inline>DGIT-XXXX-XXXX-XXXX-XXXX</Inline>). Each key is bound to
              your account here and locked to the PC that activates it. To
              move to a new PC, release the key from your{" "}
              <Link href="/dashboard" className="text-primary underline-offset-2 hover:underline">
                dashboard
              </Link>{" "}
              first.
            </p>
          </div>

          <div>
            <p className="font-semibold">Encoding is slow</p>
            <p className="mt-1 text-muted-foreground">
              4K Crisp 2160p uses H.265 (HEVC) which is CPU-heavy. If your
              machine doesn&apos;t have a recent GPU, switch to{" "}
              <em>YouTube 1080p</em> or <em>CapCut 1440p</em> templates —
              they&apos;re 5&ndash;10× faster on CPU and look identical at
              normal viewing distances.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
        <CardContent className="flex flex-col items-start gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold">Ready to go unlimited?</p>
            <p className="mt-1 text-xs text-muted-foreground">
              The 10-video trial unlocks every feature. Pick a plan when
              you&apos;re ready.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/pricing">See plans</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
