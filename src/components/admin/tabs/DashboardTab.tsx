"use client";

import { Calendar, Clock, DollarSign, TrendingUp, Users, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { mockBookings, mockDrivers, mockActivity, weeklyRevenue, popularRoutes } from "@/lib/mock-data";

const newCount = mockBookings.filter((b) => b.status === "new").length;
const todayBookings = mockBookings.filter((b) => b.date === "2026-03-20").length;
const todayRevenue = mockBookings.filter((b) => b.date === "2026-03-20" && b.status !== "cancelled").reduce((s, b) => s + b.price, 0);
const monthRevenue = mockBookings.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.price, 0);
const completedCount = mockBookings.filter((b) => b.status === "completed").length;
const availableDrivers = mockDrivers.filter((d) => d.status === "available").length;
const maxRevenue = Math.max(...weeklyRevenue.map((d) => d.amount));

const eventIcons: Record<string, string> = {
  new_booking: "🔵",
  status_change: "🟡",
  driver_assigned: "🟣",
  completed: "🟢",
  cancelled: "🔴",
  payment: "💰",
};

export default function DashboardTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <>
      <h2 className="text-lg font-semibold text-text mb-5">Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Bugün Transfer", value: todayBookings, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Yeni Talep", value: newCount, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Bugün Gelir", value: `₺${todayRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
          { label: "Toplam Gelir", value: `₺${monthRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
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
        {/* Weekly revenue chart */}
        <div className="lg:col-span-2 bg-card-bg border border-border-light rounded-xl p-5">
          <h3 className="text-sm font-semibold text-text mb-4">Haftalık Gelir</h3>
          <div className="flex items-end gap-2 h-32">
            {weeklyRevenue.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-tertiary">₺{(d.amount / 1000).toFixed(0)}k</span>
                <div className="w-full bg-primary/10 rounded-md overflow-hidden" style={{ height: "100%" }}>
                  <div className="bg-primary rounded-md w-full transition-all" style={{ height: `${(d.amount / maxRevenue) * 100}%`, marginTop: `${100 - (d.amount / maxRevenue) * 100}%` }} />
                </div>
                <span className="text-[10px] text-secondary">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity timeline */}
        <div className="bg-card-bg border border-border-light rounded-xl p-5">
          <h3 className="text-sm font-semibold text-text mb-4">Son Aktiviteler</h3>
          <div className="space-y-3">
            {mockActivity.map((e) => (
              <div key={e.id} className="flex gap-2.5">
                <span className="text-sm shrink-0 mt-0.5">{eventIcons[e.type]}</span>
                <div>
                  <p className="text-xs text-text leading-relaxed">{e.text}</p>
                  <p className="text-[10px] text-tertiary">{e.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        {/* Popular routes */}
        <div className="bg-card-bg border border-border-light rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text">Popüler Rotalar</h3>
            <button onClick={() => onNavigate("reports")} className="text-[11px] text-primary flex items-center gap-1">Detay <ArrowRight className="w-3 h-3" /></button>
          </div>
          <div className="space-y-2.5">
            {popularRoutes.map((r, i) => (
              <div key={r.route} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] text-tertiary w-4">{i + 1}.</span>
                  <span className="text-xs text-text">{r.route}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-secondary">{r.count} trip</span>
                  <span className="text-text font-medium">₺{(r.revenue / 1000).toFixed(0)}k</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Driver status */}
        <div className="bg-card-bg border border-border-light rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text">Sürücü Durumu</h3>
            <button onClick={() => onNavigate("drivers")} className="text-[11px] text-primary flex items-center gap-1">Tümü <ArrowRight className="w-3 h-3" /></button>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 rounded-lg bg-green-50"><p className="text-lg font-semibold text-green-700">{availableDrivers}</p><p className="text-[10px] text-green-600">Müsait</p></div>
            <div className="text-center p-2 rounded-lg bg-blue-50"><p className="text-lg font-semibold text-blue-700">{mockDrivers.filter((d) => d.status === "on-trip").length}</p><p className="text-[10px] text-blue-600">Yolda</p></div>
            <div className="text-center p-2 rounded-lg bg-gray-50"><p className="text-lg font-semibold text-gray-600">{mockDrivers.filter((d) => d.status === "off-duty").length}</p><p className="text-[10px] text-gray-500">İzinli</p></div>
          </div>
          {mockDrivers.slice(0, 3).map((d) => (
            <div key={d.id} className="flex items-center justify-between py-1.5 text-xs">
              <span className="text-text">{d.name}</span>
              <span className={d.status === "available" ? "text-green-600" : d.status === "on-trip" ? "text-blue-600" : "text-gray-500"}>
                {d.status === "available" ? "Müsait" : d.status === "on-trip" ? "Yolda" : "İzinli"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
