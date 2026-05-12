import Image from "next/image";
import Link from "next/link";
import { Inbox, ShieldCheck, UserCircle2 } from "lucide-react";

import { CartCount } from "@/components/site/cart-count";
import { AuthControls } from "@/components/site/auth-controls";
import { Badge } from "@/components/ui/badge";
import { getUnreadInboxCount } from "@/lib/catalog";
import { getAuthSession } from "@/lib/auth/session";
import { isGoogleAuthConfigured } from "@/lib/env";

export async function SiteHeader() {
  const session = await getAuthSession();
  const unreadCount = await getUnreadInboxCount(session?.user?.id);
  const isOwner = session?.user?.role === "OWNER";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-amber-400 to-cyan-400 text-sm font-black text-slate-950 shadow-[0_0_40px_rgba(56,189,248,0.25)]">
              PT
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Premium Tools</p>
              <h1 className="text-sm font-semibold text-white sm:text-base">Mega List</h1>
            </div>
          </Link>
          <Badge className="hidden border-cyan-400/30 bg-cyan-400/10 text-cyan-200 sm:inline-flex">Instant Access</Badge>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link href="/products" className="hover:text-white">Products</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
          <Link href="/terms" className="hover:text-white">Legal</Link>
          {session?.user && <Link href="/dashboard" className="hover:text-white">Dashboard</Link>}
          {isOwner && <Link href="/admin" className="hover:text-white">Admin</Link>}
        </nav>

        <div className="flex items-center gap-3">
          {session?.user && (
            <Link
              href="/dashboard/inbox"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition hover:border-orange-400/60 hover:bg-white/10"
              aria-label="Inbox"
            >
              <Inbox className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-slate-950">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}
          <CartCount />
          {session?.user && (
            <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 sm:flex">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? "User avatar"}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <UserCircle2 className="h-8 w-8 text-cyan-300" />
              )}
              <div className="max-w-32">
                <p className="truncate text-sm font-medium text-white">{session.user.name ?? session.user.email}</p>
                <p className="flex items-center gap-1 text-xs text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />
                  {session.user.role}
                </p>
              </div>
            </div>
          )}
          <AuthControls isAuthenticated={Boolean(session?.user)} googleEnabled={isGoogleAuthConfigured()} />
        </div>
      </div>
    </header>
  );
}
