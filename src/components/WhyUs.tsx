"use client";

import { Shield, Clock, CreditCard, Headphones, Car, Award } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./AnimatedSection";

const features = [
  { icon: Shield, title: "Sigortalı Yolculuk", desc: "Tüm transferlerimiz tam sigorta kapsamındadır." },
  { icon: Clock, title: "Zamanında Karşılama", desc: "Uçuşunuz takip edilir, gecikmede ücretsiz bekleme." },
  { icon: CreditCard, title: "Sabit Fiyat", desc: "Trafik, bekleme, otopark — ekstra ücret yok." },
  { icon: Headphones, title: "7/24 Destek", desc: "WhatsApp, telefon ve email ile her zaman ulaşın." },
  { icon: Car, title: "Lüks Araçlar", desc: "Mercedes filo: E-Class, V-Class, S-Class, Sprinter." },
  { icon: Award, title: "4.9★ Google Puan", desc: "2.500+ müşterinin güvendiği hizmet." },
];

export default function WhyUs() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-[980px] mx-auto px-6">
        <FadeIn className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-semibold text-text tracking-tight">
            Neden <span className="text-secondary">Biz</span>?
          </h2>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <StaggerItem key={f.title} className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-card-bg border border-card-border flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-5 h-5 text-text" />
              </div>
              <h3 className="text-sm font-semibold text-text mb-1">{f.title}</h3>
              <p className="text-xs text-secondary leading-relaxed">{f.desc}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
