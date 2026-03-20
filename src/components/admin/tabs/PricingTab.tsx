"use client";

import { useState, useEffect } from "react";
import { Plus, X, Loader2, Save, Trash2 } from "lucide-react";
import { fetchRoutes, createRoute, updateRoute, deleteRoute } from "@/lib/admin-api";

interface RouteItem {
  id: string;
  from_id: string;
  to_id: string;
  km: number;
  min: number;
  base_price: number;
  slug: string;
  active: boolean;
}

export default function PricingTab() {
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<RouteItem | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ from_id: "airport", to_id: "", km: 0, min: 0, base_price: 0, slug: "" });
  const [saving, setSaving] = useState(false);
  const [inlineEdit, setInlineEdit] = useState<{ id: string; field: string; value: string } | null>(null);

  useEffect(() => {
    fetchRoutes()
      .then(setRoutes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleInlineSave = async (id: string, field: string, value: string) => {
    const numVal = Number(value);
    if (isNaN(numVal)) return;
    await updateRoute(id, { [field]: numVal });
    setRoutes((prev) => prev.map((r) => r.id === id ? { ...r, [field]: numVal } : r));
    setInlineEdit(null);
  };

  const handleAdd = async () => {
    if (!form.to_id || !form.base_price) return;
    setSaving(true);
    try {
      const slug = form.slug || `${form.from_id}-${form.to_id}-transfer`;
      const created = await createRoute({ ...form, slug, active: true });
      setRoutes([...routes, created]);
      setAdding(false);
      setForm({ from_id: "airport", to_id: "", km: 0, min: 0, base_price: 0, slug: "" });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu rotayi silmek istediginize emin misiniz?")) return;
    await deleteRoute(id);
    setRoutes((prev) => prev.filter((r) => r.id !== id));
  };

  const formatRouteName = (r: RouteItem) => {
    const from = r.from_id === "airport" ? "Havalimani" : r.from_id.charAt(0).toUpperCase() + r.from_id.slice(1);
    const to = r.to_id.charAt(0).toUpperCase() + r.to_id.slice(1);
    return `${from} → ${to}`;
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-text">Rotalar & Fiyatlandirma</h2>
        <button onClick={() => setAdding(true)} className="btn-primary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Yeni Rota
        </button>
      </div>

      {routes.length === 0 && (
        <div className="text-center py-12 text-secondary text-sm">Henuz rota yok. Supabase'de SQL'i calistirdiginizdan emin olun.</div>
      )}

      {/* Routes table */}
      <div className="bg-card-bg border border-border-light rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border-light bg-surface/50">
              <th className="text-left px-4 py-2.5 text-secondary font-medium">Rota</th>
              <th className="text-center px-4 py-2.5 text-secondary font-medium">Mesafe</th>
              <th className="text-center px-4 py-2.5 text-secondary font-medium">Sure</th>
              <th className="text-right px-4 py-2.5 text-secondary font-medium">Fiyat (TL)</th>
              <th className="text-right px-4 py-2.5 text-secondary font-medium w-16"></th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => (
              <tr key={r.id} className="border-b border-border-light last:border-0 hover:bg-surface/30">
                <td className="px-4 py-2.5 text-text font-medium">{formatRouteName(r)}</td>
                <td className="px-4 py-2.5 text-center text-secondary">
                  {inlineEdit?.id === r.id && inlineEdit.field === "km" ? (
                    <input
                      autoFocus
                      value={inlineEdit.value}
                      onChange={(e) => setInlineEdit({ ...inlineEdit, value: e.target.value })}
                      onBlur={() => handleInlineSave(r.id, "km", inlineEdit.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleInlineSave(r.id, "km", inlineEdit.value)}
                      className="w-14 text-center bg-surface rounded px-1 py-0.5 text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  ) : (
                    <button onClick={() => setInlineEdit({ id: r.id, field: "km", value: String(r.km) })} className="hover:text-primary transition-colors">{r.km} km</button>
                  )}
                </td>
                <td className="px-4 py-2.5 text-center text-secondary">
                  {inlineEdit?.id === r.id && inlineEdit.field === "min" ? (
                    <input
                      autoFocus
                      value={inlineEdit.value}
                      onChange={(e) => setInlineEdit({ ...inlineEdit, value: e.target.value })}
                      onBlur={() => handleInlineSave(r.id, "min", inlineEdit.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleInlineSave(r.id, "min", inlineEdit.value)}
                      className="w-14 text-center bg-surface rounded px-1 py-0.5 text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  ) : (
                    <button onClick={() => setInlineEdit({ id: r.id, field: "min", value: String(r.min) })} className="hover:text-primary transition-colors">{r.min} dk</button>
                  )}
                </td>
                <td className="px-4 py-2.5 text-right">
                  {inlineEdit?.id === r.id && inlineEdit.field === "base_price" ? (
                    <input
                      autoFocus
                      value={inlineEdit.value}
                      onChange={(e) => setInlineEdit({ ...inlineEdit, value: e.target.value })}
                      onBlur={() => handleInlineSave(r.id, "base_price", inlineEdit.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleInlineSave(r.id, "base_price", inlineEdit.value)}
                      className="w-20 text-right bg-surface rounded px-2 py-0.5 text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  ) : (
                    <button onClick={() => setInlineEdit({ id: r.id, field: "base_price", value: String(r.base_price) })} className="font-semibold text-text hover:text-primary transition-colors">
                      {r.base_price.toLocaleString("tr-TR")} TL
                    </button>
                  )}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button onClick={() => handleDelete(r.id)} className="text-tertiary hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-tertiary mt-3">Fiyat, mesafe ve sure degerlerine tiklayarak duzenleyebilirsiniz.</p>

      {/* Add route modal */}
      {adding && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setAdding(false)}>
          <div className="bg-card-bg rounded-2xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text">Yeni Rota</h3>
              <button onClick={() => setAdding(false)} className="text-tertiary hover:text-text"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-secondary block mb-1">Nereden (ID)</label>
                  <input value={form.from_id} onChange={(e) => setForm({ ...form, from_id: e.target.value })} placeholder="airport" className="w-full bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-[10px] text-secondary block mb-1">Nereye (ID)</label>
                  <input value={form.to_id} onChange={(e) => setForm({ ...form, to_id: e.target.value })} placeholder="belek" className="w-full bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-secondary block mb-1">KM</label>
                  <input type="number" value={form.km} onChange={(e) => setForm({ ...form, km: Number(e.target.value) })} className="w-full bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-[10px] text-secondary block mb-1">Dakika</label>
                  <input type="number" value={form.min} onChange={(e) => setForm({ ...form, min: Number(e.target.value) })} className="w-full bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-[10px] text-secondary block mb-1">Fiyat (TL)</label>
                  <input type="number" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: Number(e.target.value) })} className="w-full bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-secondary block mb-1">Slug (URL)</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="antalya-havalimani-belek-transfer" className="w-full bg-surface rounded-lg px-3 py-2 text-xs text-text border-none focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleAdd} disabled={saving || !form.to_id} className="flex-1 btn-primary py-2 rounded-lg text-xs disabled:opacity-50 flex items-center justify-center gap-1">
                <Save className="w-3.5 h-3.5" /> {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button onClick={() => setAdding(false)} className="px-4 py-2 bg-surface text-text rounded-lg text-xs">Iptal</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
