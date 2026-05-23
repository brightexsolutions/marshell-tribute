"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { useCallback } from "react";
import type { GalleryImage } from "@/config/images";

interface GalleryCarouselProps {
  images: GalleryImage[];
}

export function GalleryCarousel({ images }: GalleryCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 rounded-lg border border-dashed border-border text-muted-foreground gap-2">
        <ImageOff className="w-6 h-6" />
        <p className="text-sm">Gallery photos coming soon</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {images.map((img, i) => (
            <div
              key={i}
              className="relative flex-none w-full aspect-[4/3] sm:aspect-[16/9]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm px-4 py-2 font-sans">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
}
