"use client";

import { MapPin, Car, CheckCircle } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./AnimatedSection";
import type { Dictionary } from "@/dictionaries";

export default function HowItWorks({ dict }: { dict: Dictionary }) {
  const steps = [
    { icon: MapPin, title: dict.howItWorks.step1Title, desc: dict.howItWorks.step1Desc },
    { icon: Car, title: dict.howItWorks.step2Title, desc: dict.howItWorks.step2Desc },
    { icon: CheckCircle, title: dict.howItWorks.step3Title, desc: dict.howItWorks.step3Desc },
  ];

  return (
    <section id="nasil-calisir" className="py-24">
      <div className="max-w-[980px] mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-text tracking-tight">
            {dict.howItWorks.title} <span className="text-secondary">{dict.howItWorks.titleHighlight}</span>?
          </h2>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <StaggerItem key={i} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center mx-auto mb-5">
                <step.icon className="w-6 h-6 text-text" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-text">{step.title}</h3>
              <p className="text-sm text-secondary leading-relaxed">{step.desc}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
