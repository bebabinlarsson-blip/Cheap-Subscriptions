import { slugify } from "@/lib/utils";

export type SeedProduct = {
  name: string;
  slug: string;
  category: string;
  description: string;
  duration: string | null;
  priceCents: number | null;
  currency: "EUR";
  logoKey: string;
  comingSoon: boolean;
  featured: boolean;
};

const rawCatalog = [
  ["LinkedIn Tools & Resources", "LinkedIn Career", "12 Months", 1200, "linkedin", true],
  ["LinkedIn Tools & Resources", "LinkedIn Business", "12 Months", 2500, "linkedin", true],
  ["LinkedIn Tools & Resources", "LinkedIn Sales Navigator", "12 Months", 4500, "linkedin", true],
  ["AI & Productivity Tools", "Cursor AI Pro", null, 8900, "cursor", true],
  ["AI & Productivity Tools", "Lovable Pro", null, 5900, "lovable", false],
  ["AI & Productivity Tools", "Supabase Pro", null, 5900, "supabase", false],
  ["AI & Productivity Tools", "ElevenLabs Creator", null, 5900, "elevenlabs", false],
  ["AI & Productivity Tools", "Replit Core", null, 4900, "replit", false],
  ["AI & Productivity Tools", "Gamma Pro", null, 4900, "gamma", false],
  ["AI & Productivity Tools", "Google AI Pro", null, 1900, "google", true],
  ["AI & Productivity Tools", "Notion Business", null, 4900, "notion", false],
  ["AI & Productivity Tools", "Miro Pro", null, 4900, "miro", false],
  ["AI & Productivity Tools", "Framer Pro", null, 3900, "framer", false],
  ["AI & Productivity Tools", "Canva Teams", null, 3500, "canva", false],
  ["AI & Productivity Tools", "ChatGPT Plus", null, 2200, "openai", true],
  ["AI & Productivity Tools", "Claude Pro", null, 2200, "anthropic", true],
  ["AI & Productivity Tools", "Perplexity Pro", null, 2500, "perplexity", false],
  ["AI & Productivity Tools", "Midjourney Standard", null, 2500, "midjourney", false],
  ["AI & Productivity Tools", "Figma Professional", null, 3200, "figma", false],
  ["AI & Productivity Tools", "Uizard Pro", null, 2500, "uizard", false],
  ["AI & Productivity Tools", "Builder.io Pro", null, 2000, "builderio", false],
  ["AI & Productivity Tools", "Make.com Team", null, 8900, "make", false],
  ["AI & Productivity Tools", "Zapier Professional", null, 4500, "zapier", false],
  ["AI & Productivity Tools", "Tidio Plus", null, 2200, "tidio", false],
  ["AI & Productivity Tools", "Adobe Express Premium", null, 1800, "adobe", false],
  ["High-Demand Products", "Fireflies AI Pro", "12 Months", 4500, "fireflies", true],
  ["High-Demand Products", "Grok Super", "12 Months", 4500, "grok", false],
  ["High-Demand Products", "Anam AI Growth Plan", "7 Months", 13900, "anam", false],
  ["High-Demand Products", "NordVPN", "12 Months", 3200, "nordvpn", false],
  ["High-Demand Products", "GitHub Student Developer Pack", "12 Months", 12900, "github", false],
  ["High-Demand Products", "AppFlyer Credits Package", null, 19900, "appsflyer", false],
  ["High-Demand Products", "1Password Business", "12 Months", 3500, "1password", false],
  ["High-Demand Products", "Mobbin Team Plan", "12 Months", 19900, "mobbin", false],
  ["High-Demand Products", "Devin AI Core Plan", null, null, "devin", false],
  ["High-Demand Products", "Devin AI Pro Plan", "12 Months", null, "devin", false],
  ["High-Demand Products", "Anything Max Plan", "12 Months", 29900, "anythingllm", false],
  ["Lovable Credits Available", "Lovable 100 Credits", "1 Month", 800, "lovable", false],
  ["Lovable Credits Available", "Lovable 200 Credits", "1 Month", 1200, "lovable", false],
  ["Lovable Credits Available", "Lovable 400 Credits", "1 Month", 1600, "lovable", false],
  ["Lovable Credits Available", "Lovable 600 Credits", "1 Month", 2000, "lovable", false],
  ["Lovable Credits Available", "Lovable 600 Credits", "3 Months", 2500, "lovable", false],
  ["Lovable Credits Available", "Coderabbit", "1 Year", 3500, "coderabbit", false],
  ["Lovable Credits Available", "Linktree Lifetime", null, 4500, "linktree", false],
  ["Lovable Credits Available", "Pngtree", "1 Year", 3500, "pngtree", false],
  ["Lovable Credits Available", "Figma", "2 Years", 3500, "figma", false],
  ["Lovable Credits Available", "Loom", "1 Year", 2500, "loom", false],
  ["Lovable Credits Available", "Jira", "1 Year", 2500, "jira", false],
  ["Lovable Credits Available", "Rezi Lifetime", null, 1800, "rezi", false],
  ["Lovable Credits Available", "Vapi", "200 Credits", 2000, "vapi", false],
  ["Lovable Credits Available", "Filmora 15", null, 2000, "filmora", false],
  ["Lovable Credits Available", "Apify", "600 Credits / 4 Months", 4500, "apify", false],
  ["Lovable Credits Available", "Textshift Pro", "12 Months", 4000, "textshifter", false],
  ["SaaS Products & Platforms", "Airtable Business", "12 Months", 5500, "airtable", true],
  ["SaaS Products & Platforms", "Webflow CMS", "1 Year", 2800, "webflow", false],
  ["SaaS Products & Platforms", "Webflow Business", "1 Year", 3800, "webflow", false],
  ["SaaS Products & Platforms", "Asana Advanced", "6 Months up to 100 seats", 10900, "asana", false],
  ["SaaS Products & Platforms", "ClickUp Enterprise", "3000 Credits / 12 Months", 9900, "clickup", false],
  ["SaaS Products & Platforms", "Monday.com", "12 Months", 5900, "monday", false],
  ["SaaS Products & Platforms", "Pipedrive Advanced", "12 Months", 4500, "pipedrive", false],
  ["SaaS Products & Platforms", "Dropbox Business", "12 Months", 3900, "dropbox", false],
  ["SaaS Products & Platforms", "QuillBot Premium", "12 Months", 3900, "quillbot", false],
  ["Other Best-Selling Products", "Microsoft 365 Personal", "1 Year", 1800, "microsoft365", true],
  ["Other Best-Selling Products", "Windows 11 Pro", "Lifetime License", 1400, "windows", true],
  ["Other Best-Selling Products", "Adobe Creative Cloud", "1 Year", 3800, "adobecreativecloud", false],
  ["Other Best-Selling Products", "CorelDRAW Graphics Suite", "1 Year", 3000, "coreldraw", false],
  ["Other Best-Selling Products", "Autodesk AutoCAD", "1 Year", 4500, "autodesk", false],
  ["Other Best-Selling Products", "Lumion Pro", "1 Year", 3500, "lumion", false],
  ["Other Best-Selling Products", "Grammarly Premium", "1 Year", 1800, "grammarly", false],
  ["Other Best-Selling Products", "Coursera Plus", "1 Year", 1800, "coursera", false],
  ["Other Best-Selling Products", "JetBrains All Products Pack", "1 Year", 3500, "jetbrains", false],
  ["Other Best-Selling Products", "MS Office 2021 Professional Plus", "Lifetime", 3500, "microsoftoffice", false],
] as const;

export const categoryOrder = [
  "LinkedIn Tools & Resources",
  "AI & Productivity Tools",
  "High-Demand Products",
  "Lovable Credits Available",
  "SaaS Products & Platforms",
  "Other Best-Selling Products",
] as const;

export const seedCatalog: SeedProduct[] = rawCatalog.map(
  ([category, name, duration, priceCents, logoKey, featured]) => ({
    name,
    slug: slugify(`${name}-${duration ?? "digital-license"}`),
    category,
    description: `${name} delivered as an owner-managed, authorized digital license${duration ? ` with ${duration.toLowerCase()} access` : ""}. Confirm resale rights and brand usage rights before launch.`,
    duration,
    priceCents,
    currency: "EUR",
    logoKey,
    comingSoon: priceCents === null,
    featured,
  }),
);

export const fallbackProducts = seedCatalog.map((product) => ({
  ...product,
  id: product.slug,
  stockCount: product.comingSoon ? 0 : 5,
}));
