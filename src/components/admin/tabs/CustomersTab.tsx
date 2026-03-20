"use client";

import { useState } from "react";
import { Search, Star, X, Phone, Mail, FileText } from "lucide-react";
import { mockCustomers, type Customer } from "@/lib/mock-data";

export default function CustomersTab() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState(mockCustomers);

  const filtered = customers.filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));

  const toggleVip = (id: string) => {
    setCustomers((prev) => prev.map((c) => c.id === id ? { ...c, isVip: !c.isVip } : c));
  };

  const updateNote = (id: string, note: string) => {
    setCustomers((prev) => prev.map((c) => c.id === id ? { ...c, note } : c));
  };

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-text">Müşteriler</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-tertiary" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Müşteri ara..." className="bg-card-bg border border-border-light rounded-lg pl-8 pr-3 py-1.5 text-xs text-text w-48 focus:outline-none focus:border-border" />
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((c) => (
          <div key={c.id} onClick={() => setSelected(c)} className="bg-card-bg border border-border-light rounded-xl p-4 cursor-pointer hover:border-border transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${c.isVip ? "bg-amber-100 text-amber-700" : "bg-surface text-secondary"}`}>
                  {c.isVip ? "VIP" : c.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-text">{c.name}</p>
                  <p className="text-xs text-tertiary">{c.phone} · {c.lang.toUpperCase()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-text">{c.totalTrips} trip</p>
                <p className="text-xs text-tertiary">₺{c.totalSpent.toLocaleString()}</p>
              </div>
            </div>
            {c.note && <p className="text-xs text-secondary mt-2 bg-surface rounded-lg px-3 py-1.5">{c.note}</p>}
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card-bg rounded-2xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text">{selected.name}</h3>
              <button onClick={() => setSelected(null)} className="text-tertiary hover:text-text"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2 text-xs mb-4">
              <div className="flex justify-between"><span className="text-secondary">Telefon</span><span className="text-text">{selected.phone}</span></div>
              {selected.email && <div className="flex justify-between"><span className="text-secondary">Email</span><span className="text-text">{selected.email}</span></div>}
              <div className="flex justify-between"><span className="text-secondary">Dil</span><span className="text-text uppercase">{selected.lang}</span></div>
              <div className="flex justify-between"><span className="text-secondary">Toplam Trip</span><span className="text-text">{selected.totalTrips}</span></div>
              <div className="flex justify-between"><span className="text-secondary">Toplam Harcama</span><span className="text-text font-medium">₺{selected.totalSpent.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-secondary">Son Transfer</span><span className="text-text">{selected.lastTrip}</span></div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-secondary">VIP Müşteri</span>
              <button onClick={() => { toggleVip(selected.id); setSelected({ ...selected, isVip: !selected.isVip }); }} className={`text-xs px-3 py-1 rounded-full ${selected.isVip ? "bg-amber-100 text-amber-700" : "bg-surface text-secondary"}`}>
                {selected.isVip ? "★ VIP" : "VIP Yap"}
              </button>
            </div>
            <div>
              <label className="text-xs text-secondary block mb-1">Not</label>
              <textarea defaultValue={selected.note || ""} onBlur={(e) => updateNote(selected.id, e.target.value)} rows={2} className="w-full bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" placeholder="Müşteri notu..." />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
