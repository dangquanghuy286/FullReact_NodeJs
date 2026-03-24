import { useThemeStore } from "@/stores/theme.strore";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface EmojiPickerProps {
  onchange: (value: string) => void;
}

const EmojiPicker = ({ onchange }: EmojiPickerProps) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center justify-center cursor-pointer">
            <Smile className="size-4" />
          </div>
        </PopoverTrigger>

        <PopoverContent
          side="right"
          sideOffset={40}
          className="bg-transparent border-none shadow-none mb-12"
        >
          <Picker
            theme={isDarkMode ? "dark" : "light"}
            data={data}
            onEmojiSelect={(emoji: any) => onchange(emoji.native)}
            emojiSize={24}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default EmojiPicker;
