import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export interface ImagePreview {
  file: File;
  url: string;
}

interface UseImageUploadOptions {
  maxImages?: number;
  maxSizeMB?: number;
}

export const useImageUpload = ({
  maxImages = 10,
  maxSizeMB = 5,
}: UseImageUploadOptions = {}) => {
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // cho phép chọn lại cùng file lần sau

    if (files.length === 0) return;

    const validFiles: File[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error(t("chat.messageInput.invalidImageType"));
        continue;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(t("chat.messageInput.imageTooLarge", { name: file.name }));
        continue;
      }
      validFiles.push(file);
    }

    setPreviews((prev) => {
      const combined = [
        ...prev,
        ...validFiles.map((file) => ({
          file,
          url: URL.createObjectURL(file),
        })),
      ];

      if (combined.length > maxImages) {
        toast.error(t("chat.messageInput.tooManyImages", { max: maxImages }));
        return combined.slice(0, maxImages);
      }
      return combined;
    });
  };

  const removePreview = (url: string) => {
    setPreviews((prev) => {
      const target = prev.find((p) => p.url === url);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.url !== url);
    });
  };

  const clearPreviews = () => {
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews([]);
  };

  return {
    previews,
    fileInputRef,
    openFilePicker,
    handleFilesSelected,
    removePreview,
    clearPreviews,
    files: previews.map((p) => p.file),
  };
};
