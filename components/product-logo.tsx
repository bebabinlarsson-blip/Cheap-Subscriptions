import {
  siAirtable,
  siAnthropic,
  siAsana,
  siAutodesk,
  siClickup,
  siCoreldraw,
  siCoursera,
  siDropbox,
  siElevenlabs,
  siFigma,
  siFramer,
  siGithub,
  siGoogle,
  siGrammarly,
  siJetbrains,
  siJira,
  siLoom,
  siMake,
  siMiro,
  siNordvpn,
  siNotion,
  siPerplexity,
  siReplit,
  siSupabase,
  siWebflow,
  siZapier,
  si1password,
} from "simple-icons";

import { cn } from "@/lib/utils";

const iconMap = {
  "1password": si1password,
  airtable: siAirtable,
  anthropic: siAnthropic,
  asana: siAsana,
  autodesk: siAutodesk,
  clickup: siClickup,
  coreldraw: siCoreldraw,
  coursera: siCoursera,
  dropbox: siDropbox,
  elevenlabs: siElevenlabs,
  figma: siFigma,
  framer: siFramer,
  github: siGithub,
  google: siGoogle,
  grammarly: siGrammarly,
  jetbrains: siJetbrains,
  jira: siJira,
  loom: siLoom,
  make: siMake,
  miro: siMiro,
  nordvpn: siNordvpn,
  notion: siNotion,
  perplexity: siPerplexity,
  replit: siReplit,
  supabase: siSupabase,
  webflow: siWebflow,
  zapier: siZapier,
} as const;

export function ProductLogo({ name, logoKey, className }: { name: string; logoKey: string; className?: string; }) {
  const icon = iconMap[logoKey as keyof typeof iconMap];

  if (!icon) {
    return (
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-orange-500/20 via-purple-500/20 to-cyan-500/20 text-sm font-semibold text-white", className)}>
        {name
          .split(" ")
          .slice(0, 2)
          .map((part) => part[0])
          .join("")}
      </div>
    );
  }

  return (
    <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80", className)}>
      <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6" fill={`#${icon.hex}`}>
        <path d={icon.path} />
      </svg>
    </div>
  );
}
