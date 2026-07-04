import { X } from "lucide-react";
import type { ImagePreview } from "@/hooks/useImageUpload";

interface ImagePreviewListProps {
  previews: ImagePreview[];
  onRemove: (url: string) => void;
}

const ImagePreviewList = ({ previews, onRemove }: ImagePreviewListProps) => {
  if (previews.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {previews.map((p) => (
        <div
          key={p.url}
          className="relative w-16 h-16 rounded-lg overflow-hidden border border-border/50 group"
        >
          <img
            src={p.url}
            alt="preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => onRemove(p.url)}
            className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-black/80 rounded-full p-0.5 transition-colors"
          >
            <X className="size-3 text-white" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImagePreviewList;
