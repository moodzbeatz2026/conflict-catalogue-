import Image from "next/image";
import type { IncidentImage } from "@/lib/types";

export function ImageGallery({ images }: { images: IncidentImage[] }) {
  if (images.length === 0) return null;

  const sorted = [...images].sort((a, b) => a.display_order - b.display_order);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

  return (
    <div className="mb-8 space-y-4">
      {sorted.map((image) => (
        <figure key={image.id}>
          <div className="relative w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={`${supabaseUrl}/storage/v1/object/public/incident-images/${image.file_path}`}
              alt={image.caption || "Incident image"}
              width={960}
              height={540}
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
              priority={image.display_order === 0}
            />
          </div>
          {(image.caption || image.attribution) && (
            <figcaption className="mt-2 text-sm text-gray-500">
              {image.caption}
              {image.caption && image.attribution && " — "}
              {image.attribution && (
                <span className="italic">{image.attribution}</span>
              )}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
