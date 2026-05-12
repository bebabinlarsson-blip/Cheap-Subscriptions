import { CatalogGrid } from "@/components/store/catalog-grid";
import { Card } from "@/components/ui/card";
import { getCatalogGroupedByCategory } from "@/lib/catalog";

export default async function ProductsPage() {
  const sections = await getCatalogGroupedByCategory();

  return (
    <div className="space-y-10">
      <Card>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Catalog</p>
        <h1 className="mt-2 text-4xl font-black text-white">Authorized digital licenses and key inventory</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          All prices are shown in EUR, coming soon products stay disabled, and stock indicators only reflect server-managed inventory.
        </p>
        <p className="mt-2 max-w-3xl text-sm font-medium text-emerald-400">
          ✦ All products are currently available in unlimited stock.
        </p>
      </Card>
      <CatalogGrid sections={sections} />
    </div>
  );
}
