import Image from "next/image";
import { siteConfig } from "@/config/site";

interface HeroSectionProps {
  primaryImageUrl?: string | null;
}

export function HeroSection({ primaryImageUrl }: HeroSectionProps) {
  const src = primaryImageUrl || siteConfig.heroImage;
  const hasImage = !!primaryImageUrl;

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
          {siteConfig.name}
        </h1>
        {siteConfig.born !== "19XX" && (
          <p className="mt-1 text-base sm:text-lg font-sans font-light text-white/75">
            {siteConfig.born} – {siteConfig.died}
          </p>
        )}
        {siteConfig.burial && (
          <p className="mt-1 text-sm font-sans font-light text-white/60 tracking-wide">
            Burial: {siteConfig.burial}
          </p>
        )}
      </div>
    </div>
  );
}
