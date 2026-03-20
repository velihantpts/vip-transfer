"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Route as RouteIcon, Shield, Star, MessageCircle } from "lucide-react";
import type { Dictionary, Locale } from "@/dictionaries";
import type { Point, Route } from "@/lib/routes";
import { CurrencyProvider, useCurrency } from "./CurrencyToggle";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BookingModal from "./BookingModal";
import WhatsAppButton from "./WhatsAppButton";

function RouteContent({ route, from, to }: { route: Route; from: Point; to: Point }) {
  const [booking, setBooking] = useState(false);
  const { convert, symbol } = useCurrency();

  const whatsappMsg = encodeURIComponent(`Merhaba, ${from.name} → ${to.name} transfer fiyatı hakkında bilgi almak istiyorum.`);

  return (
    <>
      <section className="pt-24 pb-16">
        <div className="max-w-[980px] mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <p className="text-primary text-sm font-medium mb-4">VIP Transfer</p>
            <h1 className="text-3xl sm:text-5xl font-semibold text-text tracking-tight mb-4">
              {from.name} <span className="text-secondary">→</span> {to.name}
            </h1>
            <p className="text-secondary text-lg">Sabit fiyat, profesyonel hizmet.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-8 max-w-xl mx-auto bg-card-bg text-center">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div>
                <p className="text-xs text-tertiary">Mesafe</p>
                <p className="text-2xl font-semibold text-text flex items-center justify-center gap-1.5"><RouteIcon className="w-5 h-5 text-secondary" />{route.km} km</p>
              </div>
              <div className="w-px h-10 bg-border-light" />
              <div>
                <p className="text-xs text-tertiary">Süre</p>
                <p className="text-2xl font-semibold text-text flex items-center justify-center gap-1.5"><Clock className="w-5 h-5 text-secondary" />~{route.min} dk</p>
              </div>
              <div className="w-px h-10 bg-border-light" />
              <div>
                <p className="text-xs text-tertiary">Başlangıç Fiyat</p>
                <p className="text-2xl font-semibold text-text">{symbol}{convert(route.price)}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => setBooking(true)} className="btn-primary px-8 py-3 rounded-full text-sm flex items-center justify-center gap-2">
                Hemen Rezerve Et <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={`https://wa.me/905551234567?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm border border-border-light text-text hover:bg-surface transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Features */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 max-w-xl mx-auto">
            {[
              { icon: Shield, text: "Sigortalı yolculuk" },
              { icon: Star, text: "4.9 Google puan" },
              { icon: Clock, text: "7/24 hizmet" },
              { icon: RouteIcon, text: "Sabit fiyat" },
            ].map((f) => (
              <div key={f.text} className="text-center">
                <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center mx-auto mb-2">
                  <f.icon className="w-5 h-5 text-secondary" />
                </div>
                <p className="text-xs text-secondary">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${from.name} - ${to.name} VIP Transfer`,
            description: `${from.name} ile ${to.name} arası VIP transfer hizmeti. ${route.km} km mesafe, yaklaşık ${route.min} dakika süre.`,
            offers: {
              "@type": "Offer",
              price: route.price,
              priceCurrency: "TRY",
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />

      {booking && (
        <BookingModal open={booking} onClose={() => setBooking(false)} from={from.name} to={to.name} km={route.km} min={route.min} price={route.price} />
      )}
    </>
  );
}

export default function RoutePageClient({ route, from, to, dict, lang }: { route: Route; from: Point; to: Point; dict: Dictionary; lang: Locale }) {
  return (
    <CurrencyProvider>
      <Navbar dict={dict} lang={lang} />
      <main>
        <RouteContent route={route} from={from} to={to} />
      </main>
      <Footer dict={dict} lang={lang} />
      <WhatsAppButton />
    </CurrencyProvider>
  );
}
