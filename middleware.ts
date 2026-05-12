import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { isOwnerEmail } from "@/lib/auth/owner";
import { isAuthSecretConfigured } from "@/lib/env";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedPage = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isProtectedApi = pathname.startsWith("/api/admin") || pathname.startsWith("/api/paypal");
  const hasAuthSecret = isAuthSecretConfigured();

  if (!hasAuthSecret && (isProtectedPage || isProtectedApi)) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Authentication not configured" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token && (isProtectedPage || isProtectedApi)) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL("/api/auth/signin", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const email = token?.email ?? "";
    const isOwner = token?.role === "OWNER" || isOwnerEmail(email);

    if (!isOwner) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/api/admin/:path*", "/api/paypal/:path*"],
};
