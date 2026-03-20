"use client";

import { useState, useEffect } from "react";
import { Plus, X, Loader2, Trash2, Image as ImageIcon, GripVertical, Save } from "lucide-react";
import { fetchVehicles, createVehicle, updateVehicle, deleteVehicle } from "@/lib/admin-api";

interface Vehicle {
  id: string;
  name: string;
  type: string;
  passengers: string;
  luggage: string;
  features: string[];
  specs: string[];
  price: number;
  multiplier: number;
  popular: boolean;
  images: string[];
  sort_order: number;
  active: boolean;
}

const emptyForm = {
  name: "", type: "", passengers: "", luggage: "",
  features: "", specs: "", price: 0, multiplier: 1.0,
  popular: false, images: "", sort_order: 0,
};

export default function VehiclesTab() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchVehicles()
      .then(setVehicles)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openEdit = (v: Vehicle) => {
    setEditing(v);
    setForm({
      name: v.name,
      type: v.type,
      passengers: v.passengers,
      luggage: v.luggage,
      features: v.features.join(", "),
      specs: (v.specs || []).join(", "),
      price: v.price,
      multiplier: v.multiplier,
      popular: v.popular,
      images: v.images.join("\n"),
      sort_order: v.sort_order,
    });
  };

  const openAdd = () => {
    setAdding(true);
    setForm({ ...emptyForm, sort_order: vehicles.length + 1 });
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      name: form.name,
      type: form.type,
      passengers: form.passengers,
      luggage: form.luggage,
      features: form.features.split(",").map((s) => s.trim()).filter(Boolean),
      specs: form.specs.split(",").map((s) => s.trim()).filter(Boolean),
      price: Number(form.price),
      multiplier: Number(form.multiplier),
      popular: form.popular,
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      sort_order: Number(form.sort_order),
      active: true,
    };

    try {
      if (editing) {
        const updated = await updateVehicle(editing.id, payload);
        setVehicles((prev) => prev.map((v) => v.id === editing.id ? updated : v));
        setEditing(null);
      } else {
        const created = await createVehicle(payload);
        setVehicles((prev) => [...prev, created]);
        setAdding(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu araci silmek istediginize emin misiniz?")) return;
    try {
      await deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      setEditing(null);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  const showForm = editing || adding;

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-text">Araclar</h2>
        <button onClick={openAdd} className="btn-primary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Yeni Arac
        </button>
      </div>

      {vehicles.length === 0 && !showForm && (
        <div className="text-center py-12 text-secondary text-sm">Henuz arac eklenmemis.</div>
      )}

      {/* Vehicle cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {vehicles.map((v) => (
          <div
            key={v.id}
            onClick={() => openEdit(v)}
            className="bg-card-bg border border-border-light rounded-xl p-4 cursor-pointer hover:border-border transition-colors"
          >
            <div className="flex gap-3">
              {v.images?.[0] && (
                <div className="w-20 h-14 rounded-lg overflow-hidden bg-surface shrink-0 relative">
                  <img src={v.images[0]} alt={v.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text truncate">{v.name}</p>
                  {v.popular && <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full shrink-0">Populer</span>}
                </div>
                <p className="text-xs text-tertiary">{v.type} · {v.passengers} yolcu · {v.luggage} bavul</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-semibold text-text">{v.price.toLocaleString("tr-TR")} TL</span>
                  <span className="text-[10px] text-tertiary">x{v.multiplier}</span>
                  <span className="text-[10px] text-tertiary">{v.images?.length || 0} foto</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => { setEditing(null); setAdding(false); }}>
          <div className="bg-card-bg rounded-2xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-text">{editing ? "Arac Duzenle" : "Yeni Arac"}</h3>
              <button onClick={() => { setEditing(null); setAdding(false); }} className="text-tertiary hover:text-text"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-secondary block mb-1">Arac Adi</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Mercedes V-Class" className="w-full bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-[10px] text-secondary block mb-1">Tip</label>
                  <input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="VIP Minivan" className="w-full bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-secondary block mb-1">Yolcu</label>
                  <input value={form.passengers} onChange={(e) => setForm({ ...form, passengers: e.target.value })} placeholder="1-7" className="w-full bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-[10px] text-secondary block mb-1">Bavul</label>
                  <input value={form.luggage} onChange={(e) => setForm({ ...form, luggage: e.target.value })} placeholder="7" className="w-full bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-[10px] text-secondary block mb-1">Sira</label>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="w-full bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-secondary block mb-1">Baz Fiyat (TL)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-[10px] text-secondary block mb-1">Carpan</label>
                  <input type="number" step="0.1" value={form.multiplier} onChange={(e) => setForm({ ...form, multiplier: Number(e.target.value) })} className="w-full bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-secondary block mb-1">Ozellikler (virgul ile)</label>
                <input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Wi-Fi, Klima, USB Sarj, Su" className="w-full bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>

              <div>
                <label className="text-[10px] text-secondary block mb-1">Detay Ozellikleri (virgul ile)</label>
                <input value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} placeholder="Deri koltuklar, Panoramik tavan, Burmester ses" className="w-full bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>

              <div>
                <label className="text-[10px] text-secondary block mb-1">Fotograf URL'leri (her satira bir URL)</label>
                <textarea
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  rows={3}
                  placeholder={"https://images.unsplash.com/photo-...\nhttps://images.unsplash.com/photo-..."}
                  className="w-full bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-mono"
                />
              </div>

              {/* Preview thumbnails */}
              {form.images && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {form.images.split("\n").filter(Boolean).map((url, i) => (
                    <div key={i} className="w-16 h-10 rounded-md overflow-hidden bg-surface shrink-0 relative border border-border-light">
                      <img src={url.trim()} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </div>
                  ))}
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} className="accent-primary" />
                <span className="text-xs text-text">Populer olarak isaretlE</span>
              </label>
            </div>

            <div className="flex gap-2 mt-5">
              <button onClick={handleSave} disabled={saving || !form.name} className="flex-1 btn-primary py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 disabled:opacity-50">
                <Save className="w-3.5 h-3.5" />
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
              {editing && (
                <button onClick={() => handleDelete(editing.id)} className="px-3 py-2 rounded-lg text-xs bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Sil
                </button>
              )}
              <button onClick={() => { setEditing(null); setAdding(false); }} className="px-4 py-2 bg-surface text-text rounded-lg text-xs">Iptal</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
