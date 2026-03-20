export interface Point {
  id: string;
  name: string;
  nameEn: string;
  lat: number;
  lng: number;
  type: "airport" | "district" | "hotel" | "attraction";
}

export interface Route {
  from: string;
  to: string;
  km: number;
  min: number;
  price: number; // TRY
  slug: string;
}

export const points: Point[] = [
  // Airport
  { id: "airport", name: "Antalya Havalimanı", nameEn: "Antalya Airport", lat: 36.8987, lng: 30.8005, type: "airport" },

  // Districts
  { id: "kaleici", name: "Kaleiçi", nameEn: "Kaleiçi (Old Town)", lat: 36.8841, lng: 30.7056, type: "district" },
  { id: "lara", name: "Lara", nameEn: "Lara", lat: 36.8545, lng: 30.7645, type: "district" },
  { id: "kundu", name: "Kundu", nameEn: "Kundu", lat: 36.8450, lng: 30.7800, type: "district" },
  { id: "konyaalti", name: "Konyaaltı", nameEn: "Konyaaltı", lat: 36.8693, lng: 30.6374, type: "district" },
  { id: "belek", name: "Belek", nameEn: "Belek", lat: 36.8597, lng: 31.0569, type: "district" },
  { id: "kemer", name: "Kemer", nameEn: "Kemer", lat: 36.5980, lng: 30.5594, type: "district" },
  { id: "side", name: "Side", nameEn: "Side", lat: 36.7673, lng: 31.3886, type: "district" },
  { id: "alanya", name: "Alanya", nameEn: "Alanya", lat: 36.5441, lng: 31.9956, type: "district" },
  { id: "kas", name: "Kaş", nameEn: "Kaş", lat: 36.1996, lng: 29.6354, type: "district" },
  { id: "manavgat", name: "Manavgat", nameEn: "Manavgat", lat: 36.7867, lng: 31.4437, type: "district" },
  { id: "olympos", name: "Olympos", nameEn: "Olympos", lat: 36.3963, lng: 30.4734, type: "district" },

  // Popular Hotels
  { id: "regnum", name: "Regnum Carya", nameEn: "Regnum Carya", lat: 36.8592, lng: 31.0250, type: "hotel" },
  { id: "titanic", name: "Titanic Deluxe Belek", nameEn: "Titanic Deluxe Belek", lat: 36.8520, lng: 31.0480, type: "hotel" },
  { id: "rixos-premium", name: "Rixos Premium Belek", nameEn: "Rixos Premium Belek", lat: 36.8450, lng: 31.0600, type: "hotel" },
  { id: "gloria", name: "Gloria Golf Resort", nameEn: "Gloria Golf Resort", lat: 36.8560, lng: 31.0320, type: "hotel" },
  { id: "susesi", name: "Susesi Luxury Resort", nameEn: "Susesi Luxury Resort", lat: 36.8480, lng: 31.0550, type: "hotel" },
  { id: "calista", name: "Calista Luxury Resort", nameEn: "Calista Luxury Resort", lat: 36.8510, lng: 31.0420, type: "hotel" },
  { id: "rixos-sungate", name: "Rixos Sungate", nameEn: "Rixos Sungate", lat: 36.5450, lng: 30.5650, type: "hotel" },
  { id: "maxx-royal", name: "Maxx Royal Belek", nameEn: "Maxx Royal Belek", lat: 36.8530, lng: 31.0380, type: "hotel" },

  // Attractions
  { id: "duden", name: "Düden Şelalesi", nameEn: "Düden Waterfalls", lat: 36.8612, lng: 30.7423, type: "attraction" },
  { id: "aspendos", name: "Aspendos", nameEn: "Aspendos Theatre", lat: 36.9390, lng: 31.1720, type: "attraction" },
  { id: "perge", name: "Perge Antik Kenti", nameEn: "Perge Ancient City", lat: 36.9614, lng: 30.8547, type: "attraction" },
  { id: "aquarium", name: "Antalya Akvaryum", nameEn: "Antalya Aquarium", lat: 36.8580, lng: 30.6470, type: "attraction" },
];

// Airport-based fixed routes
export const airportRoutes: Route[] = [
  { from: "airport", to: "lara", km: 12, min: 15, price: 550, slug: "antalya-havalimani-lara-transfer" },
  { from: "airport", to: "kaleici", km: 15, min: 20, price: 650, slug: "antalya-havalimani-kaleici-transfer" },
  { from: "airport", to: "kundu", km: 18, min: 20, price: 650, slug: "antalya-havalimani-kundu-transfer" },
  { from: "airport", to: "konyaalti", km: 20, min: 25, price: 700, slug: "antalya-havalimani-konyaalti-transfer" },
  { from: "airport", to: "belek", km: 35, min: 30, price: 850, slug: "antalya-havalimani-belek-transfer" },
  { from: "airport", to: "kemer", km: 60, min: 50, price: 1100, slug: "antalya-havalimani-kemer-transfer" },
  { from: "airport", to: "side", km: 75, min: 60, price: 1300, slug: "antalya-havalimani-side-transfer" },
  { from: "airport", to: "manavgat", km: 80, min: 65, price: 1350, slug: "antalya-havalimani-manavgat-transfer" },
  { from: "airport", to: "alanya", km: 130, min: 90, price: 1800, slug: "antalya-havalimani-alanya-transfer" },
  { from: "airport", to: "kas", km: 190, min: 150, price: 2500, slug: "antalya-havalimani-kas-transfer" },
  { from: "airport", to: "olympos", km: 85, min: 70, price: 1400, slug: "antalya-havalimani-olympos-transfer" },
];

// Hotel-based routes (popular hotel ↔ attraction/district)
export const hotelRoutes: Route[] = [
  // Belek hotels to attractions
  { from: "regnum", to: "kaleici", km: 40, min: 35, price: 900, slug: "regnum-carya-kaleici-transfer" },
  { from: "regnum", to: "aspendos", km: 25, min: 20, price: 700, slug: "regnum-carya-aspendos-transfer" },
  { from: "regnum", to: "side", km: 45, min: 40, price: 1000, slug: "regnum-carya-side-transfer" },
  { from: "regnum", to: "duden", km: 35, min: 30, price: 850, slug: "regnum-carya-duden-transfer" },
  { from: "titanic", to: "kaleici", km: 42, min: 37, price: 950, slug: "titanic-belek-kaleici-transfer" },
  { from: "titanic", to: "side", km: 43, min: 38, price: 950, slug: "titanic-belek-side-transfer" },
  // Kemer hotels
  { from: "rixos-sungate", to: "kaleici", km: 55, min: 45, price: 1050, slug: "rixos-sungate-kaleici-transfer" },
  { from: "rixos-sungate", to: "olympos", km: 30, min: 25, price: 750, slug: "rixos-sungate-olympos-transfer" },
];

// Calculate custom route price based on distance
export function calculateCustomPrice(km: number): number {
  if (km <= 15) return 550;
  if (km <= 25) return 700;
  if (km <= 40) return 900;
  if (km <= 60) return 1100;
  if (km <= 80) return 1300;
  if (km <= 100) return 1500;
  if (km <= 130) return 1800;
  if (km <= 160) return 2200;
  return 2500;
}

// Haversine distance
export function distanceKm(a: Point, b: Point): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)));
}

export function estimateMinutes(km: number): number {
  return Math.round(km * 0.8 + 10); // rough estimate
}

export function getPoint(id: string): Point | undefined {
  return points.find((p) => p.id === id);
}
