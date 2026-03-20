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

export async function fetchVehicles() {
  const res = await fetch("/api/vehicles");
  if (!res.ok) throw new Error("Araclar yuklenemedi");
  return res.json();
}

export async function createVehicle(vehicle: Record<string, unknown>) {
  const res = await fetch("/api/vehicles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vehicle),
  });
  if (!res.ok) throw new Error("Arac eklenemedi");
  return res.json();
}

export async function updateVehicle(id: string, updates: Record<string, unknown>) {
  const res = await fetch("/api/vehicles", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...updates }),
  });
  if (!res.ok) throw new Error("Guncelleme basarisiz");
  return res.json();
}

export async function fetchRoutes() {
  const res = await fetch("/api/routes");
  if (!res.ok) throw new Error("Rotalar yuklenemedi");
  return res.json();
}

export async function createRoute(route: Record<string, unknown>) {
  const res = await fetch("/api/routes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(route),
  });
  if (!res.ok) throw new Error("Rota eklenemedi");
  return res.json();
}

export async function updateRoute(id: string, updates: Record<string, unknown>) {
  const res = await fetch("/api/routes", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...updates }),
  });
  if (!res.ok) throw new Error("Guncelleme basarisiz");
  return res.json();
}

export async function deleteRoute(id: string) {
  const res = await fetch("/api/routes", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Silme basarisiz");
  return res.json();
}

export async function deleteVehicle(id: string) {
  const res = await fetch("/api/vehicles", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Silme basarisiz");
  return res.json();
}
