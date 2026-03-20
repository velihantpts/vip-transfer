"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Briefcase, Wifi, ArrowRight, X, ChevronLeft, ChevronRight, Shield, Snowflake, Zap, Music, Coffee, Tv, Star } from "lucide-react";
import Image from "next/image";
import { FadeIn, StaggerContainer, StaggerItem } from "./AnimatedSection";
import { useCurrency } from "./CurrencyToggle";
import BookingModal from "./BookingModal";
import type { Dictionary } from "@/dictionaries";

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  passengers: string;
  luggage: string;
  features: string[];
  specs: string[];
  price: number;
  multiplier: number;
  popular: boolean;
  images: string[];
  sort_order: number;
  active: boolean;
}

// Fallback vehicles if Supabase not ready
const fallbackVehicles: Vehicle[] = [
  {
    id: "1", name: "Mercedes V-Class", type: "VIP Minivan", passengers: "1-7", luggage: "7",
    features: ["Wi-Fi", "Klima", "USB Sarj", "Su & Icecek"],
    specs: ["Deri koltuklar", "Elektrikli kapak surusu", "Ortam aydinlatma", "Buzdolabi", "Sessiz kabin"],
    price: 850, multiplier: 1.3, popular: true, sort_order: 1, active: true,
    images: [
      "https://images.unsplash.com/photo-1632245889029-e406faaa34cd?w=800&h=500&fit=crop&q=85",
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&h=500&fit=crop&q=85",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=500&fit=crop&q=85",
    ],
  },
  {
    id: "2", name: "Mercedes S-Class", type: "Luks Sedan", passengers: "1-3", luggage: "3",
    features: ["Wi-Fi", "Deri Koltuk", "Klima", "Minibar"],
    specs: ["Masaj koltuklar", "Panoramik tavan", "Burmester ses sistemi", "Arka eglence ekrani", "Hava suspansiyonu"],
    price: 1200, multiplier: 1.8, popular: false, sort_order: 2, active: true,
    images: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=500&fit=crop&q=85",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=500&fit=crop&q=85",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=500&fit=crop&q=85",
    ],
  },
  {
    id: "3", name: "Mercedes Sprinter VIP", type: "VIP Minibus", passengers: "1-12", luggage: "12",
    features: ["Wi-Fi", "TV", "Klima", "Buzdolabi"],
    specs: ["VIP oturma duzeni", "42\" LED TV", "Mikrofon sistemi", "USB sarj her koltukta", "Buyuk bagaj alani"],
    price: 1500, multiplier: 2.2, popular: false, sort_order: 3, active: true,
    images: [
      "https://images.unsplash.com/photo-1570733577524-3a047079e80d?w=800&h=500&fit=crop&q=85",
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=500&fit=crop&q=85",
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=500&fit=crop&q=85",
    ],
  },
  {
    id: "4", name: "Mercedes E-Class", type: "Business Sedan", passengers: "1-3", luggage: "3",
    features: ["Wi-Fi", "Klima", "USB Sarj", "Su"],
    specs: ["Deri koltuklar", "Otonom suruş desteği", "Ambient aydinlatma", "Kablosuz sarj", "Premium ses sistemi"],
    price: 650, multiplier: 1.0, popular: false, sort_order: 4, active: true,
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=500&fit=crop&q=85",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=500&fit=crop&q=85",
      "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&h=500&fit=crop&q=85",
    ],
  },
];

const featureIcons: Record<string, React.ReactNode> = {
  "Wi-Fi": <Wifi className="w-3.5 h-3.5" />,
  "Klima": <Snowflake className="w-3.5 h-3.5" />,
  "USB Sarj": <Zap className="w-3.5 h-3.5" />,
  "Deri Koltuk": <Star className="w-3.5 h-3.5" />,
  "Minibar": <Coffee className="w-3.5 h-3.5" />,
  "TV": <Tv className="w-3.5 h-3.5" />,
  "Buzdolabi": <Coffee className="w-3.5 h-3.5" />,
  "Su": <Coffee className="w-3.5 h-3.5" />,
  "Su & Icecek": <Coffee className="w-3.5 h-3.5" />,
};

