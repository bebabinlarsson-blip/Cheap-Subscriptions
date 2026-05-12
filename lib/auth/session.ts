import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth/options";
import { isOwnerEmail } from "@/lib/auth/owner";

export async function getAuthSession() {
  return getServerSession(authOptions);
}

export async function requireUser(callbackUrl = "/dashboard") {
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
