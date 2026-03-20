"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Clock, ArrowRight, LocateFixed, Route, Plane } from "lucide-react";
import type { Dictionary } from "@/dictionaries";
import { points, distanceKm, estimateMinutes, calculateCustomPrice, airportRoutes, getPoint } from "@/lib/routes";
import { useCurrency } from "./CurrencyToggle";
import BookingModal from "./BookingModal";

export default function Hero({ dict }: { dict: Dictionary }) {
  const [fromId, setFromId] = useState("airport");
  const [toId, setToId] = useState("");
  const [booking, setBooking] = useState(false);
  const { convert, symbol } = useCurrency();

  // Calculate price from selection
  const result = useMemo(() => {
    if (!fromId || !toId || fromId === toId) return null;
    // Check fixed routes first
    const fixed = airportRoutes.find((r) => (r.from === fromId && r.to === toId) || (r.from === toId && r.to === fromId));
    if (fixed) return { km: fixed.km, min: fixed.min, price: fixed.price };
    // Calculate custom
    const a = getPoint(fromId);
    const b = getPoint(toId);
    if (!a || !b) return null;
    const km = distanceKm(a, b);
    const min = estimateMinutes(km);
    const price = calculateCustomPrice(km);
    return { km, min, price };
  }, [fromId, toId]);

  const fromPoint = points.find((p) => p.id === fromId);
  const toPoint = points.find((p) => p.id === toId);

  const handleGeolocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let closest = points[0];
        let minDist = Infinity;
        for (const p of points) {
          const d = Math.sqrt((latitude - p.lat) ** 2 + (longitude - p.lng) ** 2);
          if (d < minDist) { minDist = d; closest = p; }
        }
        setFromId(closest.id);
      },
      () => setFromId("airport")
    );
  };

  const grouped = useMemo(() => {
    const g: Record<string, typeof points> = { "Havalimanı": [], "Bölgeler": [], "Oteller": [], "Gezilecek Yerler": [] };
    for (const p of points) {
      if (p.type === "airport") g["Havalimanı"].push(p);
      else if (p.type === "district") g["Bölgeler"].push(p);
      else if (p.type === "hotel") g["Oteller"].push(p);
      else g["Gezilecek Yerler"].push(p);
    }
    return g;
  }, []);

  return (
    <section className="pt-20 pb-12 sm:pt-28 sm:pb-20" id="rezervasyon">
      <div className="max-w-[980px] mx-auto px-6">
        <div className="text-center mb-12">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary text-sm font-medium mb-4">
            {dict.hero.badge}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-text leading-[1.08] mb-6">
            {dict.hero.titleLine1} <span className="text-secondary">{dict.hero.titleHighlight}</span>
            {dict.hero.titleLine2 && <><br />{dict.hero.titleLine2}</>}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-lg text-secondary max-w-xl mx-auto leading-relaxed">
            {dict.hero.subtitle}
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="card p-6 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {/* From */}
            <div>
              <label className="text-[11px] text-tertiary uppercase tracking-wider mb-1.5 block">{dict.hero.from}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
                <select value={fromId} onChange={(e) => setFromId(e.target.value)} className="w-full bg-surface border-none rounded-lg pl-9 pr-9 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">{dict.hero.selectLocation}</option>
                  {Object.entries(grouped).map(([group, pts]) => (
                    <optgroup key={group} label={group}>
                      {pts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </optgroup>
                  ))}
                </select>
                <button onClick={handleGeolocation} className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md flex items-center justify-center text-tertiary hover:text-primary transition-colors" title="Konumumu kullan">
                  <LocateFixed className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            {/* To */}
            <div>
              <label className="text-[11px] text-tertiary uppercase tracking-wider mb-1.5 block">{dict.hero.to}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
                <select value={toId} onChange={(e) => setToId(e.target.value)} className="w-full bg-surface border-none rounded-lg pl-9 pr-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">{dict.hero.selectLocation}</option>
                  {Object.entries(grouped).map(([group, pts]) => (
                    <optgroup key={group} label={group}>
                      {pts.filter((p) => p.id !== fromId).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-tertiary uppercase tracking-wider mb-1.5 block">{dict.hero.date}</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
                <input type="date" defaultValue={new Date().toISOString().split("T")[0]} className="w-full bg-surface border-none rounded-lg pl-9 pr-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-tertiary uppercase tracking-wider mb-1.5 block">{dict.hero.time}</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
                <input type="time" defaultValue={new Date().toTimeString().slice(0, 5)} className="w-full bg-surface border-none rounded-lg pl-9 pr-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
          </div>

          {/* Instant price result */}
          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="mt-4 p-4 rounded-xl bg-inverse text-inverse-text flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-1.5 text-xs text-inverse-text/50">
                      <Plane className="w-3.5 h-3.5" />
                      {fromPoint?.name} → {toPoint?.name}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-xs text-inverse-text/50"><Route className="w-3 h-3" />{result.km} km</span>
                      <span className="flex items-center gap-1 text-xs text-inverse-text/50"><Clock className="w-3 h-3" />~{result.min} dk</span>
                    </div>
                    <span className="text-xl font-semibold">{symbol}{convert(result.price)}</span>
                  </div>
                  <button onClick={() => setBooking(true)} className="bg-base text-text font-medium text-sm px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0">
                    Rezervasyon <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!result && (
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-tertiary flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald inline-block" />
                {dict.hero.noHiddenFees} · {dict.hero.freeCancel}
              </p>
              <div className="relative group">
                <button disabled className="btn-primary px-6 py-2.5 rounded-full flex items-center gap-2 opacity-40 cursor-not-allowed text-sm" aria-label="Fiyat almak için nereden ve nereye seçin">
                  {dict.hero.getPrice} <ArrowRight className="w-4 h-4" />
                </button>
                <span className="absolute bottom-full mb-2 right-0 bg-inverse text-inverse-text text-[10px] px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Nereden ve nereye seçin
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Popular route shortcuts */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-wrap justify-center gap-2 mt-6 max-w-3xl mx-auto">
          {[
            { to: "belek", label: "Belek" },
            { to: "kaleici", label: "Kaleiçi" },
            { to: "kemer", label: "Kemer" },
            { to: "side", label: "Side" },
            { to: "alanya", label: "Alanya" },
            { to: "lara", label: "Lara" },
          ].map((r) => (
            <button
              key={r.to}
              onClick={() => { setFromId("airport"); setToId(r.to); }}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                toId === r.to && fromId === "airport"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border-light text-secondary hover:border-border hover:text-text"
              }`}
            >
              Havalimanı → {r.label}
            </button>
          ))}
        </motion.div>
      </div>

      {booking && result && fromPoint && toPoint && (
        <BookingModal open={booking} onClose={() => setBooking(false)} from={fromPoint.name} to={toPoint.name} km={result.km} min={result.min} price={result.price} />
      )}
    </section>
  );
}
