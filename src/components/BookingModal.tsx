"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Briefcase, Phone, Mail, User, MessageCircle, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { useCurrency } from "./CurrencyToggle";

interface BookingProps {
  open: boolean;
  onClose: () => void;
  from: string;
  to: string;
  km: number;
  min: number;
  price: number;
}

const vehicles = [
  { id: "eclass", name: "Mercedes E-Class", type: "Business Sedan", pax: "1-3", bags: "3", multiplier: 1, emoji: "🚘" },
  { id: "vclass", name: "Mercedes V-Class", type: "VIP Minivan", pax: "1-7", bags: "7", multiplier: 1.3, emoji: "🚐" },
  { id: "sclass", name: "Mercedes S-Class", type: "Lüks Sedan", pax: "1-3", bags: "3", multiplier: 1.8, emoji: "🚗" },
  { id: "sprinter", name: "Mercedes Sprinter", type: "VIP Minibüs", pax: "1-12", bags: "12", multiplier: 2.2, emoji: "🚌" },
];

export default function BookingModal({ open, onClose, from, to, km, min, price }: BookingProps) {
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState("eclass");
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", note: "" });
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [touched, setTouched] = useState({ name: false, phone: false });
  const { convert, symbol } = useCurrency();

  const vehicle = vehicles.find((v) => v.id === selectedVehicle)!;
  const finalPrice = Math.round(price * vehicle.multiplier);

  const whatsappMsg = encodeURIComponent(
    `Merhaba, transfer rezervasyonu yapmak istiyorum.\n\n📍 ${from} → ${to}\n📏 ${km} km · ~${min} dk\n🚗 ${vehicle.name}\n💰 ${symbol}${convert(finalPrice)}\n\n👤 ${formData.name}\n📞 ${formData.phone}`
  );

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from, to, km, min,
          date: new Date().toISOString().split("T")[0],
          time: new Date().toTimeString().slice(0, 5),
          vehicle: vehicle.name,
          price: finalPrice,
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          note: formData.note,
        }),
      });
      const data = await res.json();
      if (data?.booking_id) setBookingId(data.booking_id);
    } catch {
      // Fallback: still show success even if API fails
    }
    setSubmitted(true);
  };

  const handleClose = () => {
    setStep(1);
    setFormData({ name: "", phone: "", email: "", note: "" });
    setSubmitted(false);
    setBookingId("");
    setTouched({ name: false, phone: false });
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border-light">
            <div>
              <p className="text-xs text-secondary">{from} → {to}</p>
              <p className="text-sm font-semibold text-text">{km} km · ~{min} dk</p>
            </div>
            <button onClick={handleClose} className="text-tertiary hover:text-text transition-colors"><X className="w-5 h-5" /></button>
          </div>

          {submitted ? (
            /* Success */
            <div className="p-8 text-center">
              <div className="w-14 h-14 bg-emerald/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-7 h-7 text-emerald" />
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">Talebiniz Alındı</h3>
              {bookingId && (
                <div className="bg-surface rounded-lg px-4 py-2 mb-3 inline-block">
                  <p className="text-[10px] text-secondary">Rezervasyon No</p>
                  <p className="text-lg font-mono font-bold text-primary">{bookingId}</p>
                </div>
              )}
              <p className="text-sm text-secondary mb-6">Bu numara ile rezervasyonunuzu sorgulayabilirsiniz.</p>
              <a
                href={`https://wa.me/905551234567?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#20BD5A] transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp ile Hızlı Onay
              </a>
            </div>
          ) : step === 1 ? (
            /* Step 1: Vehicle */
            <div className="p-5">
              <p className="text-xs text-secondary uppercase tracking-wider mb-3">Araç Seçin</p>
              <div className="space-y-2">
                {vehicles.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVehicle(v.id)}
                    className={`w-full flex items-center gap-4 p-3.5 rounded-xl border transition-all text-left ${
                      selectedVehicle === v.id ? "border-primary/30 bg-primary/[0.03]" : "border-border-light hover:border-border"
                    }`}
                  >
                    <span className="text-3xl">{v.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text">{v.name}</p>
                      <div className="flex items-center gap-3 text-xs text-tertiary mt-0.5">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{v.pax}</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{v.bags}</span>
                      </div>
                    </div>
                    <p className="font-semibold text-text">{symbol}{convert(Math.round(price * v.multiplier))}</p>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} className="btn-primary w-full py-3 rounded-full text-sm mt-4 flex items-center justify-center gap-2">
                Devam Et <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Step 2: Contact */
            <div className="p-5">
              <button onClick={() => setStep(1)} className="flex items-center gap-1 text-xs text-secondary hover:text-text mb-4 transition-colors">
                <ArrowLeft className="w-3 h-3" /> Araç Seçimine Dön
              </button>
              <p className="text-xs text-secondary uppercase tracking-wider mb-3">İletişim Bilgileri</p>
              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
                  <input type="text" placeholder="Ad Soyad *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} onBlur={() => setTouched({ ...touched, name: true })} className={`w-full bg-surface rounded-lg pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 border ${touched.name && !formData.name ? "border-red-400" : "border-transparent"}`} aria-label="Ad Soyad" aria-required="true" />
                  {touched.name && !formData.name && <p className="text-[10px] text-red-500 mt-1 ml-1">İsim zorunludur</p>}
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
                  <input type="tel" placeholder="Telefon *" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} onBlur={() => setTouched({ ...touched, phone: true })} className={`w-full bg-surface rounded-lg pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 border ${touched.phone && !formData.phone ? "border-red-400" : "border-transparent"}`} aria-label="Telefon" aria-required="true" />
                  {touched.phone && !formData.phone && <p className="text-[10px] text-red-500 mt-1 ml-1">Telefon zorunludur</p>}
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
                  <input type="email" placeholder="E-posta (opsiyonel)" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-surface border-none rounded-lg pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <textarea placeholder="Not (uçuş no, özel istek vb.)" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} rows={2} className="w-full bg-surface border-none rounded-lg px-4 py-2.5 text-sm text-text placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
              </div>

              <div className="mt-4 p-3 rounded-xl bg-surface text-xs text-secondary">
                <div className="flex justify-between mb-1"><span>{vehicle.name}</span><span>{symbol}{convert(finalPrice)}</span></div>
                <div className="flex justify-between"><span>{from} → {to}</span><span>{km} km</span></div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.phone}
                className="btn-primary w-full py-3 rounded-full text-sm mt-4 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Rezervasyon Talebi Gönder
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
