export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

// Add an entry here each time you drop a photo into public/images/gallery/
export const galleryImages: GalleryImage[] = [
  // { src: "/images/gallery/photo1.jpg", alt: "Marshell at the family gathering" },
  // { src: "/images/gallery/photo2.jpg", alt: "Marshell in 2019" },
];
