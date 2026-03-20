"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Clock, ArrowRight, LocateFixed, Route, Plane } from "lucide-react";
import type { Dictionary } from "@/dictionaries";
import { points, distanceKm, estimateMinutes, calculateCustomPrice, airportRoutes, getPoint } from "@/lib/routes";
import { useCurrency } from "./CurrencyToggle";
import BookingModal from "./BookingModal";

interface HeroProps {
  dict: Dictionary;
  onRouteSelect?: (from: string, to: string) => void;
}

/* ---- Animated Scene: Plane → Family → VIP Car ---- */
function TransferAnimation() {
  return (
    <div className="relative w-full max-w-2xl mx-auto h-28 sm:h-36 overflow-hidden mt-8 mb-4">
      {/* Road line */}
      <div className="absolute bottom-6 left-0 right-0 h-[2px] bg-gray-200 dark:bg-gray-700" />
      <div className="absolute bottom-5 left-0 right-0 flex justify-between px-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="w-4 h-[2px] bg-gray-300 dark:bg-gray-600" />
        ))}
      </div>

      {/* Plane arriving from left */}
      <motion.div
        initial={{ x: -120, y: 0, opacity: 0 }}
        animate={{ x: 60, y: 40, opacity: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
        className="absolute top-0 left-0"
      >
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" className="text-primary">
          <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor"/>
        </svg>
      </motion.div>

      {/* Family appearing */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-end gap-1"
      >
        {/* Adult */}
        <svg width="20" height="36" viewBox="0 0 20 36" className="text-gray-600 dark:text-gray-400">
          <circle cx="10" cy="5" r="4" fill="currentColor" />
          <rect x="6" y="10" width="8" height="12" rx="2" fill="currentColor" />
          <rect x="6" y="22" width="3" height="10" rx="1.5" fill="currentColor" />
          <rect x="11" y="22" width="3" height="10" rx="1.5" fill="currentColor" />
        </svg>
        {/* Adult 2 */}
        <svg width="18" height="33" viewBox="0 0 18 33" className="text-gray-500 dark:text-gray-500">
          <circle cx="9" cy="4.5" r="3.5" fill="currentColor" />
          <rect x="5.5" y="9" width="7" height="11" rx="2" fill="currentColor" />
          <rect x="5.5" y="20" width="3" height="9" rx="1.5" fill="currentColor" />
          <rect x="9.5" y="20" width="3" height="9" rx="1.5" fill="currentColor" />
        </svg>
        {/* Child */}
        <svg width="14" height="26" viewBox="0 0 14 26" className="text-gray-400 dark:text-gray-500">
          <circle cx="7" cy="3.5" r="3" fill="currentColor" />
          <rect x="4" y="7" width="6" height="9" rx="1.5" fill="currentColor" />
          <rect x="4" y="16" width="2.5" height="7" rx="1" fill="currentColor" />
          <rect x="7.5" y="16" width="2.5" height="7" rx="1" fill="currentColor" />
        </svg>
        {/* Luggage */}
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <svg width="12" height="18" viewBox="0 0 12 18" className="text-primary/60 ml-1">
            <rect x="1" y="4" width="10" height="12" rx="2" fill="currentColor" />
            <rect x="4" y="1" width="4" height="4" rx="1" fill="currentColor" />
            <circle cx="3.5" cy="17" r="1" fill="currentColor" />
            <circle cx="8.5" cy="17" r="1" fill="currentColor" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Walking dots animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, delay: 3, repeat: Infinity }}
        className="absolute bottom-10 left-[55%] flex gap-1"
      >
        <div className="w-1 h-1 rounded-full bg-primary/40" />
        <div className="w-1 h-1 rounded-full bg-primary/30" />
        <div className="w-1 h-1 rounded-full bg-primary/20" />
      </motion.div>

      {/* VIP Car waiting on right */}
      <motion.div
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
        className="absolute bottom-4 right-8 sm:right-16"
      >
        <svg width="80" height="40" viewBox="0 0 80 40" className="text-gray-800 dark:text-gray-300">
          {/* Car body */}
          <path d="M12 28 C12 28 16 14 28 12 L52 12 C60 12 66 18 68 28 Z" fill="currentColor" />
          <rect x="8" y="26" width="64" height="8" rx="3" fill="currentColor" />
          {/* Windows */}
          <path d="M20 27 L24 16 L38 16 L38 27 Z" fill="white" opacity="0.3" />
          <path d="M40 27 L40 16 L52 16 C56 16 60 20 62 27 Z" fill="white" opacity="0.3" />
          {/* Wheels */}
          <circle cx="22" cy="34" r="5" fill="currentColor" />
          <circle cx="22" cy="34" r="2.5" fill="white" opacity="0.2" />
          <circle cx="58" cy="34" r="5" fill="currentColor" />
          <circle cx="58" cy="34" r="2.5" fill="white" opacity="0.2" />
          {/* Mercedes star hint */}
          <circle cx="14" cy="28" r="2" fill="currentColor" stroke="white" strokeWidth="0.5" opacity="0.5" />
        </svg>
        {/* VIP badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 3, type: "spring" }}
          className="absolute -top-2 right-2 bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md"
        >
          VIP
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Hero({ dict, onRouteSelect }: HeroProps) {
  const [fromId, setFromId] = useState("airport");
  const [toId, setToId] = useState("");
  const [booking, setBooking] = useState(false);
  const { convert, symbol } = useCurrency();

  const result = useMemo(() => {
    if (!fromId || !toId || fromId === toId) return null;
    const fixed = airportRoutes.find((r) => (r.from === fromId && r.to === toId) || (r.from === toId && r.to === fromId));
    if (fixed) return { km: fixed.km, min: fixed.min, price: fixed.price };
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

  const handleGetPrice = () => {
    if (result) {
      setBooking(true);
    } else if (!toId) {
      onRouteSelect?.(fromId, "");
    }
  };

  const handleQuickRoute = (to: string) => {
    setFromId("airport");
    setToId(to);
    onRouteSelect?.("airport", to);
  };

  const grouped = useMemo(() => {
    const g: Record<string, typeof points> = { "Havalimani": [], "Bolgeler": [], "Oteller": [], "Gezilecek Yerler": [] };
    for (const p of points) {
      if (p.type === "airport") g["Havalimani"].push(p);
      else if (p.type === "district") g["Bolgeler"].push(p);
      else if (p.type === "hotel") g["Oteller"].push(p);
      else g["Gezilecek Yerler"].push(p);
    }
    return g;
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-b from-white via-gray-50/80 to-gray-100/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" id="rezervasyon">
      {/* Subtle decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/[0.03] rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/[0.02] rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-[980px] mx-auto px-6 pt-20 pb-12">
        <div className="text-center mb-6">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary text-sm font-medium mb-4 tracking-wide">
            {dict.hero.badge}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-text leading-[1.08] mb-6">
            {dict.hero.titleLine1} <span className="text-primary">{dict.hero.titleHighlight}</span>
            {dict.hero.titleLine2 && <><br />{dict.hero.titleLine2}</>}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-lg text-secondary max-w-xl mx-auto leading-relaxed">
            {dict.hero.subtitle}
          </motion.p>
        </div>

        {/* Animated transfer scene */}
        <TransferAnimation />

        {/* Booking card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card p-6 max-w-3xl mx-auto shadow-lg shadow-black/[0.03] border border-border-light"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-[11px] text-tertiary uppercase tracking-wider mb-1.5 block">{dict.hero.from}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
                <select value={fromId} onChange={(e) => setFromId(e.target.value)} className="w-full bg-surface border border-border-light rounded-xl pl-9 pr-9 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30">
                  <option value="">{dict.hero.selectLocation}</option>
                  {Object.entries(grouped).map(([group, pts]) => (
                    <optgroup key={group} label={group}>
                      {pts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </optgroup>
                  ))}
                </select>
                <button onClick={handleGeolocation} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-tertiary hover:text-primary hover:bg-primary/5 transition-all" title="Konumumu kullan">
                  <LocateFixed className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div>
              <label className="text-[11px] text-tertiary uppercase tracking-wider mb-1.5 block">{dict.hero.to}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
                <select value={toId} onChange={(e) => setToId(e.target.value)} className="w-full bg-surface border border-border-light rounded-xl pl-9 pr-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30">
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
                <input type="date" defaultValue={new Date().toISOString().split("T")[0]} className="w-full bg-surface border border-border-light rounded-xl pl-9 pr-3 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-tertiary uppercase tracking-wider mb-1.5 block">{dict.hero.time}</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
                <input type="time" defaultValue={new Date().toTimeString().slice(0, 5)} className="w-full bg-surface border border-border-light rounded-xl pl-9 pr-3 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="mt-4 p-4 rounded-xl bg-primary text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs text-white/60">
                      <Plane className="w-3.5 h-3.5" />
                      {fromPoint?.name} → {toPoint?.name}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-xs text-white/60"><Route className="w-3 h-3" />{result.km} km</span>
                      <span className="flex items-center gap-1 text-xs text-white/60"><Clock className="w-3 h-3" />~{result.min} dk</span>
                    </div>
                    <span className="text-2xl font-bold">{symbol}{convert(result.price)}</span>
                  </div>
                  <button onClick={() => setBooking(true)} className="bg-white text-primary font-semibold text-sm px-6 py-3 rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2 shrink-0">
                    Rezervasyon <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!result && (
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-tertiary flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                {dict.hero.noHiddenFees} · {dict.hero.freeCancel}
              </p>
              <button onClick={handleGetPrice} className="btn-primary px-6 py-3 rounded-full flex items-center gap-2 text-sm font-medium">
                {toId ? dict.hero.getPrice : "Rotalari Gor"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Quick routes */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-wrap justify-center gap-2 mt-6 max-w-3xl mx-auto">
          {[
            { to: "belek", label: "Belek" },
            { to: "kaleici", label: "Kaleici" },
            { to: "kemer", label: "Kemer" },
            { to: "side", label: "Side" },
            { to: "alanya", label: "Alanya" },
            { to: "lara", label: "Lara" },
          ].map((r) => (
            <button
              key={r.to}
              onClick={() => handleQuickRoute(r.to)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                toId === r.to && fromId === "airport"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border-light text-secondary hover:border-border hover:text-text"
              }`}
            >
              Havalimani → {r.label}
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
