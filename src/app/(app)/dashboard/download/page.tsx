import Link from "next/link";
import { Download, ExternalLink, FileArchive, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata = { title: "Download" };

const ZIP_HREF = "/downloads/Digitalinos-v0.2.zip";
const ZIP_FILENAME = "Digitalinos-v0.2.zip";

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
            <FileArchive className="size-4 text-primary" />
            <h2 className="text-lg font-semibold">Digitalinos v0.2 — full ZIP</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Cross-platform package. Includes <code>launch.bat</code> for Windows
            and <code>launch.sh</code> for macOS / Linux. First launch installs
            dependencies automatically (~60 seconds).
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <a href={ZIP_HREF} download={ZIP_FILENAME}>
                <Download className="mr-2 size-4" />
                Download {ZIP_FILENAME}
              </a>
            </Button>
            <span className="text-xs text-muted-foreground">
              No GitHub redirect. Direct download.
            </span>
          </div>

          <ol className="list-decimal space-y-1.5 pl-5 text-sm">
            <li>Extract the ZIP to a folder on your PC.</li>
            <li>
              <strong>Windows:</strong> double-click <code>launch.bat</code>.{" "}
              <strong>macOS / Linux:</strong> run <code>./launch.sh</code> in
              the terminal.
            </li>
            <li>
              The first run creates a Python virtualenv and installs
              dependencies.
            </li>
            <li>
              Process up to <strong>10 videos</strong> for free. After that,
              paste your license key into the License field — your key
              format is{" "}
              <code className="rounded bg-muted/40 px-1 py-0.5 text-[0.7rem]">
                DGIT-XXXX-XXXX-XXXX-XXXX
              </code>
              .
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Prerequisites</h2>
          <p className="text-sm text-muted-foreground">
            You need these installed once. The launcher takes care of the rest.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="https://www.python.org/downloads/" target="_blank">
                Python 3.11+ <ExternalLink className="ml-2 size-3.5" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="https://ffmpeg.org/download.html" target="_blank">
                FFmpeg <ExternalLink className="ml-2 size-3.5" />
              </Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            <Terminal className="mr-1 inline size-3" />
            FFmpeg must be on your PATH. On Windows we recommend the gyan.dev
            builds; on macOS, <code>brew install ffmpeg</code>; on Linux,
            <code>apt install ffmpeg</code>.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Manual install (advanced)</h2>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/40 p-4 text-xs leading-relaxed">
            <code>{`# After extracting the ZIP:
cd Digitalinos-v0.2
python -m venv .venv
# Windows:  .venv\\Scripts\\activate
# macOS/Linux:  source .venv/bin/activate
pip install -r requirements.txt
python run.py`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
