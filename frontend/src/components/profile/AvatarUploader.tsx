import { useRef, useState } from "react";
import { useUserStore } from "@/stores/user.store";
import { Camera } from "lucide-react";
import { Button } from "../ui/button";

const AvatarUploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateAvatarUrl } = useUserStore();
  const [loading, setLoading] = useState(false);

  const handleClick = () => fileInputRef.current?.click();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      await updateAvatarUrl(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={loading}
        className="absolute -bottom-1 -right-1 size-8 rounded-full 
          bg-white shadow-lg border-2 border-white
          flex items-center justify-center
          hover:bg-[#00c0d1] hover:border-[#00c0d1]
          hover:scale-110 active:scale-95
          transition-all duration-200 ease-out
          group disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="size-3.5 rounded-full border-2 border-[#00c0d1] border-t-transparent animate-spin group-hover:border-white group-hover:border-t-transparent" />
        ) : (
          <Camera className="size-3.5 text-gray-500 group-hover:text-white transition-colors duration-200" />
        )}
      </Button>
      <input
        type="file"
        accept="image/*"
        hidden
        ref={fileInputRef}
        onChange={handleUpload}
      />
    </>
  );
};

export default AvatarUploader;
