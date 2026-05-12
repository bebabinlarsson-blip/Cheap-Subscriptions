import Link from "next/link";
import { ArrowRight, Inbox, LockKeyhole, ShieldCheck, ShoppingBag } from "lucide-react";

import { CatalogGrid } from "@/components/store/catalog-grid";
import { FAQSection } from "@/components/store/faq";
import { ProductCard } from "@/components/store/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCatalogGroupedByCategory, getFeaturedProducts, getStoreSummary } from "@/lib/catalog";

export default async function HomePage() {
  const [sections, featuredProducts, summary] = await Promise.all([
    getCatalogGroupedByCategory(),
    getFeaturedProducts(),
    getStoreSummary(),
  ]);

  const trustBadges = [
    { icon: ShoppingBag, label: "Instant Delivery" },
    { icon: LockKeyhole, label: "Secure PayPal Checkout" },
    { icon: ShieldCheck, label: "Verified Digital Licenses" },
    { icon: Inbox, label: "Limited Stock" },
  ];

  return (
    <div className="space-y-20">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <Badge className="border-white/20 bg-white/10 text-slate-100">Future-ready digital marketplace</Badge>
          <div className="space-y-4">
              <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                Premium Tools <span className="text-slate-200">Mega List</span>
              </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              Instant access to verified digital tools, licenses, and productivity services.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/products"><Button>Shop Now</Button></Link>
            <Link href="/products"><Button variant="secondary">View Products</Button></Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {trustBadges.map((item) => (
                <Card key={item.label} className="flex items-center gap-3 border-white/10 p-4">
                  <item.icon className="h-5 w-5 text-slate-300" />
                  <span className="text-sm text-slate-200">{item.label}</span>
                </Card>
              ))}
            </div>
          </div>

        <Card className="relative overflow-hidden p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.18),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(51,65,85,0.2),transparent_40%)]" />
          <div className="relative space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Live products</p>
                <h2 className="mt-2 text-3xl font-black text-white">{summary.availableCount}</h2>
              </Card>
              <Card className="p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Categories</p>
                <h2 className="mt-2 text-3xl font-black text-white">{summary.categories}</h2>
              </Card>
              <Card className="col-span-2 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Purchased items</p>
                <h2 className="mt-2 text-3xl font-black text-white">{summary.purchasedItems}</h2>
                <p className="mt-2 text-sm text-slate-400">Starts at 47 and increases by each purchased item unit.</p>
              </Card>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/5 p-5 text-sm leading-7 text-slate-200">
              Owner reminder: only sell authorized subscriptions, licenses, and redemption keys. Confirm resale rights and logo usage rights before launch.
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Featured products</p>
              <h2 className="mt-2 text-3xl font-black text-white">Fast-moving tools with glowing demand</h2>
            </div>
          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-slate-200">
            Explore full catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <CatalogGrid sections={sections} />
      <FAQSection />

      <Card className="flex flex-col gap-6 overflow-hidden bg-white/[0.04] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Launch-ready store</p>
          <h2 className="mt-2 text-3xl font-black text-white">Deploy on Vercel, connect Google login, and go live.</h2>
          <p className="mt-3 max-w-2xl text-slate-300">Everything is structured for PostgreSQL, Prisma, Auth.js, PayPal verification, and owner-managed key delivery.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/products"><Button>Start Shopping</Button></Link>
          <Link href="/contact"><Button variant="secondary">Contact</Button></Link>
        </div>
      </Card>
    </div>
  );
}
