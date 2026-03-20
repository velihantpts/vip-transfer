"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, DollarSign, TrendingUp, ArrowRight, Loader2, Check, X as XIcon, Car, Users } from "lucide-react";
import { fetchBookings, fetchDrivers, updateBooking } from "@/lib/admin-api";

interface Booking {
  id: string;
  booking_id: string;
  date: string;
  time: string;
  status: string;
  price: number;
  customer_name: string;
  customer_phone: string;
  from_location: string;
  to_location: string;
  vehicle: string;
  created_at: string;
}

interface Driver {
  id: string;
  name: string;
  status: string;
  rating: number;
}

export default function DashboardTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchBookings(), fetchDrivers()])
      .then(([b, d]) => { setBookings(b); setDrivers(d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const quickConfirm = async (id: string) => {
    await updateBooking(id, { status: "confirmed" });
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "confirmed" } : b));
  };

  const quickCancel = async (id: string) => {
    await updateBooking(id, { status: "cancelled" });
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "cancelled" } : b));
  };

  const quickAssign = async (bookingId: string, driverId: string) => {
    await updateBooking(bookingId, { status: "assigned", driver_id: driverId });
    setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: "assigned" } : b));
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  const today = new Date().toISOString().split("T")[0];
  const todayBookings = bookings.filter((b) => b.date === today);
  const newBookings = bookings.filter((b) => b.status === "new");
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const todayRevenue = todayBookings.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.price, 0);
  const totalRevenue = bookings.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.price, 0);
  const availableDrivers = drivers.filter((d) => d.status === "available");

  const recentBookings = [...bookings].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  return (
    <>
      <h2 className="text-xl font-bold text-text mb-6">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Bugun Transfer", value: todayBookings.length, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Yeni Talep", value: newBookings.length, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Bugun Gelir", value: `${todayRevenue.toLocaleString("tr-TR")} TL`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Toplam Gelir", value: `${totalRevenue.toLocaleString("tr-TR")} TL`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className="bg-card-bg border border-border-light rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-secondary">{s.label}</span>
              <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-text">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions — New bookings needing attention */}
      {newBookings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-amber-800">Onay Bekleyen Talepler ({newBookings.length})</h3>
            <button onClick={() => onNavigate("bookings")} className="text-[11px] text-amber-600 flex items-center gap-1">Tumunu Gor <ArrowRight className="w-3 h-3" /></button>
          </div>
          <div className="space-y-2">
            {newBookings.slice(0, 3).map((b) => (
              <div key={b.id} className="bg-white rounded-lg p-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{b.customer_name}</p>
                  <p className="text-[11px] text-gray-500">{b.from_location} → {b.to_location} · {b.date} {b.time}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-sm font-bold text-gray-900 mr-2">{b.price.toLocaleString("tr-TR")} TL</span>
                  <button onClick={() => quickConfirm(b.id)} className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-200 transition-colors" title="Onayla">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => quickCancel(b.id)} className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors" title="Iptal">
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions — Confirmed needing driver */}
      {confirmedBookings.length > 0 && availableDrivers.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-bold text-purple-800 mb-3">Surucu Atamasi Bekleyen ({confirmedBookings.length})</h3>
          <div className="space-y-2">
            {confirmedBookings.slice(0, 3).map((b) => (
              <div key={b.id} className="bg-white rounded-lg p-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{b.customer_name}</p>
                  <p className="text-[11px] text-gray-500">{b.from_location} → {b.to_location} · {b.vehicle}</p>
                </div>
                <select
                  onChange={(e) => { if (e.target.value) quickAssign(b.id, e.target.value); }}
                  className="text-xs px-2 py-1.5 rounded-lg bg-purple-100 text-purple-700 border-none focus:outline-none"
                >
                  <option value="">Surucu Ata</option>
                  {availableDrivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent bookings */}
        <div className="lg:col-span-2 bg-card-bg border border-border-light rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-text">Son Rezervasyonlar</h3>
            <button onClick={() => onNavigate("bookings")} className="text-[11px] text-primary flex items-center gap-1">Tumunu Gor <ArrowRight className="w-3 h-3" /></button>
          </div>
          <div className="space-y-2">
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between text-xs py-2.5 border-b border-border-light last:border-0">
                <div>
                  <p className="text-sm font-medium text-text">{b.customer_name}</p>
                  <p className="text-tertiary">{b.from_location} → {b.to_location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-text">{b.price.toLocaleString("tr-TR")} TL</p>
                  <p className="text-tertiary">{b.date}</p>
                </div>
              </div>
            ))}
            {recentBookings.length === 0 && <p className="text-xs text-tertiary text-center py-4">Henuz rezervasyon yok.</p>}
          </div>
        </div>

        {/* Driver status */}
        <div className="bg-card-bg border border-border-light rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-text">Surucu Durumu</h3>
            <button onClick={() => onNavigate("drivers")} className="text-[11px] text-primary flex items-center gap-1">Tumu <ArrowRight className="w-3 h-3" /></button>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 rounded-lg bg-emerald-50"><p className="text-xl font-bold text-emerald-700">{availableDrivers.length}</p><p className="text-[10px] text-emerald-600">Musait</p></div>
            <div className="text-center p-2 rounded-lg bg-blue-50"><p className="text-xl font-bold text-blue-700">{drivers.filter((d) => d.status === "on_trip").length}</p><p className="text-[10px] text-blue-600">Yolda</p></div>
            <div className="text-center p-2 rounded-lg bg-gray-50"><p className="text-xl font-bold text-gray-600">{drivers.filter((d) => d.status === "off_duty").length}</p><p className="text-[10px] text-gray-500">Izinli</p></div>
          </div>
          {drivers.slice(0, 5).map((d) => (
            <div key={d.id} className="flex items-center justify-between py-1.5 text-xs">
              <span className="text-text font-medium">{d.name}</span>
              <span className={d.status === "available" ? "text-emerald-600" : d.status === "on_trip" ? "text-blue-600" : "text-gray-500"}>
                {d.status === "available" ? "Musait" : d.status === "on_trip" ? "Yolda" : "Izinli"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
