import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { InstallGuide } from "@/components/install/install-guide";

export const metadata = {
  title: "Install Digitalinos — step-by-step",
  description:
    "Install Digitalinos on Windows, macOS, or Linux in under 10 minutes. Step-by-step terminal commands, expected output, and a full usage walkthrough.",
};

export default function InstallPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <InstallGuide />
        </div>
      </main>
      <Footer />
    </>
  );
}
