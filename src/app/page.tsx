import { HeroSection } from "@/components/home/hero-section";
import { PageTabs } from "@/components/home/page-tabs";
import { createAdminClient } from "@/lib/supabase/server";
import { siteConfig } from "@/config/site";
import { galleryImages as staticGalleryImages } from "@/config/images";
import type { GalleryImage } from "@/config/images";

export const dynamic = "force-dynamic";

interface PageData {
  count: number;
  primaryImageUrl: string | null;
  galleryImages: GalleryImage[];
  bio: string;
}

async function getPageData(): Promise<PageData> {
  const supabase = createAdminClient();

  // Run each query independently — a missing table (migrations not yet run)
  // only falls back that specific value, not the whole page
  const [countResult, photosResult, bioResult] = await Promise.allSettled([
    supabase.from("tributes").select("*", { count: "exact", head: true }),
    supabase.from("photos").select("url, is_primary").order("created_at", { ascending: true }),
    supabase.from("site_content").select("value").eq("key", "bio").single(),
  ]);

  const count =
    countResult.status === "fulfilled" ? (countResult.value.count ?? 0) : 0;

  const photos =
    photosResult.status === "fulfilled" ? (photosResult.value.data ?? []) : [];

  const bio =
    bioResult.status === "fulfilled"
      ? (bioResult.value.data?.value ?? siteConfig.bio)
      : siteConfig.bio;

  const primaryPhoto = photos.find((p) => p.is_primary);
  const primaryImageUrl = primaryPhoto?.url ?? null;

  const galleryPhotos: GalleryImage[] = photos
    .filter((p) => !p.is_primary)
    .map((p) => ({ src: p.url, alt: "Marshell Okatch" }));

  const galleryImages =
    galleryPhotos.length > 0 ? galleryPhotos : staticGalleryImages;

  return { count, primaryImageUrl, galleryImages, bio };
}

export default async function HomePage() {
  const { count, primaryImageUrl, galleryImages, bio } = await getPageData();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection primaryImageUrl={primaryImageUrl} />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-24 sm:pb-10">
          <PageTabs
            initialCount={count}
            bio={bio}
            galleryImages={galleryImages}
          />
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
