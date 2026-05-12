"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

const logoDomainMap: Record<string, string> = {
  "1password": "1password.com",
  adobe: "adobe.com",
  adobecreativecloud: "adobe.com",
  airtable: "airtable.com",
  anam: "anam.ai",
  anthropic: "anthropic.com",
  anythingllm: "anythingllm.com",
  apify: "apify.com",
  appsflyer: "appsflyer.com",
  asana: "asana.com",
  autodesk: "autodesk.com",
  builderio: "builder.io",
  canva: "canva.com",
  clickup: "clickup.com",
  coderabbit: "coderabbit.ai",
  coreldraw: "coreldraw.com",
  coursera: "coursera.org",
  cursor: "cursor.com",
  devin: "cognition.ai",
  dropbox: "dropbox.com",
  elevenlabs: "elevenlabs.io",
  figma: "figma.com",
  filmora: "wondershare.com",
  fireflies: "fireflies.ai",
  framer: "framer.com",
  gamma: "gamma.app",
  github: "github.com",
  google: "google.com",
  grammarly: "grammarly.com",
  grok: "x.ai",
  jetbrains: "jetbrains.com",
  jira: "atlassian.com",
  linkedin: "linkedin.com",
  linktree: "linktr.ee",
  loom: "loom.com",
  lovable: "lovable.dev",
  lumion: "lumion.com",
  make: "make.com",
  microsoft365: "microsoft.com",
  microsoftoffice: "microsoft.com",
  midjourney: "midjourney.com",
  miro: "miro.com",
  mobbin: "mobbin.com",
  monday: "monday.com",
  nordvpn: "nordvpn.com",
  notion: "notion.so",
  openai: "openai.com",
  perplexity: "perplexity.ai",
  pipedrive: "pipedrive.com",
  pngtree: "pngtree.com",
  quillbot: "quillbot.com",
  replit: "replit.com",
  rezi: "rezi.ai",
  supabase: "supabase.com",
  textshifter: "textshifter.com",
  tidio: "tidio.com",
  uizard: "uizard.io",
  vapi: "vapi.ai",
  webflow: "webflow.com",
  windows: "microsoft.com",
  zapier: "zapier.com",
};

export function ProductLogo({ name, logoKey, className }: { name: string; logoKey: string; className?: string; }) {
  const [loadFailed, setLoadFailed] = useState(false);
  const domain = logoDomainMap[logoKey.toLowerCase()];
  const logoUrl = useMemo(() => (domain ? `https://logo.clearbit.com/${domain}?size=64` : null), [domain]);

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/80", className)}>
      {logoUrl && !loadFailed ? (
        <Image
          src={logoUrl}
          alt={`${name} logo`}
          className="h-7 w-7 rounded-md object-contain"
          width={28}
          height={28}
          referrerPolicy="no-referrer"
          onError={() => setLoadFailed(true)}
        />
      ) : (
        <span className="text-sm font-semibold text-slate-200">{initials}</span>
      )}
    </div>
  );
}
