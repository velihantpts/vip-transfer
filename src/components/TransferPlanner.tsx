"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight, Route, Plane, MapPin, Repeat } from "lucide-react";
import { FadeIn } from "./AnimatedSection";
import { useCurrency } from "./CurrencyToggle";
import BookingModal from "./BookingModal";
import { points, distanceKm, estimateMinutes, calculateCustomPrice, airportRoutes } from "@/lib/routes";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-surface animate-pulse rounded-2xl" />,
});

import type { Location } from "./MapSection";
import { airport, destinations } from "./MapSection";

// All points as locations for flexible origin
const allLocations: Location[] = points.map((p) => ({
  id: p.id,
  name: p.name,
  lat: p.lat,
  lng: p.lng,
}));

export default function TransferPlanner() {
  const [originId, setOriginId] = useState("airport");
  const [selectedDestId, setSelectedDestId] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const { convert, symbol } = useCurrency();

  const origin = allLocations.find((l) => l.id === originId) || airport;

  // Calculate destinations with prices from current origin
  const dynamicDestinations = useMemo(() => {
    return allLocations
      .filter((l) => l.id !== originId)
      .map((dest) => {
        const originPt = points.find((p) => p.id === originId);
        const destPt = points.find((p) => p.id === dest.id);
        if (!originPt || !destPt) return null;

        // Check fixed route first
        const fixed = airportRoutes.find((r) =>
          (r.from === originId && r.to === dest.id) || (r.from === dest.id && r.to === originId)
        );

        const km = fixed ? fixed.km : distanceKm(originPt, destPt);
        const min = fixed ? fixed.min : estimateMinutes(km);
        const price = fixed ? fixed.price : calculateCustomPrice(km);

        return { ...dest, km, min, price };
      })
      .filter(Boolean)
      .sort((a, b) => a!.km - b!.km) as (Location & { km: number; min: number; price: number })[];
  }, [originId]);

  const selectedDest = dynamicDestinations.find((d) => d.id === selectedDestId);

  // For MapView we need origin as airport-like location
  const mapOrigin: Location = origin;
  const mapDests: Location[] = dynamicDestinations.map((d) => ({
    id: d.id, name: d.name, lat: d.lat, lng: d.lng, km: d.km, min: d.min, price: d.price,
  }));

  const grouped = useMemo(() => {
    const g: Record<string, typeof allLocations> = {};
    for (const p of points) {
      if (p.id === originId) continue;
      const label = p.type === "airport" ? "Havalimanı" : p.type === "district" ? "Bölgeler" : p.type === "hotel" ? "Oteller" : "Gezilecek Yerler";
      if (!g[label]) g[label] = [];
      g[label].push(p);
    }
    return g;
  }, [originId]);

  return (
    <section id="rotalar" className="py-24">
      <div className="max-w-[1080px] mx-auto px-6">
        <FadeIn className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-semibold text-text tracking-tight">
            Transfer <span className="text-secondary">Planlayıcı</span>
          </h2>
          <p className="text-secondary mt-3 text-sm">Başlangıç noktanızı seçin, haritadan destinasyon belirleyin.</p>
        </FadeIn>

        {/* Origin selector */}
        <FadeIn delay={0.1} className="max-w-md mx-auto mb-8">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-tertiary uppercase tracking-wider mb-1 block">Başlangıç Noktası</label>
              <select
                value={originId}
                onChange={(e) => { setOriginId(e.target.value); setSelectedDestId(null); }}
                className="w-full bg-card-bg border border-card-border rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {Object.entries(
                  points.reduce((acc, p) => {
                    const label = p.type === "airport" ? "Havalimanı" : p.type === "district" ? "Bölgeler" : p.type === "hotel" ? "Oteller" : "Gezilecek Yerler";
                    if (!acc[label]) acc[label] = [];
                    acc[label].push(p);
                    return acc;
                  }, {} as Record<string, typeof points>)
                ).map(([group, pts]) => (
                  <optgroup key={group} label={group}>
                    {pts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Map */}
          <div className="lg:col-span-3 card overflow-hidden relative" style={{ height: 520 }}>
            <MapView
              airport={mapOrigin}
              destinations={mapDests}
              selected={selectedDestId}
              onSelect={(id) => setSelectedDestId(id === selectedDestId ? null : id)}
            />

            <AnimatePresence>
              {selectedDest && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-4 left-4 right-4 bg-card-bg/95 backdrop-blur-lg rounded-2xl p-4 border border-card-border shadow-lg"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] text-secondary mb-1">
                        <MapPin className="w-3 h-3" />
                        {origin.name} → {selectedDest.name}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-semibold text-text">{symbol}{convert(selectedDest.price)}</span>
                        <div className="flex items-center gap-2 text-[11px] text-tertiary">
                          <span className="flex items-center gap-0.5"><Route className="w-3 h-3" />{selectedDest.km} km</span>
                          <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{selectedDest.min} dk</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setBooking(true)} className="btn-primary px-5 py-2.5 rounded-full text-xs flex items-center gap-1.5 shrink-0">
                      Rezervasyon <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Route list */}
          <div className="lg:col-span-2 space-y-1 max-h-[520px] overflow-y-auto pr-1">
            <p className="text-[10px] text-tertiary uppercase tracking-wider px-1 mb-2">{origin.name} → </p>
            {dynamicDestinations.slice(0, 12).map((loc, i) => (
              <motion.button
                key={loc.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedDestId(loc.id === selectedDestId ? null : loc.id)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                  selectedDestId === loc.id ? "bg-inverse text-inverse-text shadow-lg" : "hover:bg-surface"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      selectedDestId === loc.id ? "bg-inverse-text/20 text-inverse-text" : "bg-surface text-secondary"
                    }`}>
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${selectedDestId === loc.id ? "text-inverse-text" : "text-text"}`}>{loc.name}</p>
                      <div className={`flex items-center gap-3 text-[11px] mt-0.5 ${selectedDestId === loc.id ? "text-inverse-text/50" : "text-tertiary"}`}>
                        <span>{loc.km} km</span>
                        <span>{loc.min} dk</span>
                      </div>
                    </div>
                  </div>
                  <p className={`font-semibold text-sm ${selectedDestId === loc.id ? "text-inverse-text" : "text-text"}`}>{symbol}{convert(loc.price)}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {booking && selectedDest && (
        <BookingModal open={booking} onClose={() => setBooking(false)} from={origin.name} to={selectedDest.name} km={selectedDest.km} min={selectedDest.min} price={selectedDest.price} />
      )}
    </section>
  );
}
