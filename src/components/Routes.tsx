"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./AnimatedSection";
import { useCurrency } from "./CurrencyToggle";
import type { Dictionary } from "@/dictionaries";

export default function Routes({ dict }: { dict: Dictionary }) {
  const { convert, symbol } = useCurrency();

  return (
    <section id="rotalar" className="py-28 bg-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-20">
          <span className="chip inline-block mb-4">{dict.routes.badge}</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text">
            {dict.routes.title} <span className="text-primary">{dict.routes.titleHighlight}</span>
          </h2>
          <p className="text-muted mt-4 max-w-lg mx-auto">{dict.routes.subtitle}</p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dict.routeList.map((route: { from: string; to: string; distance: string; duration: string; price: number }) => (
            <StaggerItem key={route.to}>
              <motion.div whileHover={{ y: -4 }} className="soft-card p-5 cursor-pointer h-full">
                <div className="flex items-center gap-2 text-sm mb-3">
                  <MapPin className="w-3.5 h-3.5 text-dim shrink-0" />
                  <span className="text-muted truncate">{route.from}</span>
                </div>
                <div className="flex items-center gap-2 text-sm mb-4">
                  <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="font-semibold text-text">{route.to}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-dim mb-4">
                  <span>{route.distance}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{route.duration}</span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-[11px] text-dim">{dict.routes.startingFrom}</span>
                  <span className="text-xl font-bold text-text"><span className="text-amber">{symbol}</span>{convert(route.price)}</span>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
