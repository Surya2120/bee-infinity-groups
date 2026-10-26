import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import GlassPanel from "../components/GlassPanel";
import GoldButton from "../components/GoldButton";
import { apiFetch } from "../lib/api";
import { formatINR } from "../lib/format";
import { useCart } from "../state/cart";
import { useDeviceTier } from "../three/useDeviceTier";

const ProductViewer = lazy(() => import("../three/ProductViewer"));

type Product = {
  _id: string;
  name: string;
  slug: string;
  category: string;
  priceINR: number;
  description: string;
  images: string[];
  modelUrl?: string;
  variants?: { colors?: string[]; sizes?: string[] };
};

export default function ProductDetail() {
  const { slug } = useParams();
  const cart = useCart();
  const tier = useDeviceTier();

  const [p, setP] = useState<Product | null>(null);
  const [color, setColor] = useState("Black");
  const [size, setSize] = useState("M");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setError(null);
      try {
        const data = await apiFetch<{ product: Product }>(`/api/products/${slug}`);
        if (cancelled) return;
        setP(data.product);
        const firstColor = data.product.variants?.colors?.[0];
        const firstSize = data.product.variants?.sizes?.[0];
        if (firstColor) setColor(firstColor);
        if (firstSize) setSize(firstSize);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const heroImage = useMemo(() => p?.images?.[0], [p]);

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <GlassPanel className="p-10 text-center text-red-200">{error}</GlassPanel>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <GlassPanel className="p-10 text-center text-white/60">Loading product...</GlassPanel>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-2">
        <GlassPanel className="overflow-hidden">
          <div className="h-[420px] bg-ink-900">
            {tier === "high" ? (
              <Suspense fallback={<div className="flex h-full items-center justify-center text-white/50">Loading 3D...</div>}>
                <ProductViewer modelUrl={p.modelUrl} color={color} />
              </Suspense>
            ) : heroImage ? (
              <img src={heroImage} alt={p.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-white/40">PREVIEW</div>
            )}
          </div>
        </GlassPanel>

        <div className="space-y-4">
          <div>
            <div className="text-xs tracking-[0.44em] text-gold-200/70">{p.category}</div>
            <h2 className="mt-3 text-3xl font-semibold text-white/95 md:text-4xl">{p.name}</h2>
            <div className="mt-3 text-lg font-semibold text-gold-100">{formatINR(p.priceINR)}</div>
            <p className="mt-4 text-sm leading-relaxed text-white/60">{p.description}</p>
          </div>

          <GlassPanel className="p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-xs tracking-[0.34em] text-gold-200/70">COLOR</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(p.variants?.colors || ["Black"]).map((c) => (
                    <button
                      key={c}
                      className={[
                        "rounded-full border px-3 py-1.5 text-xs transition",
                        c === color
                          ? "border-gold-500/60 bg-gold-500/10 text-gold-100 shadow-glow"
                          : "border-white/10 bg-white/[0.02] text-white/65 hover:text-white"
                      ].join(" ")}
                      onClick={() => setColor(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs tracking-[0.34em] text-gold-200/70">SIZE</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(p.variants?.sizes || ["M"]).map((s) => (
                    <button
                      key={s}
                      className={[
                        "rounded-full border px-3 py-1.5 text-xs transition",
                        s === size
                          ? "border-gold-500/60 bg-gold-500/10 text-gold-100 shadow-glow"
                          : "border-white/10 bg-white/[0.02] text-white/65 hover:text-white"
                      ].join(" ")}
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <GoldButton
                className="flex-1"
                onClick={() =>
                  cart.add(
                    {
                      productId: p._id,
                      slug: p.slug,
                      name: p.name,
                      priceINR: p.priceINR,
                      image: p.images?.[0],
                      color,
                      size
                    },
                    1
                  )
                }
              >
                Add to Cart
              </GoldButton>
              <GoldButton variant="ghost" className="flex-1" onClick={() => cart.toggle(true)}>
                View Cart
              </GoldButton>
            </div>
          </GlassPanel>

          <GlassPanel className="p-5">
            <div className="text-xs tracking-[0.34em] text-gold-200/70">NOTE</div>
            <div className="mt-2 text-sm text-white/60">
              To enable full GLTF models, place your `.glb` files in `client/public/models/` and set `modelUrl` on the product.
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}

