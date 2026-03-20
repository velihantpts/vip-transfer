"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, Wifi, ArrowRight } from "lucide-react";
import Image from "next/image";
import { FadeIn, StaggerContainer, StaggerItem } from "./AnimatedSection";
import { useCurrency } from "./CurrencyToggle";
import BookingModal from "./BookingModal";
import type { Dictionary } from "@/dictionaries";

const vehicleImages = [
  "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=250&fit=crop&q=80",
  "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=250&fit=crop&q=80",
  "https://images.unsplash.com/photo-1570733577524-3a047079e80d?w=400&h=250&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop&q=80",
];

export default function Fleet({ dict }: { dict: Dictionary }) {
  const { convert, symbol } = useCurrency();
  const [booking, setBooking] = useState<number | null>(null);

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
          {dict.vehicles.map((vehicle: { name: string; type: string; passengers: string; luggage: string; features: string[]; price: number; popular: boolean }, i: number) => (
            <StaggerItem key={vehicle.name}>
              <motion.div whileHover={{ y: -4 }} className="card p-0 h-full overflow-hidden group cursor-pointer" onClick={() => setBooking(i)}>
                <div className="relative h-40 bg-surface overflow-hidden">
                  <Image src={vehicleImages[i]} alt={vehicle.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 25vw" unoptimized />
                  {vehicle.popular && (
                    <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full">{dict.fleet.popular}</span>
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
                    {vehicle.features.map((f: string) => <span key={f} className="text-[10px] text-tertiary bg-surface rounded-md px-2 py-0.5">{f}</span>)}
                  </div>
                  <div className="pt-3 border-t border-border-light flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-tertiary">{dict.fleet.startingFrom}</p>
                      <p className="text-lg font-semibold text-text">{symbol}{convert(vehicle.price)}</p>
                    </div>
                    <span className="text-primary text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Seç <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {booking !== null && (
        <BookingModal
          open={true}
          onClose={() => setBooking(null)}
          from="Antalya Havalimanı"
          to="Seçilen Rota"
          km={35}
          min={30}
          price={dict.vehicles[booking].price}
        />
      )}
    </section>
  );
}
