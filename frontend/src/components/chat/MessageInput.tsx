import { useAuthStore } from "@/stores/auth.store";
import type { Conversation } from "@/types/chat";
import { useState } from "react";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { Input } from "../ui/input";
import EmojiPicker from "./EmojiPicker";
import ImagePickerButton from "./ImagePickerButton";

import { useChatStore } from "@/stores/chat.store";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useImageUpload } from "@/hooks/useImageUpload";
import ImagePreviewList from "./ImagePreviewList";

const MessageInput = ({ selectedConvo }: { selectedConvo: Conversation }) => {
  const { user } = useAuthStore();
  const { sendDirectMessage, sendGroupMessage } = useChatStore();
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const { t } = useTranslation();

  const {
    previews,
    fileInputRef,
    openFilePicker,
    handleFilesSelected,
    removePreview,
    clearPreviews,
    files,
  } = useImageUpload({ maxImages: 10, maxSizeMB: 5 });

  if (!user) return null;

  const sendMessage = async () => {
    const trimmed = value.trim();
    if (!trimmed && files.length === 0) return;

    const currValue = trimmed;
    const currImages = files;

    setValue("");
    clearPreviews();
    setSending(true);

    try {
      if (selectedConvo.type === "direct") {
        const participants = selectedConvo.participants;
        const otherUser = participants.filter((p) => p._id !== user._id)[0];

        await sendDirectMessage(otherUser._id, currValue, currImages);
      } else {
        await sendGroupMessage(selectedConvo._id, currValue, currImages);
      }
    } catch (error) {
      console.error(error);
      toast.error(t("chat.messageInput.errorSending"));
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const canSend = (value.trim() !== "" || previews.length > 0) && !sending;

  return (
    <div className="flex flex-col gap-2 p-3 bg-background">
      <ImagePreviewList previews={previews} onRemove={removePreview} />

      <div className="flex items-center gap-2 min-h-[40px]">
        <ImagePickerButton
          fileInputRef={fileInputRef}
          onFilesSelected={handleFilesSelected}
          onClick={openFilePicker}
          disabled={sending}
        />

        <div className="flex-1 relative">
          <Input
            onKeyDown={handleKeyPress}
            value={value}
            placeholder={t("chat.messageInput.placeholder")}
            onChange={(e) => setValue(e.target.value)}
            className="pr-10 h-9 bg-white border-border/50 focus:border-primary/50 transition-smooth"
          />

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 size-8 hover:bg-primary/10 rounded-full"
          >
            <EmojiPicker
              onchange={(emoji: string) => setValue(`${value}${emoji}`)}
            />
          </Button>
        </div>

        <Button
          onClick={sendMessage}
          className="bg-[#00c0d1] hover:bg-[#00a7b6] transition-all duration-200 size-9 hover:scale-105"
          disabled={!canSend}
        >
          <Send className="size-4 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
