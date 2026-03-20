"use client";

import { FadeIn } from "./AnimatedSection";
import type { Dictionary } from "@/dictionaries";

export default function TrustBar({ dict }: { dict: Dictionary }) {
  const stats = [
    { value: "4.9/5", label: dict.trust.rating },
    { value: "2,500+", label: dict.trust.transfers },
    { value: "7/24", label: dict.trust.service },
    { value: "100%", label: dict.trust.safe },
  ];

  return (
    <section className="py-10 border-y border-border-light bg-card-bg">
      <div className="max-w-[980px] mx-auto px-6">
        <FadeIn className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-semibold text-text tracking-tight">{stat.value}</p>
              <p className="text-xs text-tertiary mt-0.5">{stat.label}</p>
            </div>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
