import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

type GoldButtonProps = HTMLMotionProps<"button"> & { variant?: "solid" | "ghost" };

export default function GoldButton(props: GoldButtonProps) {
  const { variant = "solid", className = "", ...rest } = props;

  const base =
    "relative inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm tracking-wide transition focus:outline-none focus:ring-2 focus:ring-gold-500/50";

  const solid =
    "bg-gold-500 text-ink-950 shadow-glow hover:shadow-glowStrong active:translate-y-[1px] disabled:opacity-50";
  const ghost =
    "border border-gold-500/40 text-gold-100 hover:bg-gold-500/10 hover:border-gold-500/60 active:translate-y-[1px] disabled:opacity-50";

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${base} ${variant === "solid" ? solid : ghost} ${className}`}
      {...rest}
    />
  );
}
