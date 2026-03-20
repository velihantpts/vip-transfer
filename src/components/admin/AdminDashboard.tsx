"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Calendar, Users, DollarSign, Car, Settings, BarChart3, UserCircle, LogOut, Truck } from "lucide-react";
import DashboardTab from "./tabs/DashboardTab";
import BookingsTab from "./tabs/BookingsTab";
import DriversTab from "./tabs/DriversTab";
import CustomersTab from "./tabs/CustomersTab";
import VehiclesTab from "./tabs/VehiclesTab";
import PricingTab from "./tabs/PricingTab";
import ReportsTab from "./tabs/ReportsTab";
import SettingsTab from "./tabs/SettingsTab";
type Tab = "dashboard" | "bookings" | "drivers" | "customers" | "vehicles" | "pricing" | "reports" | "settings";

const tabs = [
  { id: "dashboard" as Tab, label: "Dashboard", icon: TrendingUp },
  { id: "bookings" as Tab, label: "Rezervasyonlar", icon: Calendar },
  { id: "drivers" as Tab, label: "Suruculer", icon: Car },
  { id: "customers" as Tab, label: "Musteriler", icon: UserCircle },
  { id: "vehicles" as Tab, label: "Araclar", icon: Truck },
  { id: "pricing" as Tab, label: "Rotalar", icon: DollarSign },
  { id: "reports" as Tab, label: "Raporlar", icon: BarChart3 },
  { id: "settings" as Tab, label: "Ayarlar", icon: Settings },
];

export default function AdminDashboard({ onLogout }: { onLogout?: () => void }) {
  const [tab, setTab] = useState<Tab>("dashboard");

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    onLogout?.();
  };

  const renderTab = () => {
    switch (tab) {
      case "dashboard": return <DashboardTab onNavigate={(t: string) => setTab(t as Tab)} />;
      case "bookings": return <BookingsTab />;
      case "drivers": return <DriversTab />;
      case "customers": return <CustomersTab />;
      case "vehicles": return <VehiclesTab />;
      case "pricing": return <PricingTab />;
      case "reports": return <ReportsTab />;
      case "settings": return <SettingsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 min-h-screen bg-card-bg border-r border-border-light p-4 shrink-0 hidden md:flex flex-col">
          <div className="px-2 mb-8">
            <h1 className="text-sm font-bold text-text">Admin Panel</h1>
            <p className="text-[10px] text-tertiary mt-0.5">Antalya VIP Transfer</p>
          </div>
          <nav className="space-y-1 flex-1">
            {tabs.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  tab === item.id
                    ? "bg-primary text-white"
                    : "text-secondary hover:bg-surface hover:text-text"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="pt-4 border-t border-border-light">
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs text-red-500 hover:bg-red-50 transition-colors font-medium">
              <LogOut className="w-4 h-4" />
              Cikis Yap
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-5 sm:p-8 min-w-0">
          {/* Mobile tabs */}
          <div className="flex gap-1.5 mb-6 md:hidden overflow-x-auto pb-2">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`text-[11px] px-3 py-1.5 rounded-full shrink-0 font-medium transition-all ${tab === t.id ? "bg-primary text-white" : "bg-card-bg text-secondary border border-border-light"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Animated tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
