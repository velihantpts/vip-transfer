"use client";

import { motion } from "framer-motion";

const logos = [
  { name: "Google", rating: "4.9", reviews: "850+" },
  { name: "Tripadvisor", rating: "4.8", reviews: "420+" },
  { name: "Booking.com", rating: "9.4", reviews: "310+" },
];

export default function SocialProof() {
  return (
    <section className="py-6 border-y border-border-light bg-card-bg">
      <div className="max-w-[980px] mx-auto px-6">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {logos.map((l) => (
            <div key={l.name} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center">
                <span className="text-[10px] font-bold text-secondary">{l.name[0]}</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-text">{l.rating}</span>
                  <span className="text-amber-400 text-xs">★</span>
                </div>
                <p className="text-[10px] text-tertiary">{l.reviews} yorum</p>
              </div>
            </div>
          ))}
          <div className="hidden sm:block text-[10px] text-tertiary border-l border-border-light pl-8">
            2.500+ tamamlanan transfer
          </div>
        </motion.div>
      </div>
    </section>
  );
}
