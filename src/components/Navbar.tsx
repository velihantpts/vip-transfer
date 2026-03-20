"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Search } from "lucide-react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/dictionaries";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import TrackBooking from "./TrackBooking";

export default function Navbar({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);

  const navLinks = [
    { href: "#araclar", label: dict.nav.fleet },
    { href: "#rotalar", label: dict.nav.routes },
    { href: "#nasil-calisir", label: dict.nav.howItWorks },
    { href: "#yorumlar", label: dict.nav.reviews },
    { href: "#sss", label: dict.nav.faq },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl backdrop-saturate-150 border-b border-border-light" : ""
      }`}
    >
      <div className="max-w-[980px] mx-auto px-6">
        <div className="flex items-center justify-between h-12">
          <Link href={`/${lang}`} className="text-sm font-semibold text-text">
            Antalya VIP Transfer
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-xs text-secondary hover:text-text transition-colors">{link.label}</a>
            ))}
            <button onClick={() => setTrackOpen(true)} className="text-xs text-secondary hover:text-text transition-colors flex items-center gap-1">
              <Search className="w-3 h-3" />Sorgula
            </button>
            <ThemeToggle />
            <LanguageSwitcher current={lang} />
            <a href="#rezervasyon" className="text-xs text-primary hover:text-primary-dark transition-colors font-medium">{dict.nav.bookNow}</a>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-text" aria-label="Menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:hidden bg-card-bg/95 backdrop-blur-xl border-t border-border-light">
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block text-sm text-secondary hover:text-text py-1">{link.label}</a>
            ))}
            <div className="pt-2 flex items-center gap-3">
              <LanguageSwitcher current={lang} />
            </div>
            <a href="#rezervasyon" onClick={() => setMobileOpen(false)} className="block btn-primary px-5 py-2.5 rounded-full text-center text-sm mt-3">{dict.nav.bookNow}</a>
          </div>
        </motion.div>
      )}
      <TrackBooking open={trackOpen} onClose={() => setTrackOpen(false)} />
    </motion.nav>
  );
}
