import { useAuthStore } from "@/stores/auth.store";
import React from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

const SignOutForm = () => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Button variant="completeGhost" size="sm" onClick={handleSignOut}>
      <LogOut className="text-destructive" />
      {t("navUser.signOut")}
    </Button>
  );
};

export default SignOutForm;
