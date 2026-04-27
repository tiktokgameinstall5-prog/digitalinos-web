import Link from "next/link";
import { Download, ExternalLink, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { env } from "@/lib/env";

export const metadata = { title: "Download" };

export default function DownloadPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Download Digitalinos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One-click launcher for Windows. Source available for macOS and Linux.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Windows</h2>
          <p className="text-sm text-muted-foreground">
            Recommended. Includes a 1-click launch.bat that creates a Python venv
            and installs dependencies automatically.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a
                href={env.NEXT_PUBLIC_DESKTOP_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="mr-2 size-4" />
                Latest release
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="https://www.python.org/downloads/windows/" target="_blank">
                Install Python 3.11+ <ExternalLink className="ml-2 size-3.5" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="https://www.gyan.dev/ffmpeg/builds/" target="_blank">
                Install FFmpeg <ExternalLink className="ml-2 size-3.5" />
              </Link>
            </Button>
          </div>
          <ol className="list-decimal space-y-2 pl-5 text-sm">
            <li>Download the ZIP above and extract to a folder on your PC.</li>
            <li>Double-click <code>launch.bat</code> — first run sets up dependencies (~60s).</li>
            <li>Enter your license key in the app once the 10-video trial is used up.</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">macOS / Linux</h2>
          <p className="text-sm text-muted-foreground">
            Same codebase, run from source.
          </p>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/40 p-4 text-xs leading-relaxed">
            <code>{`git clone https://github.com/munnataiwan123-gif/video-batch-pro.git
cd video-batch-pro
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py`}</code>
          </pre>
          <p className="mt-3 text-xs text-muted-foreground">
            <Terminal className="mr-1 inline size-3" /> FFmpeg must be installed
            and on your PATH.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
