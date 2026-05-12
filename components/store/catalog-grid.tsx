import { ProductCard } from "@/components/store/product-card";
import type { CatalogProduct } from "@/lib/types";

export function CatalogGrid({ sections }: { sections: Array<{ category: string; products: CatalogProduct[] }> }) {
  return (
    <div className="space-y-14">
      {sections.map((section, index) => (
        <section key={section.category} className="space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">Category {String(index + 1).padStart(2, "0")}</p>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">{section.category}</h2>
            </div>
            <p className="text-sm text-slate-400">Authorized digital access with owner-managed key fulfillment.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {section.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
