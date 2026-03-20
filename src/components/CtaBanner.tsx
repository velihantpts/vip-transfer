"use client";

import { ArrowRight, Phone } from "lucide-react";
import { FadeIn } from "./AnimatedSection";

export default function CtaBanner() {
  return (
    <section className="py-20">
      <div className="max-w-[980px] mx-auto px-6">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-gray-900 p-10 sm:p-14 text-center">
            {/* Amber glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Transferinizi Planlayin</h2>
              <p className="text-sm text-white/50 mb-8 max-w-md mx-auto">Antalya&apos;da guvenli, konforlu ve zamaninda transfer icin hemen rezervasyon yapin.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#rezervasyon" className="bg-amber-400 text-gray-900 font-semibold text-sm px-8 py-3.5 rounded-full hover:bg-amber-300 transition-all hover:shadow-lg hover:shadow-amber-400/25 flex items-center gap-2">
                  Hemen Rezervasyon Yap <ArrowRight className="w-4 h-4" />
                </a>
                <a href="tel:+905551234567" className="text-white/50 hover:text-white text-sm flex items-center gap-2 transition-colors">
                  <Phone className="w-4 h-4" /> +90 555 123 45 67
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
