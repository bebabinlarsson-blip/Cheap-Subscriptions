"use client";

import { LogIn, LogOut } from "lucide-react";
import { signIn, signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function AuthControls({
  isAuthenticated,
  googleEnabled,
}: {
  isAuthenticated: boolean;
  googleEnabled: boolean;
}) {
  if (isAuthenticated) {
    return (
      <Button variant="secondary" onClick={() => signOut({ callbackUrl: "/" })}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      disabled={!googleEnabled}
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
    >
      <LogIn className="mr-2 h-4 w-4" />
      {googleEnabled ? "Google Login" : "Login Setup Needed"}
    </Button>
  );
}
