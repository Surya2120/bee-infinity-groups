import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { formatINR } from "../lib/format";

export type Product = {
  _id: string;
  name: string;
  slug: string;
  category: string;
  priceINR: number;
  description: string;
  images: string[];
  modelUrl?: string;
  variants?: { colors?: string[]; sizes?: string[] };
  isFeatured?: boolean;
};

export default function ProductCard({ p }: { p: Product }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 26 });
  const sy = useSpring(my, { stiffness: 220, damping: 26 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-12, 12]);

  return (
    <Link to={`/products/${p.slug}`} className="group block">
      <motion.div
        className={[
          "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]",
          "shadow-[0_30px_140px_rgba(0,0,0,.55)]"
        ].join(" ")}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ y: -6, boxShadow: "0 0 0 1px rgba(212,175,55,.25), 0 40px 160px rgba(0,0,0,.65)" }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        onMouseMove={(e) => {
          const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          mx.set(((e.clientX - r.left) / r.width - 0.5) * 1);
          my.set(((e.clientY - r.top) / r.height - 0.5) * 1);
        }}
        onMouseLeave={() => {
          mx.set(0);
          my.set(0);
        }}
      >
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gold-500/12 blur-3xl" />
          <div className="absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        </div>

        <div className="aspect-[4/3] overflow-hidden bg-ink-900">
          {p.images?.[0] ? (
            <img
              src={p.images[0]}
              alt={p.name}
              className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.06] group-hover:opacity-100"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-white/40">NO IMAGE</div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white/95">{p.name}</div>
              <div className="mt-1 text-xs tracking-wide text-white/55">{p.category}</div>
            </div>
            <div className="shrink-0 text-sm font-semibold text-gold-100">{formatINR(p.priceINR)}</div>
          </div>

          <div className="mt-3 text-xs text-white/60">{p.description}</div>
        </div>
      </motion.div>
    </Link>
  );
}
