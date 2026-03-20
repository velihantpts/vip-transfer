"use client";

import { useState } from "react";
import { airportRoutes } from "@/lib/routes";
import { seasonMultipliers, vehicleMultipliers } from "@/lib/mock-data";

export default function PricingTab() {
  const [prices, setPrices] = useState(airportRoutes.map((r) => ({ ...r })));
  const [seasons, setSeasons] = useState(seasonMultipliers.map((s) => ({ ...s })));
  const [vehicles, setVehicles] = useState(vehicleMultipliers.map((v) => ({ ...v })));
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const savePrice = (slug: string) => {
    const val = parseInt(editValue);
    if (isNaN(val)) return;
    setPrices((prev) => prev.map((p) => p.slug === slug ? { ...p, price: val } : p));
    setEditing(null);
  };

  return (
    <>
      <h2 className="text-lg font-semibold text-text mb-5">Fiyatlandırma</h2>

      {/* Route prices */}
      <div className="bg-card-bg border border-border-light rounded-xl overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-border-light"><h3 className="text-xs font-semibold text-text">Havalimanı Rotaları</h3></div>
        <table className="w-full text-xs">
          <thead><tr className="border-b border-border-light bg-surface/50">
            <th className="text-left px-4 py-2 text-secondary font-medium">Rota</th>
            <th className="text-center px-4 py-2 text-secondary font-medium">Mesafe</th>
            <th className="text-center px-4 py-2 text-secondary font-medium">Süre</th>
            <th className="text-right px-4 py-2 text-secondary font-medium">Fiyat (₺)</th>
          </tr></thead>
          <tbody>
            {prices.map((r) => (
              <tr key={r.slug} className="border-b border-border-light last:border-0 hover:bg-surface/30">
                <td className="px-4 py-2.5 text-text">{r.slug.replace(/antalya-havalimani-|-transfer/g, "").replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase())}</td>
                <td className="px-4 py-2.5 text-center text-secondary">{r.km} km</td>
                <td className="px-4 py-2.5 text-center text-secondary">{r.min} dk</td>
                <td className="px-4 py-2.5 text-right">
                  {editing === r.slug ? (
                    <input autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => savePrice(r.slug)} onKeyDown={(e) => e.key === "Enter" && savePrice(r.slug)} className="w-20 text-right bg-surface rounded px-2 py-1 text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  ) : (
                    <button onClick={() => { setEditing(r.slug); setEditValue(String(r.price)); }} className="font-medium text-text hover:text-primary transition-colors">₺{r.price.toLocaleString()}</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Season multipliers */}
        <div className="bg-card-bg border border-border-light rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border-light"><h3 className="text-xs font-semibold text-text">Sezon Çarpanları</h3></div>
          <div className="p-4 space-y-2">
            {seasons.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div><p className="text-text font-medium">{s.name}</p><p className="text-tertiary">{s.months}</p></div>
                <input value={s.multiplier} onChange={(e) => { const v = parseFloat(e.target.value) || 1; setSeasons((prev) => prev.map((x, j) => j === i ? { ...x, multiplier: v } : x)); }} className="w-16 text-center bg-surface rounded px-2 py-1 text-text text-xs border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle multipliers */}
        <div className="bg-card-bg border border-border-light rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border-light"><h3 className="text-xs font-semibold text-text">Araç Çarpanları</h3></div>
          <div className="p-4 space-y-2">
            {vehicles.map((v, i) => (
              <div key={v.vehicle} className="flex items-center justify-between text-xs">
                <span className="text-text">{v.vehicle}</span>
                <input value={v.multiplier} onChange={(e) => { const val = parseFloat(e.target.value) || 1; setVehicles((prev) => prev.map((x, j) => j === i ? { ...x, multiplier: val } : x)); }} className="w-16 text-center bg-surface rounded px-2 py-1 text-text text-xs border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
