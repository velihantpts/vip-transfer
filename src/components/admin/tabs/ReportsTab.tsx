"use client";

import { useState, useEffect } from "react";
import { Download, Loader2 } from "lucide-react";
import { fetchBookings, fetchDrivers } from "@/lib/admin-api";

interface Booking {
  id: string;
  booking_id: string;
  date: string;
  time: string;
  from_location: string;
  to_location: string;
  customer_name: string;
  customer_phone: string;
  vehicle: string;
  price: number;
  status: string;
  driver_id?: string;
}

interface Driver {
  id: string;
  name: string;
  rating: number;
  trips: number;
  cancel_rate: number;
  monthly_earnings: number;
}

export default function ReportsTab() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchBookings(), fetchDrivers()])
      .then(([b, d]) => { setBookings(b); setDrivers(d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const exportCSV = () => {
    const header = "ID,Tarih,Saat,Nereden,Nereye,Musteri,Telefon,Arac,Fiyat,Durum\n";
    const rows = bookings.map((b) => `${b.booking_id},${b.date},${b.time},${b.from_location},${b.to_location},${b.customer_name},${b.customer_phone},${b.vehicle},${b.price},${b.status}`).join("\n");
    const blob = new Blob(["\uFEFF" + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "rezervasyonlar.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  const totalRevenue = bookings.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.price, 0);
  const completedCount = bookings.filter((b) => b.status === "completed").length;
  const cancelledCount = bookings.filter((b) => b.status === "cancelled").length;

  // Route stats
  const routeCounts: Record<string, { count: number; revenue: number }> = {};
  bookings.filter((b) => b.status !== "cancelled").forEach((b) => {
    const key = `${b.from_location} → ${b.to_location}`;
    if (!routeCounts[key]) routeCounts[key] = { count: 0, revenue: 0 };
    routeCounts[key].count++;
    routeCounts[key].revenue += b.price;
  });
  const popularRoutes = Object.entries(routeCounts).sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 5);
  const maxRouteRevenue = popularRoutes[0]?.[1].revenue || 1;

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-text">Raporlar</h2>
        <button onClick={exportCSV} className="flex items-center gap-1.5 text-xs text-primary hover:text-primary-dark transition-colors"><Download className="w-3.5 h-3.5" />CSV Indir</button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-card-bg border border-border-light rounded-xl p-4 text-center"><p className="text-xl font-semibold text-text">{totalRevenue.toLocaleString("tr-TR")} TL</p><p className="text-[10px] text-secondary">Toplam Gelir</p></div>
        <div className="bg-card-bg border border-border-light rounded-xl p-4 text-center"><p className="text-xl font-semibold text-text">{bookings.length}</p><p className="text-[10px] text-secondary">Toplam Rezervasyon</p></div>
        <div className="bg-card-bg border border-border-light rounded-xl p-4 text-center"><p className="text-xl font-semibold text-green-600">{completedCount}</p><p className="text-[10px] text-secondary">Tamamlanan</p></div>
        <div className="bg-card-bg border border-border-light rounded-xl p-4 text-center"><p className="text-xl font-semibold text-red-600">{cancelledCount}</p><p className="text-[10px] text-secondary">Iptal</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Popular routes */}
        <div className="bg-card-bg border border-border-light rounded-xl p-5">
          <h3 className="text-xs font-semibold text-text mb-4">Rota Bazli Gelir</h3>
          <div className="space-y-3">
            {popularRoutes.map(([route, data]) => {
              const pct = (data.revenue / maxRouteRevenue) * 100;
              return (
                <div key={route}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text">{route}</span>
                    <span className="text-secondary">{data.count} trip · {(data.revenue / 1000).toFixed(0)}k TL</span>
                  </div>
                  <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {popularRoutes.length === 0 && <p className="text-xs text-tertiary text-center py-4">Henuz veri yok.</p>}
          </div>
        </div>

        {/* Driver performance */}
        <div className="bg-card-bg border border-border-light rounded-xl p-5">
          <h3 className="text-xs font-semibold text-text mb-4">Surucu Performansi</h3>
          <table className="w-full text-xs">
            <thead><tr className="border-b border-border-light">
              <th className="text-left py-2 text-secondary font-medium">Surucu</th>
              <th className="text-center py-2 text-secondary font-medium">Puan</th>
              <th className="text-center py-2 text-secondary font-medium">Trip</th>
              <th className="text-right py-2 text-secondary font-medium">Kazanc</th>
            </tr></thead>
            <tbody>
              {drivers.sort((a, b) => b.rating - a.rating).map((d) => (
                <tr key={d.id} className="border-b border-border-light last:border-0">
                  <td className="py-2 text-text">{d.name}</td>
                  <td className="py-2 text-center text-text">{d.rating || "—"}</td>
                  <td className="py-2 text-center text-secondary">{d.trips}</td>
                  <td className="py-2 text-right font-medium text-text">{(d.monthly_earnings || 0).toLocaleString("tr-TR")} TL</td>
                </tr>
              ))}
              {drivers.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-tertiary">Henuz surucu yok.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
