"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, DollarSign, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import { fetchBookings, fetchDrivers } from "@/lib/admin-api";

interface Booking {
  id: string;
  date: string;
  status: string;
  price: number;
  customer_name: string;
  from_location: string;
  to_location: string;
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

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  const today = new Date().toISOString().split("T")[0];
  const todayBookings = bookings.filter((b) => b.date === today);
  const newCount = bookings.filter((b) => b.status === "new").length;
  const todayRevenue = todayBookings.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.price, 0);
  const totalRevenue = bookings.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.price, 0);
  const availableDrivers = drivers.filter((d) => d.status === "available").length;

  // Recent activity from bookings
  const recentBookings = [...bookings].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 7);

  // Route stats
  const routeCounts: Record<string, { count: number; revenue: number }> = {};
  bookings.filter((b) => b.status !== "cancelled").forEach((b) => {
    const key = `${b.from_location} → ${b.to_location}`;
    if (!routeCounts[key]) routeCounts[key] = { count: 0, revenue: 0 };
    routeCounts[key].count++;
    routeCounts[key].revenue += b.price;
  });
  const popularRoutes = Object.entries(routeCounts).sort((a, b) => b[1].count - a[1].count).slice(0, 5);

  return (
    <>
      <h2 className="text-lg font-semibold text-text mb-5">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Bugun Transfer", value: todayBookings.length, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Yeni Talep", value: newCount, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Bugun Gelir", value: `${todayRevenue.toLocaleString("tr-TR")} TL`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
          { label: "Toplam Gelir", value: `${totalRevenue.toLocaleString("tr-TR")} TL`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className="bg-card-bg border border-border-light rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-secondary">{s.label}</span>
              <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
              </div>
            </div>
            <p className="text-xl font-semibold text-text">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent bookings */}
        <div className="lg:col-span-2 bg-card-bg border border-border-light rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text">Son Rezervasyonlar</h3>
            <button onClick={() => onNavigate("bookings")} className="text-[11px] text-primary flex items-center gap-1">Tumunu Gor <ArrowRight className="w-3 h-3" /></button>
          </div>
          <div className="space-y-2">
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between text-xs py-2 border-b border-border-light last:border-0">
                <div>
                  <p className="text-text font-medium">{b.customer_name}</p>
                  <p className="text-tertiary">{b.from_location} → {b.to_location}</p>
                </div>
                <div className="text-right">
                  <p className="text-text font-medium">{b.price.toLocaleString("tr-TR")} TL</p>
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
            <h3 className="text-sm font-semibold text-text">Surucu Durumu</h3>
            <button onClick={() => onNavigate("drivers")} className="text-[11px] text-primary flex items-center gap-1">Tumu <ArrowRight className="w-3 h-3" /></button>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 rounded-lg bg-green-50"><p className="text-lg font-semibold text-green-700">{availableDrivers}</p><p className="text-[10px] text-green-600">Musait</p></div>
            <div className="text-center p-2 rounded-lg bg-blue-50"><p className="text-lg font-semibold text-blue-700">{drivers.filter((d) => d.status === "on_trip").length}</p><p className="text-[10px] text-blue-600">Yolda</p></div>
            <div className="text-center p-2 rounded-lg bg-gray-50"><p className="text-lg font-semibold text-gray-600">{drivers.filter((d) => d.status === "off_duty").length}</p><p className="text-[10px] text-gray-500">Izinli</p></div>
          </div>
          {drivers.slice(0, 5).map((d) => (
            <div key={d.id} className="flex items-center justify-between py-1.5 text-xs">
              <span className="text-text">{d.name}</span>
              <span className={d.status === "available" ? "text-green-600" : d.status === "on_trip" ? "text-blue-600" : "text-gray-500"}>
                {d.status === "available" ? "Musait" : d.status === "on_trip" ? "Yolda" : "Izinli"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Popular routes */}
      {popularRoutes.length > 0 && (
        <div className="mt-5 bg-card-bg border border-border-light rounded-xl p-5">
          <h3 className="text-sm font-semibold text-text mb-4">Populer Rotalar</h3>
          <div className="space-y-2.5">
            {popularRoutes.map(([route, data], i) => (
              <div key={route} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] text-tertiary w-4">{i + 1}.</span>
                  <span className="text-xs text-text">{route}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-secondary">{data.count} trip</span>
                  <span className="text-text font-medium">{(data.revenue / 1000).toFixed(0)}k TL</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
