import { useEffect, useMemo, useState } from "react";
import GlassPanel from "../components/GlassPanel";
import ProductCard, { Product } from "../components/ProductCard";
import { apiFetch } from "../lib/api";

const CATEGORIES = [
  "All",
  "Clothing",
  "Caps",
  "Mugs",
  "Mandala Arts",
  "Bee Infinity Official T-Shirts",
  "BOTD T-Shirts"
] as const;

export default function Catalog() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const q = category === "All" ? "" : `?category=${encodeURIComponent(category)}`;
        const data = await apiFetch<{ products: Product[] }>(`/api/products${q}`);
        if (!cancelled) setProducts(data.products);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [category]);

  const featured = useMemo(() => products.filter((p) => p.isFeatured), [products]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs tracking-[0.44em] text-gold-200/70">COLLECTION</div>
          <h2 className="mt-3 text-3xl font-semibold text-white/95 md:text-4xl">Products</h2>
          <p className="mt-2 max-w-xl text-sm text-white/60">
            Hover to feel depth. Click to enter the full 3D viewer.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={[
                "rounded-full border px-3 py-1.5 text-xs tracking-wide transition",
                c === category
                  ? "border-gold-500/60 bg-gold-500/10 text-gold-100 shadow-glow"
                  : "border-white/10 bg-white/[0.02] text-white/65 hover:text-white"
              ].join(" ")}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {featured.length > 0 ? (
        <div className="mt-8">
          <GlassPanel className="p-5">
            <div className="text-xs tracking-[0.34em] text-gold-200/70">FEATURED</div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {featured.slice(0, 2).map((p) => (
                <ProductCard key={p._id} p={p} />
              ))}
            </div>
          </GlassPanel>
        </div>
      ) : null}

      <div className="mt-8">
        {loading ? (
          <GlassPanel className="p-10 text-center text-white/60">Loading the showroom...</GlassPanel>
        ) : error ? (
          <GlassPanel className="p-10 text-center text-red-200">{error}</GlassPanel>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p._id} p={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

