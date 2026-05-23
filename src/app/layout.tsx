import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "In Loving Memory of Marshell Okatch",
  description:
    "A memorial tribute page for Marshell Okatch. Share your condolences and read tributes from those who knew him.",
  openGraph: {
    title: "In Loving Memory of Marshell Okatch",
    description: "Share your condolences and read tributes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background text-foreground">
        {children}
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  );
}
