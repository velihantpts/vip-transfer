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
    <section className="relative min-h-[90vh] flex items-center" id="rezervasyon">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=1920&h=1080&fit=crop&q=80')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/90 via-[#0a1628]/75 to-[#0a1628]/95" />
      </div>

      <div className="relative z-10 w-full max-w-[980px] mx-auto px-6 py-28">
        <div className="text-center mb-12">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary text-sm font-medium mb-4 tracking-wide">
            {dict.hero.badge}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.08] mb-6">
            {dict.hero.titleLine1} <span className="text-primary">{dict.hero.titleHighlight}</span>
            {dict.hero.titleLine2 && <><br />{dict.hero.titleLine2}</>}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
            {dict.hero.subtitle}
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-white rounded-2xl p-6 max-w-3xl mx-auto shadow-2xl shadow-black/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-[11px] text-gray-400 uppercase tracking-wider mb-1.5 block">{dict.hero.from}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <select value={fromId} onChange={(e) => setFromId(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-9 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30">
                  <option value="">{dict.hero.selectLocation}</option>
                  {Object.entries(grouped).map(([group, pts]) => (
                    <optgroup key={group} label={group}>
                      {pts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </optgroup>
                  ))}
                </select>
                <button onClick={handleGeolocation} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-primary hover:bg-primary/5 transition-all" title="Konumumu kullan">
                  <LocateFixed className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div>
              <label className="text-[11px] text-gray-400 uppercase tracking-wider mb-1.5 block">{dict.hero.to}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <select value={toId} onChange={(e) => setToId(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30">
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
              <label className="text-[11px] text-gray-400 uppercase tracking-wider mb-1.5 block">{dict.hero.date}</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input type="date" defaultValue={new Date().toISOString().split("T")[0]} className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-3 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-gray-400 uppercase tracking-wider mb-1.5 block">{dict.hero.time}</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input type="time" defaultValue={new Date().toTimeString().slice(0, 5)} className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-3 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20" />
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
              <p className="text-xs text-gray-400 flex items-center gap-2">
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
                  ? "border-primary bg-primary/20 text-white"
                  : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
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
