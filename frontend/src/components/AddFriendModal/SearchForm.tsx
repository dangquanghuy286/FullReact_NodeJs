import React from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { IFormValues } from "../chat/AddFriendModal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SearchFormProps {
  register: UseFormRegister<IFormValues>;
  errors: FieldErrors<IFormValues>;
  loading: boolean;
  usernameValue: string;
  isFound: boolean | null;
  searchedUsername: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const SearchForm = ({
  register,
  errors,
  loading,
  usernameValue,
  isFound,
  searchedUsername,
  onSubmit,
  onCancel,
}: SearchFormProps) => {
  const { t } = useTranslation();

  return (
    <>
      <form action="" onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-semibold">
            {t("addFriend.searchForm.label")}
          </Label>
          <Input
            id="username"
            placeholder={t("addFriend.searchForm.placeholder")}
            {...register("username", {
              required: t("addFriend.searchForm.validation.usernameRequired"),
            })}
            className="glass transform-smooth"
          />
          {errors.username && (
            <p className="error-message">{errors.username.message}</p>
          )}

          {isFound === false && (
            <span className="error-message">
              {t("addFriend.searchForm.userNotFound")}
              <span className="font-semibold"> @{searchedUsername}</span>
            </span>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="flex-1 glass hover:to-destructive"
              onClick={onCancel}
            >
              {t("addFriend.searchForm.cancel")}
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={loading || !usernameValue?.trim()}
            className="flex-1 bg-linear-to-b from-[#00c0d1] to-[#007c91] text-white hover:opacity-90 transition-smooth"
          >
            {loading ? (
              <span>{t("addFriend.searchForm.searching")}</span>
            ) : (
              <>
                <Search className="size-4 mr-2" />
                {t("addFriend.searchForm.search")}
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

export default SearchForm;