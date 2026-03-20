"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, Car, Clock, CheckCircle, AlertCircle, Loader2, X } from "lucide-react";

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: "Yeni Talep", color: "text-blue-700", bg: "bg-blue-100" },
  confirmed: { label: "Onaylandı", color: "text-amber-700", bg: "bg-amber-100" },
  assigned: { label: "Sürücü Atandı", color: "text-purple-700", bg: "bg-purple-100" },
  completed: { label: "Tamamlandı", color: "text-green-700", bg: "bg-green-100" },
  cancelled: { label: "İptal Edildi", color: "text-red-700", bg: "bg-red-100" },
};

const statusSteps = ["new", "confirmed", "assigned", "completed"];

interface BookingData {
  booking_id: string;
  from_location: string;
  to_location: string;
  date: string;
  time: string;
  vehicle: string;
  price: number;
  status: string;
  customer_name: string;
  created_at: string;
}

export default function TrackBooking({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [trackId, setTrackId] = useState("");
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackId.trim()) return;

    setError("");
    setBooking(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/bookings/track?id=${encodeURIComponent(trackId.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setBooking(data);
      } else {
        setError("Rezervasyon bulunamadı. Lütfen numaranızı kontrol edin.");
      }
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTrackId("");
    setBooking(null);
    setError("");
    onClose();
  };

  if (!open) return null;

  const currentStepIndex = booking ? statusSteps.indexOf(booking.status) : -1;

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
          className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-5 border-b border-border-light">
            <h3 className="text-base font-semibold text-text">Rezervasyon Sorgula</h3>
            <button onClick={handleClose} className="text-tertiary hover:text-text"><X className="w-5 h-5" /></button>
          </div>

          <div className="p-5">
            <form onSubmit={handleSearch} className="flex gap-2 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
                <input
                  type="text"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  placeholder="Rezervasyon No (ör: B0001)"
                  className="w-full bg-surface rounded-lg pl-10 pr-4 py-2.5 text-sm text-text border border-border-light focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button type="submit" disabled={loading || !trackId.trim()} className="bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 shrink-0">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sorgula"}
              </button>
            </form>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {booking && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {/* Status badge */}
                <div className="text-center">
                  <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full ${statusMap[booking.status]?.bg} ${statusMap[booking.status]?.color}`}>
                    <CheckCircle className="w-3.5 h-3.5" />
                    {statusMap[booking.status]?.label || booking.status}
                  </span>
                </div>

                {/* Progress bar */}
                {booking.status !== "cancelled" && (
                  <div className="flex items-center gap-1 px-2">
                    {statusSteps.map((step, i) => (
                      <div key={step} className="flex-1 flex items-center gap-1">
                        <div className={`h-1.5 flex-1 rounded-full transition-colors ${i <= currentStepIndex ? "bg-primary" : "bg-surface"}`} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Details */}
                <div className="bg-surface rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-secondary">Rezervasyon No</span>
                    <span className="text-text font-mono font-semibold">{booking.booking_id}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-secondary flex items-center gap-1"><MapPin className="w-3 h-3" />Güzergah</span>
                    <span className="text-text">{booking.from_location} → {booking.to_location}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-secondary flex items-center gap-1"><Calendar className="w-3 h-3" />Tarih / Saat</span>
                    <span className="text-text">{booking.date} {booking.time}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-secondary flex items-center gap-1"><Car className="w-3 h-3" />Araç</span>
                    <span className="text-text">{booking.vehicle}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-t border-border-light pt-3">
                    <span className="text-secondary font-medium">Toplam</span>
                    <span className="text-text font-semibold text-base">{booking.price.toLocaleString("tr-TR")} TL</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
