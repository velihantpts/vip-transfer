"use client";

import { useState, createContext, useContext, ReactNode } from "react";

type Currency = "TRY" | "EUR" | "USD" | "GBP";

const rates: Record<Currency, number> = { TRY: 1, EUR: 0.028, USD: 0.031, GBP: 0.024 };
const symbols: Record<Currency, string> = { TRY: "₺", EUR: "€", USD: "$", GBP: "£" };

const CurrencyCtx = createContext<{
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convert: (tryAmount: number) => string;
  symbol: string;
}>({ currency: "TRY", setCurrency: () => {}, convert: (v) => v.toString(), symbol: "₺" });

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("TRY");
  const convert = (tryAmount: number) => {
    if (currency === "TRY") return tryAmount.toLocaleString();
    return Math.round(tryAmount * rates[currency]).toLocaleString();
  };
  return <CurrencyCtx.Provider value={{ currency, setCurrency, convert, symbol: symbols[currency] }}>{children}</CurrencyCtx.Provider>;
}

export function useCurrency() { return useContext(CurrencyCtx); }

const currencies: Currency[] = ["TRY", "EUR", "USD", "GBP"];

export default function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();
  return (
    <div className="flex items-center gap-0.5 text-xs">
      {currencies.map((c) => (
        <button key={c} onClick={() => setCurrency(c)} className={`px-2 py-1 rounded-md transition-colors ${currency === c ? "text-text font-medium" : "text-tertiary hover:text-secondary"}`}>
          {symbols[c]}
        </button>
      ))}
    </div>
  );
}
