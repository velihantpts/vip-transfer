"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./AnimatedSection";
import type { Dictionary } from "@/dictionaries";

export default function Reviews({ dict }: { dict: Dictionary }) {
  return (
    <section id="yorumlar" className="py-24 bg-surface">
      <div className="max-w-[980px] mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-text tracking-tight">
            {dict.reviews.title} <span className="text-secondary">{dict.reviews.titleHighlight}</span>?
          </h2>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dict.reviewList.map((review: { name: string; country: string; text: string; source: string }) => (
            <StaggerItem key={review.name}>
              <motion.div whileHover={{ y: -2 }} className="card p-5 h-full">
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-secondary leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center justify-between pt-3 border-t border-border-light">
                  <div>
                    <p className="text-sm font-medium text-text">{review.name}</p>
                    <p className="text-xs text-tertiary">{review.country}</p>
                  </div>
                  <span className="text-[10px] text-tertiary bg-surface rounded-md px-2 py-0.5">{review.source}</span>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
