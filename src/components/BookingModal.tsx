"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Briefcase, Phone, Mail, User, MessageCircle, Check, ArrowRight, ArrowLeft, Copy, CheckCircle } from "lucide-react";
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
  { id: "eclass", name: "Mercedes E-Class", type: "Business Sedan", pax: "1-3", bags: "3", multiplier: 1 },
  { id: "vclass", name: "Mercedes V-Class", type: "VIP Minivan", pax: "1-7", bags: "7", multiplier: 1.3 },
  { id: "sclass", name: "Mercedes S-Class", type: "Luks Sedan", pax: "1-3", bags: "3", multiplier: 1.8 },
  { id: "sprinter", name: "Mercedes Sprinter", type: "VIP Minibus", pax: "1-12", bags: "12", multiplier: 2.2 },
];

const steps = [
  { num: 1, label: "Arac" },
  { num: 2, label: "Bilgiler" },
  { num: 3, label: "Onay" },
];

export default function BookingModal({ open, onClose, from, to, km, min, price }: BookingProps) {
  const [step, setStep] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState("eclass");
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", note: "" });
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [touched, setTouched] = useState({ name: false, phone: false });
  const [copied, setCopied] = useState(false);
  const { convert, symbol } = useCurrency();

  const vehicle = vehicles.find((v) => v.id === selectedVehicle)!;
  const finalPrice = Math.round(price * vehicle.multiplier);

  const whatsappMsg = encodeURIComponent(
    `Merhaba, transfer rezervasyonu yapmak istiyorum.\n\n${from} → ${to}\n${km} km · ~${min} dk\n${vehicle.name}\n${symbol}${convert(finalPrice)}\n\n${formData.name}\n${formData.phone}${bookingId ? `\nRez No: ${bookingId}` : ""}`
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
      // Fallback: still show success
    }
    setSubmitted(true);
    setStep(3);
  };

  const handleClose = () => {
    setStep(1);
    setFormData({ name: "", phone: "", email: "", note: "" });
    setSubmitted(false);
    setBookingId("");
    setTouched({ name: false, phone: false });
    setCopied(false);
    onClose();
  };

  const copyBookingId = () => {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with step indicator */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-400">{from} → {to}</p>
                <p className="text-sm font-semibold text-gray-900">{km} km · ~{min} dk</p>
              </div>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-900 transition-colors"><X className="w-5 h-5" /></button>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-1">
              {steps.map((s, i) => (
                <div key={s.num} className="flex items-center flex-1">
                  <div className="flex items-center gap-2 flex-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      step > s.num ? "bg-emerald-500 text-white" :
                      step === s.num ? "bg-amber-400 text-gray-900" :
                      "bg-gray-100 text-gray-400"
                    }`}>
                      {step > s.num ? <Check className="w-3 h-3" /> : s.num}
                    </div>
                    <span className={`text-[10px] font-medium ${step >= s.num ? "text-gray-900" : "text-gray-400"}`}>{s.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-[2px] flex-1 mx-2 rounded-full transition-colors ${step > s.num ? "bg-emerald-500" : "bg-gray-100"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step content with animation */}
          <AnimatePresence mode="wait">
            {submitted ? (
              /* Step 3: Success */
              <motion.div key="success" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Talebiniz Alindi</h3>

                {bookingId && (
                  <div className="bg-gray-50 rounded-xl px-5 py-3 mb-4 inline-flex items-center gap-3">
                    <div className="text-left">
                      <p className="text-[10px] text-gray-400">Rezervasyon No</p>
                      <p className="text-xl font-mono font-bold text-amber-500">{bookingId}</p>
                    </div>
                    <button
                      onClick={copyBookingId}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${copied ? "bg-emerald-100 text-emerald-600" : "bg-white text-gray-400 hover:text-gray-900 border border-gray-200"}`}
                      title="Kopyala"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                <p className="text-sm text-gray-500 mb-6">Bu numara ile rezervasyonunuzu sorgulayabilirsiniz.</p>

                <div className="flex flex-col gap-2">
                  <a
                    href={`https://wa.me/905551234567?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-[#20BD5A] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp ile Hizli Onay
                  </a>
                  {bookingId && (
                    <a
                      href={`https://wa.me/${formData.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Rezervasyon numaraniz: ${bookingId}\n${from} → ${to}\n${vehicle.name}\nFiyat: ${symbol}${convert(finalPrice)}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 text-gray-500 text-xs hover:text-gray-900 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" /> Bilgileri kendime gonder
                    </a>
                  )}
                </div>
              </motion.div>
            ) : step === 1 ? (
              /* Step 1: Vehicle */
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-5">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Arac Secin</p>
                <div className="space-y-2">
                  {vehicles.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVehicle(v.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        selectedVehicle === v.id ? "border-amber-400 bg-amber-50/50 shadow-sm" : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedVehicle === v.id ? "bg-amber-400 text-gray-900" : "bg-gray-100 text-gray-400"}`}>
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{v.name}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{v.pax}</span>
                          <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{v.bags}</span>
                        </div>
                      </div>
                      <p className={`font-bold text-lg ${selectedVehicle === v.id ? "text-amber-500" : "text-gray-900"}`}>{symbol}{convert(Math.round(price * v.multiplier))}</p>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(2)} className="w-full bg-gray-900 text-white py-3.5 rounded-full text-sm font-medium mt-4 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                  Devam Et <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              /* Step 2: Contact */
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-5">
                <button onClick={() => setStep(1)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-900 mb-4 transition-colors">
                  <ArrowLeft className="w-3 h-3" /> Arac Secimine Don
                </button>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Iletisim Bilgileri</p>
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input type="text" placeholder="Ad Soyad *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} onBlur={() => setTouched({ ...touched, name: true })} className={`w-full bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 border-2 ${touched.name && !formData.name ? "border-red-300" : "border-transparent"}`} />
                    {touched.name && !formData.name && <p className="text-[10px] text-red-500 mt-1 ml-1">Isim zorunludur</p>}
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input type="tel" placeholder="Telefon *" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} onBlur={() => setTouched({ ...touched, phone: true })} className={`w-full bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 border-2 ${touched.phone && !formData.phone ? "border-red-300" : "border-transparent"}`} />
                    {touched.phone && !formData.phone && <p className="text-[10px] text-red-500 mt-1 ml-1">Telefon zorunludur</p>}
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input type="email" placeholder="E-posta (opsiyonel)" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 border-2 border-transparent" />
                  </div>
                  <textarea placeholder="Not (ucus no, ozel istek vb.)" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} rows={2} className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 resize-none border-2 border-transparent" />
                </div>

                <div className="mt-4 p-3 rounded-xl bg-gray-50 text-xs text-gray-500">
                  <div className="flex justify-between mb-1"><span>{vehicle.name}</span><span className="font-semibold text-gray-900">{symbol}{convert(finalPrice)}</span></div>
                  <div className="flex justify-between"><span>{from} → {to}</span><span>{km} km</span></div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!formData.name || !formData.phone}
                  className="w-full bg-amber-400 text-gray-900 py-3.5 rounded-full text-sm font-semibold mt-4 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-300 transition-all hover:shadow-lg hover:shadow-amber-400/25"
                >
                  Rezervasyon Talebi Gonder
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
