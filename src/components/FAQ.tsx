"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { FadeIn } from "./AnimatedSection";
import type { Dictionary } from "@/dictionaries";

function FAQItem({ q, a, isOpen, toggle }: { q: string; a: string; isOpen: boolean; toggle: () => void }) {
  return (
    <div className="border-b border-border-light">
      <button onClick={toggle} className="w-full flex items-center justify-between py-4 text-left">
        <span className="text-sm font-medium text-text pr-4">{q}</span>
        {isOpen ? <Minus className="w-4 h-4 text-secondary shrink-0" /> : <Plus className="w-4 h-4 text-secondary shrink-0" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <p className="text-sm text-secondary pb-4 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ({ dict }: { dict: Dictionary }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="sss" className="py-24">
      <div className="max-w-[680px] mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-text tracking-tight">
            {dict.faq.title} <span className="text-secondary">{dict.faq.titleHighlight}</span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          {dict.faqList.map((faq: { q: string; a: string }, i: number) => (
            <FAQItem key={i} q={faq.q} a={faq.a} isOpen={openIndex === i} toggle={() => setOpenIndex(openIndex === i ? null : i)} />
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
