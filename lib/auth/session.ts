import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth/options";
import { isOwnerEmail } from "@/lib/auth/owner";
import { isAuthSecretConfigured } from "@/lib/env";

export async function getAuthSession() {
  if (!isAuthSecretConfigured()) {
    return null;
  }
  return getServerSession(authOptions);
}

export async function requireUser(callbackUrl = "/dashboard") {
  if (!isAuthSecretConfigured()) {
    redirect("/");
  }

  const session = await getAuthSession();
  if (!session?.user) {
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  return session;
}

export async function requireOwner(callbackUrl = "/admin") {
  const session = await requireUser(callbackUrl);
  const isOwner = session.user.role === "OWNER" || isOwnerEmail(session.user.email);

  if (!isOwner) {
    redirect("/dashboard");
  }

  return session;
}
