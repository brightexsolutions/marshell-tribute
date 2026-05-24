import Image from "next/image";
import { siteConfig } from "@/config/site";

interface HeroSectionProps {
  primaryImageUrl?: string | null;
  name?: string | null;
  bornYear?: string | null;
  diedYear?: string | null;
  burialDate?: string | null;
}

export function HeroSection({ primaryImageUrl, name, bornYear, diedYear, burialDate }: HeroSectionProps) {
  const src = primaryImageUrl || siteConfig.heroImage;
  const hasImage = !!primaryImageUrl;
  const displayName = name || siteConfig.name;
  const displayBurial = burialDate ?? siteConfig.burial;
  const displayBorn = bornYear || (siteConfig.born !== "19XX" ? siteConfig.born : null);
  const displayDied = diedYear || siteConfig.died;

  return (
    <div className="relative w-full h-[60vh] min-h-[380px] max-h-[560px] bg-neutral-800">
      {hasImage && (
        <Image
          src={src}
          alt={`${siteConfig.name} — In Loving Memory`}
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
      )}
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/75" />

      {/* Name & years */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
        <p className="text-sm font-sans font-light tracking-widest uppercase text-white/80 mb-1">
          In Loving Memory
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold leading-tight">
          {displayName}
        </h1>
        {displayBorn && (
          <p className="mt-1 text-base sm:text-lg font-sans font-light text-white/75">
            {displayBorn} – {displayDied}
          </p>
        )}
        {displayBurial && (
          <p className="mt-1 text-sm font-sans font-light text-white/60 tracking-wide">
            Burial: {displayBurial}
          </p>
        )}
      </div>
    </div>
  );
}
