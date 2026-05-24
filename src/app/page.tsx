import { cache } from "react";
import type { Metadata } from "next";
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
  heroName: string | null;
  bornYear: string | null;
  diedYear: string | null;
  burialDate: string | null;
  contributionEnabled: boolean;
  contributionMethod: string;
  contributionPhone: string;
  contributionName: string;
  contributionNote: string;
  displayName: string;
}

const getPageData = cache(async (): Promise<PageData> => {
  const supabase = createAdminClient();

  const [
    countResult, photosResult, bioResult, nameResult, bornResult, diedResult, burialResult,
    contribEnabledResult, contribMethodResult, contribPhoneResult, contribNameResult, contribNoteResult,
  ] = await Promise.allSettled([
    supabase.from("tributes").select("*", { count: "exact", head: true }),
    supabase.from("photos").select("url, is_primary").order("created_at", { ascending: true }),
    supabase.from("site_content").select("value").eq("key", "bio").single(),
    supabase.from("site_content").select("value").eq("key", "hero_name").single(),
    supabase.from("site_content").select("value").eq("key", "born_year").single(),
    supabase.from("site_content").select("value").eq("key", "died_year").single(),
    supabase.from("site_content").select("value").eq("key", "burial_date").single(),
    supabase.from("site_content").select("value").eq("key", "contribution_enabled").single(),
    supabase.from("site_content").select("value").eq("key", "contribution_method").single(),
    supabase.from("site_content").select("value").eq("key", "contribution_phone").single(),
    supabase.from("site_content").select("value").eq("key", "contribution_name").single(),
    supabase.from("site_content").select("value").eq("key", "contribution_note").single(),
  ]);

  const count =
    countResult.status === "fulfilled" ? (countResult.value.count ?? 0) : 0;

  const photos =
    photosResult.status === "fulfilled" ? (photosResult.value.data ?? []) : [];

  const bio =
    bioResult.status === "fulfilled"
      ? (bioResult.value.data?.value ?? siteConfig.bio)
      : siteConfig.bio;

  const heroName =
    nameResult.status === "fulfilled" ? (nameResult.value.data?.value ?? null) : null;

  const bornYear =
    bornResult.status === "fulfilled" ? (bornResult.value.data?.value || null) : null;

  const diedYear =
    diedResult.status === "fulfilled" ? (diedResult.value.data?.value || null) : null;

  const burialDate =
    burialResult.status === "fulfilled" ? (burialResult.value.data?.value ?? null) : null;

  const contributionEnabled =
    contribEnabledResult.status === "fulfilled"
      ? (contribEnabledResult.value.data?.value ?? "true") !== "false"
      : true;

  const contributionMethod =
    contribMethodResult.status === "fulfilled"
      ? (contribMethodResult.value.data?.value ?? "M-Pesa")
      : "M-Pesa";

  const contributionPhone =
    contribPhoneResult.status === "fulfilled"
      ? (contribPhoneResult.value.data?.value ?? "")
      : "";

  const contributionName =
    contribNameResult.status === "fulfilled"
      ? (contribNameResult.value.data?.value ?? "")
      : "";

  const contributionNote =
    contribNoteResult.status === "fulfilled"
      ? (contribNoteResult.value.data?.value ?? "")
      : "";

  const primaryPhoto = photos.find((p) => p.is_primary);
  const primaryImageUrl = primaryPhoto?.url ?? null;

  const galleryPhotos: GalleryImage[] = photos
    .filter((p) => !p.is_primary)
    .map((p) => ({ src: p.url, alt: "Marshell Okatch" }));

  const galleryImages =
    galleryPhotos.length > 0 ? galleryPhotos : staticGalleryImages;

  const displayName = (heroName && heroName.trim()) ? heroName.trim() : siteConfig.name;

  return {
    count, primaryImageUrl, galleryImages, bio, heroName, bornYear, diedYear, burialDate,
    contributionEnabled, contributionMethod, contributionPhone, contributionName, contributionNote,
    displayName,
  };
});

export async function generateMetadata(): Promise<Metadata> {
  const { displayName, bornYear, diedYear } = await getPageData();

  const title = `In Loving Memory of ${displayName}`;
  const years = bornYear && diedYear ? ` · ${bornYear}–${diedYear}` : "";
  const description = `${displayName}${years} — A memorial tribute page. Share your condolences and read tributes from those who knew him.`;

  // Build absolute OG image URL — served from our own domain, always accessible to crawlers
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  const yearParam = bornYear && diedYear ? `${bornYear}–${diedYear}` : diedYear ?? "";
  const ogImageUrl = siteUrl
    ? `${siteUrl}/og?name=${encodeURIComponent(displayName)}${yearParam ? `&year=${encodeURIComponent(yearParam)}` : ""}`
    : null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: `${displayName} — In Loving Memory` }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  };
}

export default async function HomePage() {
  const {
    count, primaryImageUrl, galleryImages, bio, heroName, bornYear, diedYear, burialDate,
    contributionEnabled, contributionMethod, contributionPhone, contributionName, contributionNote,
    displayName,
  } = await getPageData();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection
          primaryImageUrl={primaryImageUrl}
          name={heroName}
          bornYear={bornYear}
          diedYear={diedYear}
          burialDate={burialDate}
        />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-24 sm:pb-10">
          <PageTabs
            initialCount={count}
            bio={bio}
            galleryImages={galleryImages}
            contributionEnabled={contributionEnabled}
            contributionMethod={contributionMethod}
            contributionPhone={contributionPhone}
            contributionName={contributionName}
            contributionNote={contributionNote}
            displayName={displayName}
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
