import { siteConfig } from "@/config/site";
import { GalleryCarousel } from "./gallery-carousel";
import type { GalleryImage } from "@/config/images";

interface AboutTabProps {
  bio: string;
  galleryImages: GalleryImage[];
}

export function AboutTab({ bio, galleryImages }: AboutTabProps) {
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
    </div>
  );
}
