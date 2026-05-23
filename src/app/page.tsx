import { HeroSection } from "@/components/home/hero-section";
import { PageTabs } from "@/components/home/page-tabs";
import { createAdminClient } from "@/lib/supabase/server";

async function getTributeCount(): Promise<number> {
  try {
    const supabase = createAdminClient();
    const { count } = await supabase
      .from("tributes")
      .select("*", { count: "exact", head: true });
    return count ?? 0;
  } catch {
    return 0;
  }
}

export default async function HomePage() {
  const initialCount = await getTributeCount();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-24 sm:pb-10">
          <PageTabs initialCount={initialCount} />
        </div>
      </main>

      <footer className="border-t border-border py-5 px-4">
        <p className="text-center text-xs text-muted-foreground font-sans">
          &copy; {new Date().getFullYear()} &mdash; Built by{" "}
          <a
            href="https://www.brightexsolutions.co.ke"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Brightex Solutions
          </a>
        </p>
      </footer>
    </div>
  );
}
