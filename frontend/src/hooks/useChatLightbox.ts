import { useMemo, useState } from "react";
import type { Message } from "@/types/chat";

interface FlatImage {
  src: string;
  messageId: string;
}

export const useChatLightbox = (messages: Message[]) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const flatImages: FlatImage[] = useMemo(() => {
    const result: FlatImage[] = [];
    for (const msg of messages) {
      if (msg.images && msg.images.length > 0) {
        for (const url of msg.images) {
          result.push({ src: url, messageId: msg._id });
        }
      }
    }
    return result;
  }, [messages]);

  const slides = useMemo(
    () => flatImages.map((img) => ({ src: img.src })),
    [flatImages],
  );

  const openAt = (messageId: string, localIndex: number) => {
    let remaining = localIndex;
    let globalIndex = 0;
    let found = false;

    for (let i = 0; i < flatImages.length; i++) {
      if (flatImages[i].messageId === messageId) {
        if (remaining === 0) {
          globalIndex = i;
          found = true;
          break;
        }
        remaining--;
      }
    }

    if (!found) {
      globalIndex = flatImages.findIndex((img) => img.messageId === messageId);
    }

    setOpenIndex(globalIndex >= 0 ? globalIndex : 0);
  };

  const close = () => setOpenIndex(null);

  return { slides, openIndex, openAt, close };
};
