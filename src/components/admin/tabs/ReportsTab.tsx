"use client";

import { Download } from "lucide-react";
import { weeklyRevenue, popularRoutes, mockBookings, mockDrivers } from "@/lib/mock-data";

const maxRevenue = Math.max(...weeklyRevenue.map((d) => d.amount));
const totalRevenue = mockBookings.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.price, 0);
const completedCount = mockBookings.filter((b) => b.status === "completed").length;
const cancelledCount = mockBookings.filter((b) => b.status === "cancelled").length;

export default function ReportsTab() {
  const exportCSV = () => {
    const header = "ID,Tarih,Saat,Nereden,Nereye,Müşteri,Telefon,Araç,Fiyat,Durum,Sürücü\n";
    const rows = mockBookings.map((b) => `${b.id},${b.date},${b.time},${b.from},${b.to},${b.customer},${b.phone},${b.vehicle},${b.price},${b.status},${b.driver || ""}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "rezervasyonlar.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-text">Raporlar</h2>
        <button onClick={exportCSV} className="flex items-center gap-1.5 text-xs text-primary hover:text-primary-dark transition-colors"><Download className="w-3.5 h-3.5" />CSV İndir</button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-card-bg border border-border-light rounded-xl p-4 text-center"><p className="text-xl font-semibold text-text">₺{totalRevenue.toLocaleString()}</p><p className="text-[10px] text-secondary">Toplam Gelir</p></div>
        <div className="bg-card-bg border border-border-light rounded-xl p-4 text-center"><p className="text-xl font-semibold text-text">{mockBookings.length}</p><p className="text-[10px] text-secondary">Toplam Rezervasyon</p></div>
        <div className="bg-card-bg border border-border-light rounded-xl p-4 text-center"><p className="text-xl font-semibold text-green-600">{completedCount}</p><p className="text-[10px] text-secondary">Tamamlanan</p></div>
        <div className="bg-card-bg border border-border-light rounded-xl p-4 text-center"><p className="text-xl font-semibold text-red-600">{cancelledCount}</p><p className="text-[10px] text-secondary">İptal</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        {/* Revenue chart */}
        <div className="bg-card-bg border border-border-light rounded-xl p-5">
          <h3 className="text-xs font-semibold text-text mb-4">Haftalık Gelir</h3>
          <div className="flex items-end gap-3 h-36">
            {weeklyRevenue.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-tertiary">₺{(d.amount / 1000).toFixed(0)}k</span>
                <div className="w-full rounded-md overflow-hidden bg-primary/10" style={{ height: "100%" }}>
                  <div className="bg-primary rounded-md w-full" style={{ height: `${(d.amount / maxRevenue) * 100}%`, marginTop: `${100 - (d.amount / maxRevenue) * 100}%` }} />
                </div>
                <span className="text-[10px] text-secondary">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular routes */}
        <div className="bg-card-bg border border-border-light rounded-xl p-5">
          <h3 className="text-xs font-semibold text-text mb-4">Rota Bazlı Gelir</h3>
          <div className="space-y-3">
            {popularRoutes.map((r) => {
              const pct = (r.revenue / popularRoutes[0].revenue) * 100;
              return (
                <div key={r.route}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text">{r.route}</span>
                    <span className="text-secondary">{r.count} trip · ₺{(r.revenue / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Driver performance */}
      <div className="bg-card-bg border border-border-light rounded-xl p-5">
        <h3 className="text-xs font-semibold text-text mb-4">Sürücü Performansı</h3>
        <table className="w-full text-xs">
          <thead><tr className="border-b border-border-light">
            <th className="text-left py-2 text-secondary font-medium">Sürücü</th>
            <th className="text-center py-2 text-secondary font-medium">Puan</th>
            <th className="text-center py-2 text-secondary font-medium">Trip</th>
            <th className="text-center py-2 text-secondary font-medium">İptal %</th>
            <th className="text-right py-2 text-secondary font-medium">Aylık Kazanç</th>
          </tr></thead>
          <tbody>
            {mockDrivers.sort((a, b) => b.rating - a.rating).map((d) => (
              <tr key={d.id} className="border-b border-border-light last:border-0">
                <td className="py-2 text-text">{d.name}</td>
                <td className="py-2 text-center text-text">{d.rating}</td>
                <td className="py-2 text-center text-secondary">{d.trips}</td>
                <td className="py-2 text-center text-secondary">%{d.cancelRate}</td>
                <td className="py-2 text-right font-medium text-text">₺{d.monthlyEarnings.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
