import { lazy, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import GlassPanel from "../components/GlassPanel";
import GoldButton from "../components/GoldButton";
import { useDeviceTier } from "../three/useDeviceTier";

const HeroScene = lazy(() => import("../three/HeroScene"));

export default function Success() {
  const { orderId } = useParams();
  const tier = useDeviceTier();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-2">
        <GlassPanel className="overflow-hidden">
          <div className="h-[420px] bg-ink-900">
            {tier === "high" ? (
              <Suspense fallback={<div className="flex h-full items-center justify-center text-white/50">Loading...</div>}>
                <HeroScene scrollProgress={0.2} />
              </Suspense>
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-b from-ink-900 to-ink-950 text-white/60">
                Success Animation
              </div>
            )}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 md:p-8">
          <div className="text-xs tracking-[0.44em] text-gold-200/70">ORDER CONFIRMED</div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="mt-3 text-3xl font-semibold text-white/95">Welcome to the Hive.</div>
            <div className="mt-3 text-sm leading-relaxed text-white/60">
              Your order has been created. Payment integration is currently a placeholder, ready for Cashfree or Razorpay wiring.
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="text-xs tracking-[0.34em] text-gold-200/70">ORDER ID</div>
              <div className="mt-2 break-all text-sm text-white/85">{orderId}</div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/products">
                <GoldButton>Continue Shopping</GoldButton>
              </Link>
              <a href="https://beeinfinitygroups.com" target="_blank" rel="noreferrer">
                <GoldButton variant="ghost">Back to Main Site</GoldButton>
              </a>
            </div>
          </motion.div>
        </GlassPanel>
      </div>
    </div>
  );
}

