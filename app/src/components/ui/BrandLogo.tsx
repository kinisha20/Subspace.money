"use client";
import { useState } from "react";

interface BrandLogoProps {
  logoUrl?: string;
  name: string;
  color: string;
  size?: "sm" | "md";
}

/**
 * BrandLogo — shows real company logo from Clearbit.
 * On error (404 / blocked / offline) falls back to coloured initial letter.
 * Uses React state — no innerHTML hacks.
 */
export function BrandLogo({ logoUrl, name, color, size = "md" }: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  const wrapCls  = size === "md" ? "w-11 h-11" : "w-8 h-8";
  const imgCls   = size === "md" ? "w-7 h-7"   : "w-5 h-5";
  const fontCls  = size === "md" ? "text-[15px]" : "text-[10px]";

  if (logoUrl && !failed) {
    return (
      <div
        className={`${wrapCls} rounded-xl bg-white border border-[#EFEFEF] flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm`}
      >
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className={`${imgCls} object-contain`}
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  /* Fallback — coloured initial */
  return (
    <div
      className={`${wrapCls} rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-white ${fontCls}`}
      style={{ background: color }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
