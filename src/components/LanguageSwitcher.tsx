"use client";

import { useState, useRef, useEffect } from "react";
import type { Locale } from "@/dictionaries";

const langs: { code: Locale; label: string }[] = [
  { code: "tr", label: "TR" },
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "ru", label: "RU" },
];

export default function LanguageSwitcher({ current }: { current: Locale }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentLang = langs.find((l) => l.code === current) || langs[0];

  function switchLang(code: Locale) {
    const segments = window.location.pathname.split("/");
    segments[1] = code;
    window.location.href = segments.join("/");
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="text-xs text-secondary hover:text-text transition-colors">
        {currentLang.label}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 bg-card-bg border border-card-border rounded-xl shadow-lg py-1 min-w-[80px] z-50">
          {langs.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { switchLang(lang.code); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-xs transition-colors ${lang.code === current ? "text-primary font-medium" : "text-secondary hover:text-text"}`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
