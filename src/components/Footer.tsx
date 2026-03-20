"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/dictionaries";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Footer({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  const links = [
    { href: "#araclar", label: dict.nav.fleet },
    { href: "#rotalar", label: dict.nav.routes },
    { href: "#nasil-calisir", label: dict.nav.howItWorks },
    { href: "#yorumlar", label: dict.nav.reviews },
    { href: "#sss", label: dict.nav.faq },
  ];

  return (
    <footer id="iletisim" className="border-t border-border-light pt-12 pb-8 bg-surface">
      <div className="max-w-[980px] mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 sm:col-span-1">
            <Link href={`/${lang}`} className="text-sm font-semibold text-text">Antalya VIP Transfer</Link>
            <p className="text-xs text-secondary mt-2 leading-relaxed">{dict.footer.desc}</p>
            <div className="mt-3"><LanguageSwitcher current={lang} /></div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-text mb-3">{dict.footer.quickLinks}</h4>
            <ul className="space-y-2">
              {links.map((link) => <li key={link.href}><a href={link.href} className="text-xs text-secondary hover:text-text transition-colors">{link.label}</a></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-text mb-3">{dict.footer.popularRoutes}</h4>
            <ul className="space-y-2">
              {dict.routeList.slice(0, 5).map((r: { to: string }) => <li key={r.to}><span className="text-xs text-secondary">{r.to}</span></li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-text mb-3">{dict.footer.contactTitle}</h4>
            <ul className="space-y-2.5">
              <li><a href={`tel:${dict.nav.phone}`} className="flex items-center gap-2 text-xs text-secondary hover:text-text transition-colors"><Phone className="w-3 h-3" />{dict.nav.phone}</a></li>
              <li><a href="mailto:info@antalyaviptransfer.com" className="flex items-center gap-2 text-xs text-secondary hover:text-text transition-colors"><Mail className="w-3 h-3" />info@antalyaviptransfer.com</a></li>
              <li><span className="flex items-center gap-2 text-xs text-secondary"><MapPin className="w-3 h-3" />Antalya, Türkiye</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border-light pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-tertiary">{dict.footer.copyright}</p>
          <div className="flex items-center gap-5 text-[11px] text-tertiary">
            <a href="#" className="hover:text-text transition-colors">{dict.footer.privacy}</a>
            <a href="#" className="hover:text-text transition-colors">{dict.footer.terms}</a>
            <Link href={`/${lang}/admin`} className="hover:text-text transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
