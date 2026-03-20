"use client";

import { MapPin, Car, CheckCircle, Shield, Clock, CreditCard, Headphones, Award } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./AnimatedSection";
import type { Dictionary } from "@/dictionaries";

const features = [
  { icon: Shield, title: "Sigortali Yolculuk", desc: "Tum transferlerimiz tam sigorta kapsamindadir." },
  { icon: Clock, title: "Zamaninda Karsilama", desc: "Ucusunuz takip edilir, gecikmede ucretsiz bekleme." },
  { icon: CreditCard, title: "Sabit Fiyat", desc: "Trafik, bekleme, otopark — ekstra ucret yok." },
  { icon: Headphones, title: "7/24 Destek", desc: "WhatsApp, telefon ve email ile her zaman ulasin." },
  { icon: Car, title: "Luks Araclar", desc: "Mercedes filo: E-Class, V-Class, S-Class, Sprinter." },
  { icon: Award, title: "4.9 Google Puan", desc: "2.500+ musterinin guvendigi hizmet." },
];

export default function HowItWorks({ dict }: { dict: Dictionary }) {
  const steps = [
    { num: "01", icon: MapPin, title: dict.howItWorks.step1Title, desc: dict.howItWorks.step1Desc },
    { num: "02", icon: Car, title: dict.howItWorks.step2Title, desc: dict.howItWorks.step2Desc },
    { num: "03", icon: CheckCircle, title: dict.howItWorks.step3Title, desc: dict.howItWorks.step3Desc },
  ];

  return (
    <section id="nasil-calisir" className="py-28">
      <div className="max-w-[980px] mx-auto px-6">
        {/* How it works — 3 steps */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text tracking-tight">
            {dict.howItWorks.title} <span className="text-amber-500">{dict.howItWorks.titleHighlight}</span>?
          </h2>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {steps.map((step) => (
            <StaggerItem key={step.num} className="text-center">
              <div className="relative w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-5 group">
                <step.icon className="w-7 h-7 text-amber-500" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center">{step.num}</span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-text">{step.title}</h3>
              <p className="text-sm text-secondary leading-relaxed">{step.desc}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Why us — 6 features */}
        <FadeIn className="text-center mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
            Neden <span className="text-amber-500">Biz</span>?
          </h3>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <div className="text-center p-5 rounded-2xl border border-border-light bg-card-bg hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-100 transition-colors">
                  <f.icon className="w-5 h-5 text-amber-500" />
                </div>
                <h4 className="text-sm font-bold text-text mb-1">{f.title}</h4>
                <p className="text-xs text-secondary leading-relaxed">{f.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
