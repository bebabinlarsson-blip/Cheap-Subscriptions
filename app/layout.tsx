import type { Metadata } from "next";
import localFont from "next/font/local";

import "@/app/globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getAuthSession } from "@/lib/auth/session";

const inter = localFont({
  src: [
    { path: "./fonts/GeistVF.woff", style: "normal" },
    { path: "./fonts/GeistMonoVF.woff", style: "normal" },
  ],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Premium Tools Mega List",
  description: "Instant access to verified digital tools, licenses, and productivity services.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Premium Tools Mega List",
    description: "Futuristic marketplace for authorized digital licenses and redemption keys.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getAuthSession();

  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans">
        <AppProviders session={session}>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">{children}</main>
            <SiteFooter />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
