import { useEffect, useState } from "react";

export type DeviceTier = "low" | "high";

function estimateTier(): DeviceTier {
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as any).deviceMemory || 4;
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reduceMotion) return "low";
  if (cores <= 4) return "low";
  if (mem <= 4) return "low";
  return "high";
}

export function useDeviceTier() {
  const [tier, setTier] = useState<DeviceTier>(() => estimateTier());
  useEffect(() => {
    const id = window.setTimeout(() => setTier(estimateTier()), 250);
    return () => window.clearTimeout(id);
  }, []);
  return tier;
}

