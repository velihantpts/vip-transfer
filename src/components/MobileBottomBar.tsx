"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "./CurrencyToggle";
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
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ duration: 0.25 }} className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-card-bg/90 backdrop-blur-xl border-t border-border-light px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] text-tertiary">{dict.mobile.startingFrom}</p>
              <p className="text-base font-semibold text-text">{symbol}{convert(550)}</p>
            </div>
            <a href="#rezervasyon" className="btn-primary px-5 py-2.5 rounded-full text-sm">{dict.mobile.bookNow}</a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
