import { cn } from "@/lib/utils";

interface MessageImagesProps {
  images: string[];
  hasContent: boolean;
  onImageClick: (localIndex: number) => void;
}

const gridColsClass = (count: number) => {
  if (count === 1) return "grid-cols-1";
  return "grid-cols-2"; // 2+ ảnh: lưới 2 cột, ảnh dư tự xuống hàng
};

const MessageImages = ({
  images,
  hasContent,
  onImageClick,
}: MessageImagesProps) => {
  if (!images || images.length === 0) return null;

  return (
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
          onClick={() => onImageClick(i)}
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
  );
};

export default MessageImages;
