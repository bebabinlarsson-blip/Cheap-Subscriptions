import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { getAuthSession } from "@/lib/auth/session";
import { isOwnerEmail } from "@/lib/auth/owner";
import { isDatabaseConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";

function isOwner(session: Awaited<ReturnType<typeof getAuthSession>>) {
  return Boolean(session?.user && (session.user.role === "OWNER" || isOwnerEmail(session.user.email)));
}

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ users: [] });
  }

  const users = await prisma.user.findMany();
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!isOwner(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured." }, { status: 500 });
  }

  const formData = await request.formData();
  const userId = formData.get("userId")?.toString();
  const role = formData.get("role")?.toString();
  if (userId && role) {
    await prisma.user.update({ where: { id: userId }, data: { role: role as Role } });
  }

  return NextResponse.redirect(new URL("/admin/users", request.url), { status: 303 });
}