function VehicleDetailModal({ vehicle, onClose, onBook, symbol, convert }: {
  vehicle: Vehicle;
  onClose: () => void;
  onBook: () => void;
  symbol: string;
  convert: (n: number) => number | string;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const images = vehicle.images?.length ? vehicle.images : fallbackVehicles[0].images;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Gallery */}
        <div className="relative h-64 sm:h-80 bg-gray-100 rounded-t-2xl overflow-hidden">
          <Image
            src={images[imgIdx]}
            alt={vehicle.name}
            fill
            className="object-cover transition-all duration-500"
            sizes="(max-width: 768px) 100vw, 672px"
            unoptimized
          />

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setImgIdx((prev) => (prev - 1 + images.length) % images.length); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setImgIdx((prev) => (prev + 1) % images.length); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? "bg-white w-5" : "bg-white/50"}`}
                />
              ))}
            </div>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 flex gap-1.5">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                  className={`w-12 h-8 rounded-md overflow-hidden border-2 transition-all ${i === imgIdx ? "border-white" : "border-transparent opacity-60"}`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="48px" unoptimized />
                </button>
              ))}
            </div>
          )}

          {/* Close */}
          <button onClick={onClose} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition-colors">
            <X className="w-5 h-5" />
          </button>

          {vehicle.popular && (
            <span className="absolute top-3 left-3 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">Populer</span>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{vehicle.name}</h3>
              <p className="text-sm text-gray-500">{vehicle.type}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase">Baslangic</p>
              <p className="text-2xl font-bold text-gray-900">{symbol}{convert(vehicle.price)}</p>
            </div>
          </div>

          {/* Capacity */}
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-gray-500" />
              </div>
              <div><p className="text-xs text-gray-400">Yolcu</p><p className="font-medium">{vehicle.passengers}</p></div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-gray-500" />
              </div>
              <div><p className="text-xs text-gray-400">Bavul</p><p className="font-medium">{vehicle.luggage}</p></div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Shield className="w-4 h-4 text-gray-500" />
              </div>
              <div><p className="text-xs text-gray-400">Sigorta</p><p className="font-medium">Tam</p></div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Ozellikler</h4>
            <div className="flex flex-wrap gap-2">
              {vehicle.features.map((f) => (
                <span key={f} className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100">
                  {featureIcons[f] || <Star className="w-3.5 h-3.5" />}
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Specs */}
          {vehicle.specs?.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Arac Detaylari</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {vehicle.specs.map((s) => (
                  <div key={s} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={onBook}
            className="w-full bg-gray-900 text-white py-3.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            Bu Aracla Rezervasyon Yap <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Fleet({ dict }: { dict: Dictionary }) {
  const { convert, symbol } = useCurrency();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [detailVehicle, setDetailVehicle] = useState<Vehicle | null>(null);
  const [bookingVehicle, setBookingVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    fetch("/api/vehicles")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data && data.length > 0) {
          setVehicles(data);
        } else {
          setVehicles(fallbackVehicles);
        }
      })
      .catch(() => setVehicles(fallbackVehicles));
  }, []);

  if (vehicles.length === 0) return null;

  return (
    <section id="araclar" className="py-24 bg-surface">
      <div className="max-w-[980px] mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-text tracking-tight">
            {dict.fleet.title} <span className="text-secondary">{dict.fleet.titleHighlight}</span>
          </h2>
          <p className="text-secondary mt-3 max-w-lg mx-auto text-sm">{dict.fleet.subtitle}</p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {vehicles.map((vehicle) => (
            <StaggerItem key={vehicle.id}>
              <motion.div
                whileHover={{ y: -4 }}
                className="card p-0 h-full overflow-hidden group cursor-pointer"
                onClick={() => setDetailVehicle(vehicle)}
              >
                <div className="relative h-44 bg-surface overflow-hidden">
                  <Image
                    src={vehicle.images?.[0] || fallbackVehicles[0].images[0]}
                    alt={vehicle.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 25vw"
                    unoptimized
                  />
                  {vehicle.popular && (
                    <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full">{dict.fleet.popular}</span>
                  )}
                  {/* Image count badge */}
                  {vehicle.images?.length > 1 && (
                    <span className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full">
                      {vehicle.images.length} foto
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-text">{vehicle.name}</h3>
                  <p className="text-xs text-secondary mb-3">{vehicle.type}</p>
                  <div className="flex items-center gap-3 mb-3 text-xs text-secondary">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {vehicle.passengers}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {vehicle.luggage}</span>
                    <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /></span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {vehicle.features.slice(0, 4).map((f: string) => <span key={f} className="text-[10px] text-tertiary bg-surface rounded-md px-2 py-0.5">{f}</span>)}
                  </div>
                  <div className="pt-3 border-t border-border-light flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-tertiary">{dict.fleet.startingFrom}</p>
                      <p className="text-lg font-semibold text-text">{symbol}{convert(vehicle.price)}</p>
                    </div>
                    <span className="text-primary text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Detay <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* Vehicle Detail Modal */}
      <AnimatePresence>
        {detailVehicle && (
          <VehicleDetailModal
            vehicle={detailVehicle}
            onClose={() => setDetailVehicle(null)}
            onBook={() => { setBookingVehicle(detailVehicle); setDetailVehicle(null); }}
            symbol={symbol}
            convert={convert}
          />
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      {bookingVehicle && (
        <BookingModal
          open={true}
          onClose={() => setBookingVehicle(null)}
          from="Antalya Havalimani"
          to="Secilen Rota"
          km={35}
          min={30}
          price={bookingVehicle.price}
        />
      )}
    </section>
  );
}
