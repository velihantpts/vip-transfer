"use client";

import { ArrowRight, Phone } from "lucide-react";
import { FadeIn } from "./AnimatedSection";

export default function CtaBanner() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-[980px] mx-auto px-6">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl bg-primary p-10 sm:p-14 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-3">Transferinizi Planlayin</h2>
              <p className="text-sm text-white/60 mb-8 max-w-md mx-auto">Antalya&apos;da guvenli, konforlu ve zamaninda transfer icin hemen rezervasyon yapin.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#rezervasyon" className="bg-white text-primary font-semibold text-sm px-8 py-3.5 rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2">
                  Hemen Rezervasyon Yap <ArrowRight className="w-4 h-4" />
                </a>
                <a href="tel:+905551234567" className="text-white/60 hover:text-white text-sm flex items-center gap-2 transition-colors">
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
