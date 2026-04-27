import Link from "next/link";
import { Clock, ExternalLink, Code2, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata = { title: "Download" };

const SOURCE_REPO = "https://github.com/munnataiwan123-gif/video-batch-pro";

export default function DownloadPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Download Digitalinos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The desktop app processes videos entirely on your PC — your clips
          never leave your machine.
        </p>
      </div>

      <Card className="border-primary/40 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            <h2 className="text-lg font-semibold">Windows installer — coming soon</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            We&apos;re packaging the v0.2 one-click installer (.exe). In the
            meantime, you can run the tool from source — it takes ~2 minutes.
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            License keys you activate now will work as soon as the installer
            ships. Your free trial of 10 videos starts the first time you
            launch the app.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Run from source (Windows / macOS / Linux)</h2>
          <p className="text-sm text-muted-foreground">
            Works on any OS with Python 3.11+ and FFmpeg installed.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href={SOURCE_REPO} target="_blank" rel="noopener noreferrer">
                <Code2 className="mr-2 size-4" />
                View source on GitHub
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="https://www.python.org/downloads/" target="_blank">
                Install Python 3.11+ <ExternalLink className="ml-2 size-3.5" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="https://ffmpeg.org/download.html" target="_blank">
                Install FFmpeg <ExternalLink className="ml-2 size-3.5" />
              </Link>
            </Button>
          </div>
          <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/40 p-4 text-xs leading-relaxed">
            <code>{`git clone ${SOURCE_REPO}.git
cd video-batch-pro
python -m venv .venv
# Windows:  .venv\\Scripts\\activate
# macOS/Linux:  source .venv/bin/activate
pip install -r requirements.txt
python run.py`}</code>
          </pre>
          <p className="text-xs text-muted-foreground">
            <Terminal className="mr-1 inline size-3" />
            FFmpeg must be installed and on your PATH. On Windows we recommend
            the gyan.dev builds; on macOS, <code>brew install ffmpeg</code>.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Activating your license</h2>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-5 text-sm">
            <li>Launch the desktop app and process up to 10 videos for free.</li>
            <li>
              When the trial is used up, paste your license key (format
              <code className="ml-1 rounded bg-muted/40 px-1 py-0.5 text-[0.7rem]">DGIT-XXXX-XXXX-XXXX-XXXX</code>)
              into the app&apos;s License field.
            </li>
            <li>The app validates against this site and unlocks unlimited processing.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
