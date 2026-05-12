import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/70">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 text-sm text-slate-400 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-white">Premium Tools Mega List</h2>
          <p>
            Futuristic storefront for authorized digital licenses, subscriptions, and redemption keys.
          </p>
          <p className="text-xs text-amber-200/80">
            Owner note: confirm resale rights and logo/trademark usage rights before launch.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-white">Pages</h3>
          <div className="flex flex-col gap-2">
            <Link href="/products">Products</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-white">Legal</h3>
          <div className="flex flex-col gap-2">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/refund-policy">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
