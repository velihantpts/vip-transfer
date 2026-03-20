"use client";

import { useState } from "react";
import { TrendingUp, Calendar, Users, DollarSign, Car, Settings, BarChart3, UserCircle } from "lucide-react";
import DashboardTab from "./tabs/DashboardTab";
import BookingsTab from "./tabs/BookingsTab";
import DriversTab from "./tabs/DriversTab";
import CustomersTab from "./tabs/CustomersTab";
import PricingTab from "./tabs/PricingTab";
import ReportsTab from "./tabs/ReportsTab";
import SettingsTab from "./tabs/SettingsTab";
import { mockBookings } from "@/lib/mock-data";

type Tab = "dashboard" | "bookings" | "drivers" | "customers" | "pricing" | "reports" | "settings";

const tabs = [
  { id: "dashboard" as Tab, label: "Dashboard", icon: TrendingUp },
  { id: "bookings" as Tab, label: "Rezervasyonlar", icon: Calendar, badge: mockBookings.filter((b) => b.status === "new").length },
  { id: "drivers" as Tab, label: "Sürücüler", icon: Car },
  { id: "customers" as Tab, label: "Müşteriler", icon: UserCircle },
  { id: "pricing" as Tab, label: "Fiyatlandırma", icon: DollarSign },
  { id: "reports" as Tab, label: "Raporlar", icon: BarChart3 },
  { id: "settings" as Tab, label: "Ayarlar", icon: Settings },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <div className="min-h-screen bg-surface">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-52 min-h-screen bg-card-bg border-r border-border-light p-3 shrink-0 hidden md:block">
          <div className="px-2 mb-6">
            <h1 className="text-sm font-semibold text-text">Admin Panel</h1>
            <p className="text-[10px] text-tertiary">Antalya VIP Transfer</p>
          </div>
          <nav className="space-y-0.5">
            {tabs.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                  tab === item.id ? "bg-primary text-white" : "text-secondary hover:bg-surface hover:text-text"
                }`}
              >
                <span className="flex items-center gap-2">
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </span>
                {item.badge ? (
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${tab === item.id ? "bg-white/20" : "bg-red-100 text-red-600"}`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 min-w-0">
          {/* Mobile tabs */}
          <div className="flex gap-1 mb-5 md:hidden overflow-x-auto pb-1">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`text-[11px] px-3 py-1.5 rounded-full shrink-0 flex items-center gap-1 ${tab === t.id ? "bg-primary text-white" : "bg-card-bg text-secondary border border-border-light"}`}>
                {t.label}
                {t.badge ? <span className="bg-red-500 text-white text-[9px] px-1 rounded-full">{t.badge}</span> : null}
              </button>
            ))}
          </div>

          {tab === "dashboard" && <DashboardTab onNavigate={(t: string) => setTab(t as Tab)} />}
          {tab === "bookings" && <BookingsTab />}
          {tab === "drivers" && <DriversTab />}
          {tab === "customers" && <CustomersTab />}
          {tab === "pricing" && <PricingTab />}
          {tab === "reports" && <ReportsTab />}
          {tab === "settings" && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}
