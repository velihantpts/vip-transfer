"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight, Route, Plane } from "lucide-react";
import { FadeIn } from "./AnimatedSection";
import { useCurrency } from "./CurrencyToggle";
import BookingModal from "./BookingModal";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-surface animate-pulse rounded-2xl" />,
});

export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  km?: number;
  min?: number;
  price?: number;
}

export const airport: Location = {
  id: "airport",
  name: "Antalya Havalimanı",
  lat: 36.8987,
  lng: 30.8005,
};

export const destinations: Location[] = [
  { id: "lara", name: "Lara", lat: 36.8545, lng: 30.7645, km: 12, min: 15, price: 550 },
  { id: "kaleici", name: "Kaleiçi", lat: 36.8841, lng: 30.7056, km: 15, min: 20, price: 650 },
  { id: "kundu", name: "Kundu", lat: 36.8450, lng: 30.7800, km: 18, min: 20, price: 650 },
  { id: "belek", name: "Belek", lat: 36.8597, lng: 31.0569, km: 35, min: 30, price: 850 },
  { id: "kemer", name: "Kemer", lat: 36.5980, lng: 30.5594, km: 60, min: 50, price: 1100 },
  { id: "side", name: "Side", lat: 36.7673, lng: 31.3886, km: 75, min: 60, price: 1300 },
  { id: "alanya", name: "Alanya", lat: 36.5441, lng: 31.9956, km: 130, min: 90, price: 1800 },
  { id: "kas", name: "Kaş", lat: 36.1996, lng: 29.6354, km: 190, min: 150, price: 2500 },
];

export default function MapSection() {
  const [selected, setSelected] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const { convert, symbol } = useCurrency();
  const selectedDest = destinations.find((d) => d.id === selected);

  return (
    <section id="rotalar" className="py-24">
      <div className="max-w-[980px] mx-auto px-6">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-text tracking-tight">
            Transfer <span className="text-secondary">Rotaları</span>
          </h2>
          <p className="text-secondary mt-3 text-sm">Bir destinasyon seçin, rotayı ve fiyatı görün.</p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Map — 3 cols */}
          <div className="lg:col-span-3 card overflow-hidden relative" style={{ height: 520 }}>
            <MapView
              airport={airport}
              destinations={destinations}
              selected={selected}
              onSelect={(id) => setSelected(id === selected ? null : id)}
            />

            {/* Selected route info overlay */}
            <AnimatePresence>
              {selectedDest && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-4 left-4 right-4 bg-card-bg/90 backdrop-blur-lg rounded-xl p-4 border border-border-light shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-secondary mb-1">
                        <Plane className="w-3 h-3" />
                        Havalimanı → {selectedDest.name}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-text">{symbol}{convert(selectedDest.price!)}</span>
                        <span className="text-xs text-tertiary">{selectedDest.km} km · ~{selectedDest.min} dk</span>
                      </div>
                    </div>
                    <button onClick={() => setBooking(true)} className="btn-primary px-4 py-2 rounded-full text-xs flex items-center gap-1.5">
                      Rezervasyon <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Route list — 2 cols */}
          <div className="lg:col-span-2 space-y-1.5 max-h-[520px] overflow-y-auto">
            {destinations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelected(loc.id === selected ? null : loc.id)}
                className={`w-full text-left px-4 py-3.5 rounded-xl transition-all ${
                  selected === loc.id
                    ? "bg-inverse text-inverse-text"
                    : "hover:bg-surface"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium text-sm ${selected === loc.id ? "text-inverse-text" : "text-text"}`}>{loc.name}</p>
                    <div className={`flex items-center gap-3 text-xs mt-0.5 ${selected === loc.id ? "text-inverse-text/50" : "text-tertiary"}`}>
                      <span className="flex items-center gap-1"><Route className="w-3 h-3" />{loc.km} km</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{loc.min} dk</span>
                    </div>
                  </div>
                  <p className={`font-semibold ${selected === loc.id ? "text-inverse-text" : "text-text"}`}>
                    {symbol}{convert(loc.price!)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {booking && selectedDest && (
        <BookingModal
          open={booking}
          onClose={() => setBooking(false)}
          from={airport.name}
          to={selectedDest.name}
          km={selectedDest.km!}
          min={selectedDest.min!}
          price={selectedDest.price!}
        />
      )}
    </section>
  );
}
