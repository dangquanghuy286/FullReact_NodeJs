import { ImagePlus } from "lucide-react";
import { Button } from "../ui/button";
import type { RefObject } from "react";

interface ImagePickerButtonProps {
  fileInputRef: RefObject<HTMLInputElement>;
  onFilesSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  disabled?: boolean;
}

const ImagePickerButton = ({
  fileInputRef,
  onFilesSelected,
  onClick,
  disabled,
}: ImagePickerButtonProps) => {
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={onFilesSelected}
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={onClick}
        disabled={disabled}
        className="hover:bg-primary/10 transition-smooth"
      >
        <ImagePlus className="size-4" />
      </Button>
    </>
  );
};

export default ImagePickerButton;
