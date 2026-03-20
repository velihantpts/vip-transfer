// Admin API helpers — all Supabase calls go through API routes

export async function fetchBookings(params?: { status?: string; date?: string; search?: string }) {
  const sp = new URLSearchParams();
  if (params?.status && params.status !== "all") sp.set("status", params.status);
  if (params?.date) sp.set("date", params.date);
  if (params?.search) sp.set("search", params.search);
  const res = await fetch(`/api/bookings?${sp}`);
  if (!res.ok) throw new Error("Rezervasyonlar yüklenemedi");
  return res.json();
}

export async function updateBooking(id: string, updates: Record<string, unknown>) {
  const res = await fetch("/api/bookings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...updates }),
  });
  if (!res.ok) throw new Error("Güncelleme başarısız");
  return res.json();
}

export async function fetchDrivers() {
  const res = await fetch("/api/drivers");
  if (!res.ok) throw new Error("Sürücüler yüklenemedi");
  return res.json();
}

export async function createDriver(driver: { name: string; phone: string; vehicle: string; plate: string }) {
  const res = await fetch("/api/drivers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(driver),
  });
  if (!res.ok) throw new Error("Sürücü eklenemedi");
  return res.json();
}

export async function updateDriver(id: string, updates: Record<string, unknown>) {
  const res = await fetch("/api/drivers", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...updates }),
  });
  if (!res.ok) throw new Error("Güncelleme başarısız");
  return res.json();
}

export async function fetchCustomers(search?: string) {
  const sp = search ? `?search=${encodeURIComponent(search)}` : "";
  const res = await fetch(`/api/customers${sp}`);
  if (!res.ok) throw new Error("Müşteriler yüklenemedi");
  return res.json();
}

export async function updateCustomer(id: string, updates: Record<string, unknown>) {
  const res = await fetch("/api/customers", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...updates }),
  });
  if (!res.ok) throw new Error("Güncelleme başarısız");
  return res.json();
}
