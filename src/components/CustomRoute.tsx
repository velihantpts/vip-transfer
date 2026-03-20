"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Route, Clock } from "lucide-react";
import { FadeIn } from "./AnimatedSection";
import { useCurrency } from "./CurrencyToggle";
import { points, distanceKm, estimateMinutes, calculateCustomPrice } from "@/lib/routes";
import BookingModal from "./BookingModal";

export default function CustomRoute() {
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [booking, setBooking] = useState(false);
  const { convert, symbol } = useCurrency();

  const fromPoint = points.find((p) => p.id === fromId);
  const toPoint = points.find((p) => p.id === toId);

  const result = useMemo(() => {
    if (!fromPoint || !toPoint || fromId === toId) return null;
    const km = distanceKm(fromPoint, toPoint);
    const min = estimateMinutes(km);
    const price = calculateCustomPrice(km);
    return { km, min, price };
  }, [fromPoint, toPoint, fromId, toId]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof points> = { "Havalimanı": [], "Bölgeler": [], "Oteller": [], "Gezilecek Yerler": [] };
    for (const p of points) {
      if (p.type === "airport") groups["Havalimanı"].push(p);
      else if (p.type === "district") groups["Bölgeler"].push(p);
      else if (p.type === "hotel") groups["Oteller"].push(p);
      else groups["Gezilecek Yerler"].push(p);
    }
    return groups;
  }, []);

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-[980px] mx-auto px-6">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-text tracking-tight">
            Kendi <span className="text-secondary">Rotanı Oluştur</span>
          </h2>
          <p className="text-secondary mt-3 text-sm">Otelden gezilecek yerlere, bölgeden bölgeye — istediğin rotayı seç.</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="card p-6 max-w-2xl mx-auto bg-card-bg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-tertiary uppercase tracking-wider mb-1.5 block">Nereden</label>
                <select
                  value={fromId}
                  onChange={(e) => setFromId(e.target.value)}
                  className="w-full bg-surface border-none rounded-lg px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Seçin</option>
                  {Object.entries(grouped).map(([group, pts]) => (
                    <optgroup key={group} label={group}>
                      {pts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-tertiary uppercase tracking-wider mb-1.5 block">Nereye</label>
                <select
                  value={toId}
                  onChange={(e) => setToId(e.target.value)}
                  className="w-full bg-surface border-none rounded-lg px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Seçin</option>
                  {Object.entries(grouped).map(([group, pts]) => (
                    <optgroup key={group} label={group}>
                      {pts.filter((p) => p.id !== fromId).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            {result && fromPoint && toPoint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-5 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-surface">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-tertiary">Mesafe</p>
                      <p className="text-lg font-semibold text-text flex items-center gap-1"><Route className="w-4 h-4 text-secondary" />{result.km} km</p>
                    </div>
                    <div className="w-px h-8 bg-border-light" />
                    <div className="text-center">
                      <p className="text-xs text-tertiary">Süre</p>
                      <p className="text-lg font-semibold text-text flex items-center gap-1"><Clock className="w-4 h-4 text-secondary" />~{result.min} dk</p>
                    </div>
                    <div className="w-px h-8 bg-border-light" />
                    <div className="text-center">
                      <p className="text-xs text-tertiary">Fiyat</p>
                      <p className="text-lg font-semibold text-text">{symbol}{convert(result.price)}</p>
                    </div>
                  </div>
                  <button onClick={() => setBooking(true)} className="btn-primary px-5 py-2.5 rounded-full text-sm flex items-center gap-2 shrink-0">
                    Rezervasyon <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </FadeIn>

        {booking && result && fromPoint && toPoint && (
          <BookingModal
            open={booking}
            onClose={() => setBooking(false)}
            from={fromPoint.name}
            to={toPoint.name}
            km={result.km}
            min={result.min}
            price={result.price}
          />
        )}
      </div>
    </section>
  );
}
