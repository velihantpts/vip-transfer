"use client";

import { useState, useCallback } from "react";
import type { Dictionary, Locale } from "@/dictionaries";
import { CurrencyProvider } from "./CurrencyToggle";
import Navbar from "./Navbar";
import Hero from "./Hero";
import SocialProof from "./SocialProof";
import HowItWorks from "./HowItWorks";
import WhyUs from "./WhyUs";
import Fleet from "./Fleet";
import TransferPlanner from "./TransferPlanner";
import CtaBanner from "./CtaBanner";
import Reviews from "./Reviews";
import FAQ from "./FAQ";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import MobileBottomBar from "./MobileBottomBar";

export default function ClientPage({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  const [selectedRoute, setSelectedRoute] = useState<{ from: string; to: string } | null>(null);

  const handleRouteSelect = useCallback((from: string, to: string) => {
    setSelectedRoute({ from, to });
    // Scroll to transfer planner
    setTimeout(() => {
      document.getElementById("rotalar")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  return (
    <CurrencyProvider>
      <Navbar dict={dict} lang={lang} />
      <main id="main-content">
        <Hero dict={dict} onRouteSelect={handleRouteSelect} />
        <SocialProof />
        <HowItWorks dict={dict} />
        <WhyUs />
        <Fleet dict={dict} />
        <TransferPlanner selectedRoute={selectedRoute} onRouteConsumed={() => setSelectedRoute(null)} />
        <CtaBanner />
        <Reviews dict={dict} />
        <FAQ dict={dict} />
      </main>
      <Footer dict={dict} lang={lang} />
      <WhatsAppButton />
      <MobileBottomBar dict={dict} />
    </CurrencyProvider>
  );
}
