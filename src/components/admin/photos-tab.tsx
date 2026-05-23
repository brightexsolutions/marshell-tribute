"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Star, Trash2, Upload, ImageOff } from "lucide-react";
import { toast } from "sonner";
import { BioEditor } from "./bio-editor";
import { MAX_PHOTOS } from "@/config/constants";

interface Photo {
  id: string;
  url: string;
  storage_path: string;
  is_primary: boolean;
  created_at: string;
}

export function PhotosTab() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const remaining = MAX_PHOTOS - photos.length;

  const fetchPhotos = useCallback(async () => {
    const res = await fetch("/api/admin/photos");
    if (res.ok) setPhotos(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const allowed = Math.min(files.length, remaining);
    if (allowed < files.length) {
      toast.warning(`Only ${allowed} photo(s) can be added. Limit is ${MAX_PHOTOS}.`);
    }
    if (allowed === 0) return;

    setUploading(true);
    let successCount = 0;

    for (const file of files.slice(0, allowed)) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/photos", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const photo = await res.json();
        setPhotos((prev) => [photo, ...prev]);
        successCount++;
      } else {
        const { error } = await res.json();
        toast.error(`Upload failed: ${error}`);
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} photo${successCount > 1 ? "s" : ""} uploaded.`);
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSetPrimary = async (id: string) => {
    setActionId(id);
    const res = await fetch(`/api/admin/photos/set-primary?id=${id}`, {
      method: "PATCH",
    });

    if (res.ok) {
      setPhotos((prev) =>
        prev.map((p) => ({ ...p, is_primary: p.id === id }))
      );
      toast.success("Primary photo updated. The banner will show this image.");
    } else {
      toast.error("Failed to set primary photo.");
    }
    setActionId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this photo? This cannot be undone.")) return;
    setActionId(id);
    const res = await fetch(`/api/admin/photos?id=${id}`, { method: "DELETE" });

    if (res.ok) {
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      toast.success("Photo deleted.");
    } else {
      toast.error("Failed to delete photo.");
    }
    setActionId(null);
  };

  return (
    <div className="space-y-8 py-2">
      {/* Upload area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-serif font-semibold text-foreground">
            Gallery Photos
          </h3>
          <span className="text-xs text-muted-foreground font-sans">
            {photos.length} / {MAX_PHOTOS} photos
            {remaining > 0
              ? ` — ${remaining} slot${remaining !== 1 ? "s" : ""} remaining`
              : " — Limit reached"}
          </span>
        </div>

        {remaining > 0 ? (
          <label className="block cursor-pointer">
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border hover:border-primary/40 bg-muted/30 hover:bg-muted/60 transition-colors p-8">
              {uploading ? (
                <>
                  <Loader2 className="w-7 h-7 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground font-sans">
                    Uploading…
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-7 h-7 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium font-sans">
                      Click to upload photos
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG or WEBP · You can add up to {remaining} more
                    </p>
                  </div>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground font-sans">
            <ImageOff className="w-4 h-4 flex-none" />
            Maximum of {MAX_PHOTOS} photos reached. Delete a photo to free up a slot.
          </div>
        )}

        {/* Photo grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6 font-sans">
            No photos uploaded yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted"
              >
                {/* plain img — no next/image hostname restriction in admin */}
                <img
                  src={photo.url}
                  alt="Gallery photo"
                  className="w-full h-full object-cover"
                />

                {/* Primary badge */}
                {photo.is_primary && (
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-yellow-400 text-yellow-900 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                    <Star className="w-2.5 h-2.5" />
                    Banner
                  </div>
                )}

                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                  {!photo.is_primary && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full text-xs gap-1 h-7"
                      disabled={actionId === photo.id}
                      onClick={() => handleSetPrimary(photo.id)}
                    >
                      {actionId === photo.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Star className="w-3 h-3" />
                      )}
                      Set as Banner
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full text-xs gap-1 h-7"
                    disabled={actionId === photo.id}
                    onClick={() => handleDelete(photo.id)}
                  >
                    {actionId === photo.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Bio editor */}
      <BioEditor />
    </div>
  );
}
