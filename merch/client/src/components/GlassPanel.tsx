import React from "react";

export default function GlassPanel({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl",
        "shadow-[0_40px_160px_rgba(0,0,0,.55)]",
        className
      ].join(" ")}
    >
      {children}
    </div>
  );
}

