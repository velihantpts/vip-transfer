"use client";

import { useState } from "react";
import { Star, Phone, Car, Calendar, DollarSign, TrendingUp, X } from "lucide-react";
import { mockDrivers, mockBookings, type Driver } from "@/lib/mock-data";

const statusColors: Record<string, string> = { available: "bg-green-100 text-green-700", "on-trip": "bg-blue-100 text-blue-700", "off-duty": "bg-gray-100 text-gray-600" };
const statusLabels: Record<string, string> = { available: "Müsait", "on-trip": "Yolda", "off-duty": "İzinli" };

export default function DriversTab() {
  const [drivers, setDrivers] = useState(mockDrivers);
  const [selected, setSelected] = useState<Driver | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", vehicle: "Mercedes E-Class", plate: "" });

  const addDriver = () => {
    if (!form.name || !form.phone || !form.plate) return;
    const newDriver: Driver = { id: `D${String(drivers.length + 1).padStart(3, "0")}`, name: form.name, phone: form.phone, vehicle: form.vehicle, plate: form.plate, status: "available", rating: 0, trips: 0, monthlyEarnings: 0, cancelRate: 0, offDays: [] };
    setDrivers([...drivers, newDriver]);
    setAdding(false);
    setForm({ name: "", phone: "", vehicle: "Mercedes E-Class", plate: "" });
  };

  const driverBookings = (driverId: string) => mockBookings.filter((b) => b.driverId === driverId);

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-text">Sürücüler</h2>
        <button onClick={() => setAdding(true)} className="btn-primary px-3 py-1.5 rounded-lg text-xs">+ Yeni Sürücü</button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center"><p className="text-xl font-semibold text-green-700">{drivers.filter((d) => d.status === "available").length}</p><p className="text-[10px] text-green-600">Müsait</p></div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center"><p className="text-xl font-semibold text-blue-700">{drivers.filter((d) => d.status === "on-trip").length}</p><p className="text-[10px] text-blue-600">Yolda</p></div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center"><p className="text-xl font-semibold text-gray-600">{drivers.filter((d) => d.status === "off-duty").length}</p><p className="text-[10px] text-gray-500">İzinli</p></div>
      </div>

      {/* Driver list */}
      <div className="space-y-2">
        {drivers.map((d) => (
          <div key={d.id} onClick={() => setSelected(d)} className="bg-card-bg border border-border-light rounded-xl p-4 cursor-pointer hover:border-border transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-sm font-semibold text-secondary">
                  {d.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-text">{d.name}</p>
                  <p className="text-xs text-tertiary">{d.vehicle} · {d.plate}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-text flex items-center gap-1 justify-end"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{d.rating || "—"}</p>
                  <p className="text-[10px] text-tertiary">{d.trips} trip · ₺{(d.monthlyEarnings / 1000).toFixed(0)}k/ay</p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColors[d.status]}`}>{statusLabels[d.status]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Driver detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card-bg rounded-2xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text">{selected.name}</h3>
              <button onClick={() => setSelected(null)} className="text-tertiary hover:text-text"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-surface rounded-lg p-3 text-center"><p className="text-lg font-semibold text-text">{selected.rating || "—"}</p><p className="text-[10px] text-secondary">Puan</p></div>
              <div className="bg-surface rounded-lg p-3 text-center"><p className="text-lg font-semibold text-text">{selected.trips}</p><p className="text-[10px] text-secondary">Trip</p></div>
              <div className="bg-surface rounded-lg p-3 text-center"><p className="text-lg font-semibold text-text">₺{selected.monthlyEarnings.toLocaleString()}</p><p className="text-[10px] text-secondary">Aylık Kazanç</p></div>
              <div className="bg-surface rounded-lg p-3 text-center"><p className="text-lg font-semibold text-text">%{selected.cancelRate}</p><p className="text-[10px] text-secondary">İptal Oranı</p></div>
            </div>
            <div className="space-y-2 text-xs mb-4">
              <div className="flex justify-between"><span className="text-secondary">Telefon</span><span className="text-text">{selected.phone}</span></div>
              <div className="flex justify-between"><span className="text-secondary">Araç</span><span className="text-text">{selected.vehicle}</span></div>
              <div className="flex justify-between"><span className="text-secondary">Plaka</span><span className="text-text">{selected.plate}</span></div>
              <div className="flex justify-between"><span className="text-secondary">İzin Günleri</span><span className="text-text">{selected.offDays.length > 0 ? selected.offDays.join(", ") : "Yok"}</span></div>
            </div>
            <h4 className="text-xs font-semibold text-text mb-2">Atanmış Transferler</h4>
            <div className="space-y-1.5">
              {driverBookings(selected.id).length === 0 && <p className="text-xs text-tertiary">Atanmış transfer yok.</p>}
              {driverBookings(selected.id).map((b) => (
                <div key={b.id} className="flex justify-between text-xs bg-surface rounded-lg px-3 py-2">
                  <span className="text-text">{b.from} → {b.to}</span>
                  <span className="text-secondary">{b.date} {b.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add driver modal */}
      {adding && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setAdding(false)}>
          <div className="bg-card-bg rounded-2xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-text mb-4">Yeni Sürücü</h3>
            <div className="space-y-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ad Soyad" className="w-full bg-surface rounded-lg px-3 py-2 text-sm text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Telefon" className="w-full bg-surface rounded-lg px-3 py-2 text-sm text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <select value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })} className="w-full bg-surface rounded-lg px-3 py-2 text-sm text-text border-none focus:outline-none">
                <option>Mercedes E-Class</option><option>Mercedes V-Class</option><option>Mercedes S-Class</option><option>Mercedes Sprinter</option>
              </select>
              <input value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} placeholder="Plaka" className="w-full bg-surface rounded-lg px-3 py-2 text-sm text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={addDriver} className="flex-1 btn-primary py-2 rounded-lg text-xs">Kaydet</button>
              <button onClick={() => setAdding(false)} className="flex-1 bg-surface text-text py-2 rounded-lg text-xs">İptal</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
