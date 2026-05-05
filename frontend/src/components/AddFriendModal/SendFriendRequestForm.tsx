import React from "react";
import type { UseFormRegister } from "react-hook-form";
import type { IFormValues } from "../chat/AddFriendModal";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SendFriendRequestFormProps {
  register: UseFormRegister<IFormValues>;
  loading: boolean;
  searchedUsername: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
}

const SendFriendRequestForm = ({
  register,
  loading,
  searchedUsername,
  onSubmit,
  onBack,
}: SendFriendRequestFormProps) => {
  const { t } = useTranslation();

  return (
    <>
      <form action="" onSubmit={onSubmit}>
        <div className="space-y-4">
          <span className="success-message">
            {t("addFriend.sendRequestForm.foundUser")}
            <span className="font-semibold"> @{searchedUsername}</span>
            🎆
          </span>

          <div className="space-y-4">
            <Label htmlFor="message" className="text-sm font-semibold">
              {t("addFriend.sendRequestForm.introLabel")}
            </Label>
            <Textarea
              id="message"
              placeholder={t("addFriend.sendRequestForm.introPlaceholder")}
              {...register("message")}
              rows={3}
              className="glass border-gray-300 focus:border-[#00c0d1]/50 transition-smooth resize-none"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={onBack}
              disabled={loading}
              className="flex-1 glass hover:text-destructive"
            >
              {t("addFriend.sendRequestForm.back")}
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-linear-to-b from-[#00c0d1] to-[#007c91] text-white hover:opacity-90 transition-smooth"
            >
              {loading ? (
                <span>{t("addFriend.sendRequestForm.sending")}</span>
              ) : (
                <>
                  <UserPlus className="size-4 mr-2" />
                  {t("addFriend.sendRequestForm.addFriend")}
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </form>
    </>
  );
};

export default SendFriendRequestForm;
