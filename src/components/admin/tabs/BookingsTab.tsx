"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Calendar, Phone, MapPin, Car, X, MessageCircle, Check, User, Mail, FileText, Loader2 } from "lucide-react";
import { fetchBookings, updateBooking, fetchDrivers } from "@/lib/admin-api";

type BookingStatus = "new" | "confirmed" | "assigned" | "completed" | "cancelled";

interface Booking {
  id: string;
  booking_id: string;
  date: string;
  time: string;
  from_location: string;
  to_location: string;
  km: number;
  min: number;
  vehicle: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_lang?: string;
  note?: string;
  price: number;
  status: BookingStatus;
  payment_status: string;
  payment_method?: string;
  driver_id?: string;
  created_at: string;
}

interface Driver {
  id: string;
  name: string;
  status: string;
}

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

export default function BookingsTab() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    try {
      const [b, d] = await Promise.all([
        fetchBookings({ status: filter, date: dateFilter, search }),
        fetchDrivers(),
      ]);
      setBookings(b);
      setDrivers(d);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filter, dateFilter, search]);

  useEffect(() => { load(); }, [load]);

  const availableDrivers = drivers.filter((d) => d.status === "available");

  const handleUpdateStatus = async (id: string, status: BookingStatus) => {
    await updateBooking(id, { status });
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const handleAssignDriver = async (bookingId: string, driverId: string) => {
    await updateBooking(bookingId, { status: "assigned", driver_id: driverId });
    const driverName = drivers.find((d) => d.id === driverId)?.name;
    setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: "assigned" as BookingStatus, driver_id: driverId } : b));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const bulkAction = async (status: BookingStatus) => {
    await Promise.all([...selectedIds].map((id) => updateBooking(id, { status })));
    setBookings((prev) => prev.map((b) => selectedIds.has(b.id) ? { ...b, status } : b));
    setSelectedIds(new Set());
  };

  const sendWhatsApp = (b: Booking) => {
    const msg = encodeURIComponent(`Sayin ${b.customer_name}, ${b.date} tarihli ${b.from_location} → ${b.to_location} transferiniz onaylanmistir. Arac: ${b.vehicle}. Iyi yolculuklar!`);
    window.open(`https://wa.me/${b.customer_phone.replace(/[^0-9+]/g, "")}?text=${msg}`, "_blank");
  };

  const statusCounts = bookings.reduce((acc, b) => { acc[b.status] = (acc[b.status] || 0) + 1; return acc; }, {} as Record<string, number>);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-text">Rezervasyonlar</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-secondary">{selectedIds.size} secili:</span>
              <button onClick={() => bulkAction("confirmed")} className="px-2 py-1 rounded bg-amber-100 text-amber-700">Onayla</button>
              <button onClick={() => bulkAction("cancelled")} className="px-2 py-1 rounded bg-red-100 text-red-700">Iptal</button>
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
            {f === "all" ? `Tumu (${bookings.length})` : `${statusLabels[f as BookingStatus]} (${statusCounts[f] || 0})`}
          </button>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-12 text-secondary text-sm">Henuz rezervasyon yok.</div>
      )}

      {/* Booking list */}
      <div className="space-y-2">
        {bookings.map((b) => (
          <div key={b.id} className="bg-card-bg border border-border-light rounded-xl p-4">
            <div className="flex items-start gap-3">
              <input type="checkbox" checked={selectedIds.has(b.id)} onChange={() => toggleSelect(b.id)} className="mt-1 shrink-0 accent-primary" />
              <div className="flex-1 min-w-0" onClick={() => setSelected(b)} role="button">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-mono text-tertiary">{b.booking_id}</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColors[b.status]}`}>{statusLabels[b.status]}</span>
                  <span className={`text-[10px] font-medium ${payStatusColors[b.payment_status]}`}>{payStatusLabels[b.payment_status]}</span>
                </div>
                <p className="text-sm font-medium text-text">{b.customer_name}</p>
                <div className="flex items-center gap-4 text-xs text-secondary mt-1 flex-wrap">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{b.from_location} → {b.to_location}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{b.date} {b.time}</span>
                  <span className="flex items-center gap-1"><Car className="w-3 h-3" />{b.vehicle}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-base font-semibold text-text">{b.price.toLocaleString("tr-TR")} TL</p>
                <div className="flex gap-1 mt-2">
                  {b.status === "new" && <button onClick={() => handleUpdateStatus(b.id, "confirmed")} className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-700">Onayla</button>}
                  {b.status === "confirmed" && (
                    <select onChange={(e) => { if (e.target.value) handleAssignDriver(b.id, e.target.value); }} className="text-[10px] px-1 py-0.5 rounded bg-purple-100 text-purple-700 border-none">
                      <option value="">Surucu Ata</option>
                      {availableDrivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  )}
                  {b.status === "assigned" && <button onClick={() => handleUpdateStatus(b.id, "completed")} className="text-[10px] px-2 py-0.5 rounded bg-green-100 text-green-700">Tamamla</button>}
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
              <h3 className="text-sm font-semibold text-text">{selected.booking_id} — Detay</h3>
              <button onClick={() => setSelected(null)} className="text-tertiary hover:text-text"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between"><span className="text-secondary">Durum</span><span className={`font-medium px-2 py-0.5 rounded-full ${statusColors[selected.status]}`}>{statusLabels[selected.status]}</span></div>
              <div className="flex justify-between"><span className="text-secondary">Odeme</span><span className={payStatusColors[selected.payment_status]}>{payStatusLabels[selected.payment_status]} {selected.payment_method ? `(${selected.payment_method})` : ""}</span></div>
              <div className="border-t border-border-light pt-3">
                <div className="flex items-center gap-2 mb-1"><User className="w-3 h-3 text-tertiary" /><span className="text-text font-medium">{selected.customer_name}</span></div>
                <div className="flex items-center gap-2 mb-1"><Phone className="w-3 h-3 text-tertiary" /><span className="text-text">{selected.customer_phone}</span></div>
                {selected.customer_email && <div className="flex items-center gap-2 mb-1"><Mail className="w-3 h-3 text-tertiary" /><span className="text-text">{selected.customer_email}</span></div>}
                <div className="flex items-center gap-2"><span className="text-tertiary">Dil:</span><span className="text-text uppercase">{selected.customer_lang}</span></div>
              </div>
              <div className="border-t border-border-light pt-3">
                <div className="flex items-center gap-2 mb-1"><MapPin className="w-3 h-3 text-tertiary" /><span className="text-text">{selected.from_location} → {selected.to_location}</span></div>
                <div className="flex items-center gap-2 mb-1"><Calendar className="w-3 h-3 text-tertiary" /><span className="text-text">{selected.date} {selected.time}</span></div>
                <div className="flex items-center gap-2 mb-1"><Car className="w-3 h-3 text-tertiary" /><span className="text-text">{selected.vehicle} — {selected.km} km, ~{selected.min} dk</span></div>
                <div className="flex items-center gap-2"><span className="text-tertiary">Fiyat:</span><span className="text-text font-semibold">{selected.price.toLocaleString("tr-TR")} TL</span></div>
              </div>
              {selected.note && <div className="border-t border-border-light pt-3"><p className="text-secondary"><FileText className="w-3 h-3 inline mr-1" />{selected.note}</p></div>}
              <div className="border-t border-border-light pt-3 flex gap-2">
                <button onClick={() => sendWhatsApp(selected)} className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 text-white py-2 rounded-lg text-xs"><MessageCircle className="w-3 h-3" />WhatsApp Gonder</button>
                <button onClick={() => setSelected(null)} className="flex-1 bg-surface text-text py-2 rounded-lg text-xs">Kapat</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
