import { siteConfig } from "@/config/site";
import { galleryImages } from "@/config/images";
import { GalleryCarousel } from "./gallery-carousel";

export function AboutTab() {
  return (
    <div className="space-y-8 py-4">
      {/* Biography */}
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-semibold text-foreground mb-3">
          About Marshell
        </h2>
        <div className="prose prose-sm max-w-none">
          {siteConfig.bio.split("\n\n").map((paragraph, i) => (
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
      {galleryImages.length > 0 && (
        <div>
          <h3 className="text-lg font-serif font-semibold text-foreground mb-3">
            Gallery
          </h3>
          <GalleryCarousel images={galleryImages} />
        </div>
      )}

      {galleryImages.length === 0 && (
        <div>
          <h3 className="text-lg font-serif font-semibold text-foreground mb-3">
            Gallery
          </h3>
          <GalleryCarousel images={[]} />
        </div>
      )}
    </div>
  );
}
