"use client";

import { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { fetchCustomers, updateCustomer } from "@/lib/admin-api";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  lang: string;
  total_trips: number;
  total_spent: number;
  is_vip: boolean;
  note?: string;
  created_at: string;
}

export default function CustomersTab() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchCustomers(search || undefined).then(setCustomers).catch(console.error).finally(() => setLoading(false));
  }, [search]);

  const toggleVip = async (c: Customer) => {
    const newVip = !c.is_vip;
    await updateCustomer(c.id, { is_vip: newVip });
    setCustomers((prev) => prev.map((x) => x.id === c.id ? { ...x, is_vip: newVip } : x));
    if (selected?.id === c.id) setSelected({ ...selected, is_vip: newVip });
  };

  const saveNote = async (id: string, note: string) => {
    await updateCustomer(id, { note: note || null });
    setCustomers((prev) => prev.map((c) => c.id === id ? { ...c, note } : c));
  };

  if (loading && customers.length === 0) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-text">Musteriler</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-tertiary" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Musteri ara..." className="bg-card-bg border border-border-light rounded-lg pl-8 pr-3 py-1.5 text-xs text-text w-48 focus:outline-none focus:border-border" />
        </div>
      </div>

      {customers.length === 0 && <div className="text-center py-12 text-secondary text-sm">Henuz musteri yok.</div>}

      <div className="space-y-2">
        {customers.map((c) => (
          <div key={c.id} onClick={() => setSelected(c)} className="bg-card-bg border border-border-light rounded-xl p-4 cursor-pointer hover:border-border transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${c.is_vip ? "bg-amber-100 text-amber-700" : "bg-surface text-secondary"}`}>
                  {c.is_vip ? "VIP" : c.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-text">{c.name}</p>
                  <p className="text-xs text-tertiary">{c.phone} · {(c.lang || "tr").toUpperCase()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-text">{c.total_trips || 0} trip</p>
                <p className="text-xs text-tertiary">{(c.total_spent || 0).toLocaleString("tr-TR")} TL</p>
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
              <div className="flex justify-between"><span className="text-secondary">Dil</span><span className="text-text uppercase">{selected.lang || "tr"}</span></div>
              <div className="flex justify-between"><span className="text-secondary">Toplam Trip</span><span className="text-text">{selected.total_trips || 0}</span></div>
              <div className="flex justify-between"><span className="text-secondary">Toplam Harcama</span><span className="text-text font-medium">{(selected.total_spent || 0).toLocaleString("tr-TR")} TL</span></div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-secondary">VIP Musteri</span>
              <button onClick={() => toggleVip(selected)} className={`text-xs px-3 py-1 rounded-full ${selected.is_vip ? "bg-amber-100 text-amber-700" : "bg-surface text-secondary"}`}>
                {selected.is_vip ? "VIP" : "VIP Yap"}
              </button>
            </div>
            <div>
              <label className="text-xs text-secondary block mb-1">Not</label>
              <textarea defaultValue={selected.note || ""} onBlur={(e) => saveNote(selected.id, e.target.value)} rows={2} className="w-full bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" placeholder="Musteri notu..." />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
