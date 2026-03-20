"use client";

import { useState } from "react";
import { Save, Shield } from "lucide-react";
import { settings } from "@/lib/mock-data";

export default function SettingsTab() {
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const [users] = useState([
    { name: "Admin", email: "admin@antalyaviptransfer.com", role: "admin" },
    { name: "Operatör", email: "operator@antalyaviptransfer.com", role: "operator" },
  ]);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <>
      <h2 className="text-lg font-semibold text-text mb-5">Ayarlar</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Company info */}
        <div className="bg-card-bg border border-border-light rounded-xl p-5">
          <h3 className="text-xs font-semibold text-text mb-4">Firma Bilgileri</h3>
          <div className="space-y-3">
            <div><label className="text-[10px] text-secondary block mb-1">Firma Adı</label><input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="w-full bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
            <div><label className="text-[10px] text-secondary block mb-1">Telefon</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
            <div><label className="text-[10px] text-secondary block mb-1">Email</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
            <div><label className="text-[10px] text-secondary block mb-1">Adres</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" /></div>
          </div>
        </div>

        {/* Currencies */}
        <div className="bg-card-bg border border-border-light rounded-xl p-5">
          <h3 className="text-xs font-semibold text-text mb-4">Döviz Kurları (1 TRY =)</h3>
          <div className="space-y-3">
            {Object.entries(form.currencies).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-xs text-text font-medium">{key}</span>
                <input value={val} onChange={(e) => setForm({ ...form, currencies: { ...form.currencies, [key]: parseFloat(e.target.value) || 0 } })} className="w-24 text-right bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card-bg border border-border-light rounded-xl p-5">
          <h3 className="text-xs font-semibold text-text mb-4">Bildirimler</h3>
          <p className="text-[10px] text-secondary mb-3">Yeni talep geldiğinde bildirim gönder:</p>
          <div className="space-y-2">
            {(["email", "sms", "whatsapp"] as const).map((ch) => (
              <label key={ch} className="flex items-center justify-between text-xs cursor-pointer">
                <span className="text-text capitalize">{ch === "email" ? "E-posta" : ch === "sms" ? "SMS" : "WhatsApp"}</span>
                <input type="checkbox" checked={form.notifications[ch]} onChange={() => setForm({ ...form, notifications: { ...form.notifications, [ch]: !form.notifications[ch] } })} className="accent-primary" />
              </label>
            ))}
          </div>
        </div>

        {/* Users */}
        <div className="bg-card-bg border border-border-light rounded-xl p-5">
          <h3 className="text-xs font-semibold text-text mb-4">Kullanıcılar</h3>
          <div className="space-y-2 mb-4">
            {users.map((u) => (
              <div key={u.email} className="flex items-center justify-between text-xs">
                <div>
                  <p className="text-text font-medium">{u.name}</p>
                  <p className="text-tertiary">{u.email}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>{u.role === "admin" ? "Admin" : "Operatör"}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-secondary p-2 bg-surface rounded-lg">
            <Shield className="w-3.5 h-3.5" />
            <span>2FA ayarları yakında eklenecek</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button onClick={save} className="btn-primary px-4 py-2 rounded-lg text-xs flex items-center gap-1.5"><Save className="w-3.5 h-3.5" />Kaydet</button>
        {saved && <span className="text-xs text-green-600">Kaydedildi!</span>}
      </div>
    </>
  );
}
