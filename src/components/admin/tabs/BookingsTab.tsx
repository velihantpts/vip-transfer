"use client";

import { useState } from "react";
import { Search, Calendar, Phone, MapPin, Car, X, MessageCircle, ChevronDown, Check, User, Mail, FileText } from "lucide-react";
import { mockBookings, mockDrivers, type Booking, type BookingStatus } from "@/lib/mock-data";

const statusColors: Record<BookingStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  confirmed: "bg-amber-100 text-amber-700",
  assigned: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};
const statusLabels: Record<BookingStatus, string> = {
  new: "Yeni", confirmed: "Onaylı", assigned: "Atandı", completed: "Tamamlandı", cancelled: "İptal",
};
const payStatusLabels: Record<string, string> = { unpaid: "Ödenmedi", deposit: "Depozito", paid: "Ödendi" };
const payStatusColors: Record<string, string> = { unpaid: "text-red-600", deposit: "text-amber-600", paid: "text-green-600" };

const availableDrivers = mockDrivers.filter((d) => d.status === "available");

export default function BookingsTab() {
  const [bookings, setBookings] = useState(mockBookings);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = bookings
    .filter((b) => filter === "all" || b.status === filter)
    .filter((b) => !search || b.customer.toLowerCase().includes(search.toLowerCase()) || b.phone.includes(search) || b.id.toLowerCase().includes(search.toLowerCase()))
    .filter((b) => !dateFilter || b.date === dateFilter);

  const updateStatus = (id: string, status: BookingStatus) => {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const assignDriver = (bookingId: string, driverId: string, driverName: string) => {
    setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: "assigned" as BookingStatus, driver: driverName, driverId } : b));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const bulkAction = (status: BookingStatus) => {
    setBookings((prev) => prev.map((b) => selectedIds.has(b.id) ? { ...b, status } : b));
    setSelectedIds(new Set());
  };

  const sendWhatsApp = (b: Booking) => {
    const msg = encodeURIComponent(`Sayın ${b.customer}, ${b.date} tarihli ${b.from} → ${b.to} transferiniz onaylanmıştır. Araç: ${b.vehicle}. İyi yolculuklar!`);
    window.open(`https://wa.me/${b.phone.replace(/[^0-9+]/g, "")}?text=${msg}`, "_blank");
  };

  return (
    <>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-text">Rezervasyonlar</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-secondary">{selectedIds.size} seçili:</span>
              <button onClick={() => bulkAction("confirmed")} className="px-2 py-1 rounded bg-amber-100 text-amber-700">Onayla</button>
              <button onClick={() => bulkAction("cancelled")} className="px-2 py-1 rounded bg-red-100 text-red-700">İptal</button>
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-tertiary" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ara..." className="bg-card-bg border border-border-light rounded-lg pl-8 pr-3 py-1.5 text-xs text-text w-40 focus:outline-none focus:border-border" />
          </div>
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="bg-card-bg border border-border-light rounded-lg px-2.5 py-1.5 text-xs text-text focus:outline-none focus:border-border" />
        </div>
      </div>

      {/* Status filters */}
      <div className="flex gap-1 mb-4 overflow-x-auto">
        {["all", "new", "confirmed", "assigned", "completed", "cancelled"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`text-[11px] px-2.5 py-1 rounded-full shrink-0 ${filter === f ? "bg-primary text-white" : "text-secondary hover:bg-surface"}`}>
            {f === "all" ? `Tümü (${bookings.length})` : `${statusLabels[f as BookingStatus]} (${bookings.filter((b) => b.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Booking list */}
      <div className="space-y-2">
        {filtered.map((b) => (
          <div key={b.id} className="bg-card-bg border border-border-light rounded-xl p-4">
            <div className="flex items-start gap-3">
              <input type="checkbox" checked={selectedIds.has(b.id)} onChange={() => toggleSelect(b.id)} className="mt-1 shrink-0 accent-primary" />
              <div className="flex-1 min-w-0" onClick={() => setSelected(b)} role="button">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-mono text-tertiary">{b.id}</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColors[b.status]}`}>{statusLabels[b.status]}</span>
                  <span className={`text-[10px] font-medium ${payStatusColors[b.paymentStatus]}`}>{payStatusLabels[b.paymentStatus]}</span>
                </div>
                <p className="text-sm font-medium text-text">{b.customer}</p>
                <div className="flex items-center gap-4 text-xs text-secondary mt-1 flex-wrap">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{b.from} → {b.to}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{b.date} {b.time}</span>
                  <span className="flex items-center gap-1"><Car className="w-3 h-3" />{b.vehicle}</span>
                </div>
                {b.driver && <p className="text-xs text-secondary mt-1">Sürücü: {b.driver}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="text-base font-semibold text-text">₺{b.price.toLocaleString()}</p>
                <div className="flex gap-1 mt-2">
                  {b.status === "new" && <button onClick={() => updateStatus(b.id, "confirmed")} className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-700">Onayla</button>}
                  {(b.status === "confirmed") && (
                    <select onChange={(e) => { if (e.target.value) assignDriver(b.id, e.target.value, mockDrivers.find((d) => d.id === e.target.value)!.name); }} className="text-[10px] px-1 py-0.5 rounded bg-purple-100 text-purple-700 border-none">
                      <option value="">Sürücü Ata</option>
                      {availableDrivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  )}
                  {b.status === "assigned" && <button onClick={() => updateStatus(b.id, "completed")} className="text-[10px] px-2 py-0.5 rounded bg-green-100 text-green-700">Tamamla</button>}
                  {b.status !== "completed" && b.status !== "cancelled" && <button onClick={() => sendWhatsApp(b)} className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700"><MessageCircle className="w-3 h-3" /></button>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card-bg rounded-2xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text">{selected.id} — Detay</h3>
              <button onClick={() => setSelected(null)} className="text-tertiary hover:text-text"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between"><span className="text-secondary">Durum</span><span className={`font-medium px-2 py-0.5 rounded-full ${statusColors[selected.status]}`}>{statusLabels[selected.status]}</span></div>
              <div className="flex justify-between"><span className="text-secondary">Ödeme</span><span className={payStatusColors[selected.paymentStatus]}>{payStatusLabels[selected.paymentStatus]} {selected.paymentMethod ? `(${selected.paymentMethod})` : ""}</span></div>
              <div className="border-t border-border-light pt-3">
                <div className="flex items-center gap-2 mb-1"><User className="w-3 h-3 text-tertiary" /><span className="text-text font-medium">{selected.customer}</span></div>
                <div className="flex items-center gap-2 mb-1"><Phone className="w-3 h-3 text-tertiary" /><span className="text-text">{selected.phone}</span></div>
                {selected.email && <div className="flex items-center gap-2 mb-1"><Mail className="w-3 h-3 text-tertiary" /><span className="text-text">{selected.email}</span></div>}
                <div className="flex items-center gap-2"><span className="text-tertiary">Dil:</span><span className="text-text uppercase">{selected.lang}</span></div>
              </div>
              <div className="border-t border-border-light pt-3">
                <div className="flex items-center gap-2 mb-1"><MapPin className="w-3 h-3 text-tertiary" /><span className="text-text">{selected.from} → {selected.to}</span></div>
                <div className="flex items-center gap-2 mb-1"><Calendar className="w-3 h-3 text-tertiary" /><span className="text-text">{selected.date} {selected.time}</span></div>
                <div className="flex items-center gap-2 mb-1"><Car className="w-3 h-3 text-tertiary" /><span className="text-text">{selected.vehicle} — {selected.km} km, ~{selected.min} dk</span></div>
                <div className="flex items-center gap-2"><span className="text-tertiary">Fiyat:</span><span className="text-text font-semibold">₺{selected.price.toLocaleString()}</span></div>
              </div>
              {selected.note && <div className="border-t border-border-light pt-3"><p className="text-secondary"><FileText className="w-3 h-3 inline mr-1" />{selected.note}</p></div>}
              {selected.driver && <div className="border-t border-border-light pt-3"><p className="text-text">Sürücü: {selected.driver}</p></div>}
              <div className="border-t border-border-light pt-3 flex gap-2">
                <button onClick={() => sendWhatsApp(selected)} className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white py-2 rounded-lg text-xs"><MessageCircle className="w-3 h-3" />WhatsApp Gönder</button>
                <button onClick={() => { setSelected(null); }} className="flex-1 bg-surface text-text py-2 rounded-lg text-xs">Kapat</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
