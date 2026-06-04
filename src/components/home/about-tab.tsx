import { siteConfig } from "@/config/site";
import { GalleryCarousel } from "./gallery-carousel";
import { CandleLighting } from "./candle-lighting";
import type { GalleryImage } from "@/config/images";

interface AboutTabProps {
  bio: string;
  galleryImages: GalleryImage[];
  burialDate: string | null;
  displayName: string;
}

export function AboutTab({ bio, galleryImages, burialDate, displayName }: AboutTabProps) {
  const displayBio = bio || siteConfig.bio;

  return (
    <div className="space-y-8 py-4">
      {/* Biography */}
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-semibold text-foreground mb-3">
          About Marshell
        </h2>
        <div>
          {displayBio.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="text-foreground/80 leading-relaxed text-base mb-4 font-sans"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Gallery */}
      <div>
        <h3 className="text-lg font-serif font-semibold text-foreground mb-3">
          Gallery
        </h3>
        <GalleryCarousel images={galleryImages} />
      </div>

      {/* Virtual Candle Lighting */}
      <div id="candle-section">
        <h3 className="text-lg font-serif font-semibold text-foreground mb-3">
          Light a Candle
        </h3>
        <CandleLighting burialDate={burialDate} displayName={displayName} />
      </div>
    </div>
  );
}
