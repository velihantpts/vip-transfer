"use client";

import { ArrowRight, Phone } from "lucide-react";
import { FadeIn } from "./AnimatedSection";

export default function CtaBanner() {
  return (
    <section className="py-16">
      <div className="max-w-[980px] mx-auto px-6">
        <FadeIn>
          <div className="bg-cta-bg rounded-2xl p-8 sm:p-12 text-center border border-border-light">
            <h2 className="text-2xl sm:text-3xl font-semibold text-cta-text mb-3">Transferinizi Planlayın</h2>
            <p className="text-sm text-cta-text/60 mb-6 max-w-md mx-auto">Antalya&apos;da güvenli, konforlu ve zamanında transfer için hemen rezervasyon yapın.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="#rezervasyon" className="bg-cta-btn-bg text-cta-btn-text font-medium text-sm px-6 py-3 rounded-full hover:opacity-90 transition-opacity flex items-center gap-2">
                Hemen Rezervasyon Yap <ArrowRight className="w-4 h-4" />
              </a>
              <a href="tel:+905551234567" className="text-cta-text/60 hover:text-cta-text text-sm flex items-center gap-2 transition-colors">
                <Phone className="w-4 h-4" /> +90 555 123 45 67
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
