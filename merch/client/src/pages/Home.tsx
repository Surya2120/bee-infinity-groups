import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GoldButton from "../components/GoldButton";
import GlassPanel from "../components/GlassPanel";
import { useDeviceTier } from "../three/useDeviceTier";

const HeroScene = lazy(() => import("../three/HeroScene"));

export default function Home() {
  const tier = useDeviceTier();
  const { scrollYProgress } = useScroll();
  const clip = useTransform(scrollYProgress, [0, 0.35], [0, 14]);
  const clipPath = useMotionTemplate`inset(0 0 ${clip}% 0 round 0px)`;
  const opacity = useTransform(scrollYProgress, [0, 0.35], [1, 0.65]);
  const t = useTransform(scrollYProgress, [0, 0.35], [0, 1]);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const unsub = t.on("change", (v: number) => setScrollProgress(v));
    return () => unsub();
  }, [t]);

  const fallback = useMemo(
    () => (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="text-xs tracking-[0.34em] text-gold-200/70">SHOWROOM</div>
          <div className="mt-2 text-2xl font-semibold text-white/90">3D Experience Loading</div>
          <div className="mt-3 text-sm text-white/55">Your device is in low-graphics mode.</div>
        </div>
      </div>
    ),
    []
  );

  return (
    <section className="relative">
      <motion.div
        className="relative h-[92vh] min-h-[640px] overflow-hidden"
        style={{ clipPath, opacity }}
      >
        <div className="absolute inset-0">
          {tier === "high" ? (
            <Suspense fallback={fallback}>
              <HeroScene scrollProgress={scrollProgress} />
            </Suspense>
          ) : (
            <div className="h-full w-full bg-gradient-to-b from-ink-900 to-ink-950" />
          )}
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <div className="text-xs tracking-[0.44em] text-gold-200/70">BEE INFINITY GROUPS</div>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-white/95 md:text-6xl">
              Enter the{" "}
              <span className="bg-gradient-to-r from-gold-100 via-gold-500 to-gold-100 bg-clip-text text-transparent">
                Cinematic Merch Showroom
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65 md:text-base">
              Not a store. A digital set. Rotate products in 3D, feel the glow, and shop like a luxury brand experience.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/products">
                <GoldButton>Explore Collection</GoldButton>
              </Link>
              <a href="https://beeinfinitygroups.com" target="_blank" rel="noreferrer">
                <GoldButton variant="ghost">Back to Main Site</GoldButton>
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <GlassPanel className="p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            <Feature title="3D Rotation" body="Drag to rotate. Zoom in. Premium lighting and shadows." />
            <Feature title="Gold Glow UI" body="Glass panels, glow hovers, cinematic transitions and micro-interactions." />
            <Feature title="Fast + Adaptive" body="Lazy 3D loading with automatic fallback for low-power devices." />
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="text-xs tracking-[0.34em] text-gold-200/70">FEATURE</div>
      <div className="mt-2 text-lg font-semibold text-white/90">{title}</div>
      <div className="mt-2 text-sm text-white/60">{body}</div>
    </div>
  );
}
