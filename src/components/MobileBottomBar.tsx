"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "./CurrencyToggle";
import { MapPin, ArrowRight } from "lucide-react";
import type { Dictionary } from "@/dictionaries";

export default function MobileBottomBar({ dict }: { dict: Dictionary }) {
  const [show, setShow] = useState(false);
  const { convert, symbol } = useCurrency();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ duration: 0.25 }} className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-white/10 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-[10px] text-white/50">{dict.mobile.startingFrom}</p>
                <p className="text-base font-bold text-white">{symbol}{convert(550)}</p>
              </div>
            </div>
            <a href="#rezervasyon" className="bg-amber-400 text-gray-900 font-semibold px-5 py-2.5 rounded-full text-sm flex items-center gap-1.5 hover:bg-amber-300 transition-colors">
              Fiyat Al <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
