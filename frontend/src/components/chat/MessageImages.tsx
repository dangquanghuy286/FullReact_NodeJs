import { useState } from "react";
import { cn } from "@/lib/utils";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface MessageImagesProps {
  images: string[];
  hasContent: boolean;
}

const gridColsClass = (count: number) => {
  if (count === 1) return "grid-cols-1";
  return "grid-cols-2"; // 2+ ảnh: lưới 2 cột, ảnh dư tự xuống hàng
};

const MessageImages = ({ images, hasContent }: MessageImagesProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const slides = images.map((url) => ({ src: url }));

  return (
    <>
      <div
        className={cn(
          "grid gap-1",
          gridColsClass(images.length),
          hasContent ? "mb-2" : "",
        )}
      >
        {images.map((url, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="block rounded-lg overflow-hidden"
          >
            <img
              src={url}
              alt={`image-${i}`}
              className="w-full h-32 object-cover hover:opacity-90 transition-opacity"
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={openIndex !== null}
        close={() => setOpenIndex(null)}
        index={openIndex ?? 0}
        slides={slides}
      />
    </>
  );
};

export default MessageImages;
