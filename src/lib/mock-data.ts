export type BookingStatus = "new" | "confirmed" | "assigned" | "completed" | "cancelled";
export type PaymentStatus = "unpaid" | "deposit" | "paid";
export type PaymentMethod = "cash" | "card" | "online";
export type DriverStatus = "available" | "on-trip" | "off-duty";

export interface Booking {
  id: string;
  date: string;
  time: string;
  from: string;
  to: string;
  km: number;
  min: number;
  vehicle: string;
  customer: string;
  phone: string;
  email?: string;
  note?: string;
  price: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  driver?: string;
  driverId?: string;
  createdAt: string;
  lang: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  plate: string;
  status: DriverStatus;
  rating: number;
  trips: number;
  monthlyEarnings: number;
  cancelRate: number;
  offDays: string[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  lang: string;
  totalTrips: number;
  totalSpent: number;
  isVip: boolean;
  note?: string;
  lastTrip: string;
}

export interface ActivityEvent {
  id: string;
  time: string;
  type: "new_booking" | "status_change" | "driver_assigned" | "completed" | "cancelled" | "payment";
  text: string;
}

export const mockBookings: Booking[] = [
  { id: "B001", date: "2026-03-20", time: "14:30", from: "Antalya Havalimanı", to: "Belek", km: 35, min: 30, vehicle: "Mercedes V-Class", customer: "Michael Schmidt", phone: "+49 151 1234567", email: "m.schmidt@email.de", note: "TK 1234 uçuşu, 2 çocuk koltuğu", price: 1105, status: "new", paymentStatus: "unpaid", createdAt: "2026-03-20T10:15:00", lang: "de" },
  { id: "B002", date: "2026-03-20", time: "16:00", from: "Antalya Havalimanı", to: "Kaleiçi", km: 15, min: 20, vehicle: "Mercedes E-Class", customer: "Elena Petrova", phone: "+7 926 1234567", price: 650, status: "confirmed", paymentStatus: "deposit", paymentMethod: "online", driver: "Ahmet Yılmaz", driverId: "D001", createdAt: "2026-03-19T22:30:00", lang: "ru" },
  { id: "B003", date: "2026-03-20", time: "18:45", from: "Antalya Havalimanı", to: "Kemer", km: 60, min: 50, vehicle: "Mercedes V-Class", customer: "James Wilson", phone: "+44 7911 123456", email: "james@email.co.uk", note: "4 large suitcases", price: 1430, status: "assigned", paymentStatus: "unpaid", driver: "Mehmet Demir", driverId: "D002", createdAt: "2026-03-19T18:00:00", lang: "en" },
  { id: "B004", date: "2026-03-19", time: "10:00", from: "Regnum Carya", to: "Kaleiçi", km: 40, min: 35, vehicle: "Mercedes S-Class", customer: "Hans Müller", phone: "+43 676 1234567", price: 1620, status: "completed", paymentStatus: "paid", paymentMethod: "card", driver: "Ali Kaya", driverId: "D003", createdAt: "2026-03-18T14:00:00", lang: "de" },
  { id: "B005", date: "2026-03-19", time: "09:00", from: "Antalya Havalimanı", to: "Alanya", km: 130, min: 90, vehicle: "Mercedes Sprinter", customer: "Sophie Martin", phone: "+33 6 12345678", price: 3960, status: "completed", paymentStatus: "paid", paymentMethod: "online", driver: "Hasan Öztürk", driverId: "D004", createdAt: "2026-03-17T20:00:00", lang: "fr" },
  { id: "B006", date: "2026-03-21", time: "11:00", from: "Antalya Havalimanı", to: "Side", km: 75, min: 60, vehicle: "Mercedes V-Class", customer: "Ayşe Demir", phone: "+90 532 1234567", note: "Bebek koltuğu gerekli", price: 1690, status: "new", paymentStatus: "unpaid", createdAt: "2026-03-20T08:00:00", lang: "tr" },
  { id: "B007", date: "2026-03-21", time: "07:30", from: "Belek", to: "Antalya Havalimanı", km: 35, min: 30, vehicle: "Mercedes E-Class", customer: "Karl Weber", phone: "+49 172 9876543", price: 850, status: "confirmed", paymentStatus: "paid", paymentMethod: "online", driver: "Ahmet Yılmaz", driverId: "D001", createdAt: "2026-03-20T06:00:00", lang: "de" },
  { id: "B008", date: "2026-03-18", time: "22:00", from: "Antalya Havalimanı", to: "Lara", km: 12, min: 15, vehicle: "Mercedes E-Class", customer: "Maria Rossi", phone: "+39 345 1234567", price: 550, status: "cancelled", paymentStatus: "unpaid", createdAt: "2026-03-17T10:00:00", lang: "it" },
  { id: "B009", date: "2026-03-22", time: "13:00", from: "Titanic Deluxe Belek", to: "Aspendos", km: 25, min: 20, vehicle: "Mercedes V-Class", customer: "Ivan Petrov", phone: "+7 903 9876543", price: 910, status: "new", paymentStatus: "unpaid", createdAt: "2026-03-20T11:00:00", lang: "ru" },
  { id: "B010", date: "2026-03-20", time: "20:00", from: "Antalya Havalimanı", to: "Kundu", km: 18, min: 20, vehicle: "Mercedes E-Class", customer: "Anna Kowalski", phone: "+48 512 123456", price: 650, status: "assigned", paymentStatus: "deposit", paymentMethod: "online", driver: "Emre Çelik", driverId: "D005", createdAt: "2026-03-19T16:00:00", lang: "pl" },
];

export const mockDrivers: Driver[] = [
  { id: "D001", name: "Ahmet Yılmaz", phone: "+90 533 1111111", vehicle: "Mercedes V-Class", plate: "07 ANT 001", status: "on-trip", rating: 4.9, trips: 342, monthlyEarnings: 28500, cancelRate: 1.2, offDays: ["2026-03-25", "2026-03-26"] },
  { id: "D002", name: "Mehmet Demir", phone: "+90 533 2222222", vehicle: "Mercedes E-Class", plate: "07 ANT 002", status: "on-trip", rating: 4.8, trips: 287, monthlyEarnings: 22300, cancelRate: 2.1, offDays: [] },
  { id: "D003", name: "Ali Kaya", phone: "+90 533 3333333", vehicle: "Mercedes S-Class", plate: "07 ANT 003", status: "available", rating: 4.95, trips: 156, monthlyEarnings: 31200, cancelRate: 0.5, offDays: ["2026-03-27"] },
  { id: "D004", name: "Hasan Öztürk", phone: "+90 533 4444444", vehicle: "Mercedes Sprinter", plate: "07 ANT 004", status: "available", rating: 4.7, trips: 198, monthlyEarnings: 19800, cancelRate: 3.0, offDays: [] },
  { id: "D005", name: "Emre Çelik", phone: "+90 533 5555555", vehicle: "Mercedes V-Class", plate: "07 ANT 005", status: "off-duty", rating: 4.85, trips: 221, monthlyEarnings: 24100, cancelRate: 1.8, offDays: ["2026-03-20", "2026-03-21"] },
];

export const mockCustomers: Customer[] = [
  { id: "C001", name: "Michael Schmidt", phone: "+49 151 1234567", email: "m.schmidt@email.de", lang: "de", totalTrips: 4, totalSpent: 4200, isVip: true, note: "Her zaman V-Class istiyor, 2 çocuk", lastTrip: "2026-03-20" },
  { id: "C002", name: "Elena Petrova", phone: "+7 926 1234567", lang: "ru", totalTrips: 2, totalSpent: 1300, isVip: false, lastTrip: "2026-03-20" },
  { id: "C003", name: "James Wilson", phone: "+44 7911 123456", email: "james@email.co.uk", lang: "en", totalTrips: 1, totalSpent: 1430, isVip: false, lastTrip: "2026-03-20" },
  { id: "C004", name: "Hans Müller", phone: "+43 676 1234567", lang: "de", totalTrips: 6, totalSpent: 8900, isVip: true, note: "S-Class tercih ediyor, sessiz sürücü istiyor", lastTrip: "2026-03-19" },
  { id: "C005", name: "Sophie Martin", phone: "+33 6 12345678", lang: "fr", totalTrips: 3, totalSpent: 5200, isVip: false, lastTrip: "2026-03-19" },
  { id: "C006", name: "Ayşe Demir", phone: "+90 532 1234567", lang: "tr", totalTrips: 8, totalSpent: 12400, isVip: true, note: "Sürekli müşteri, aile transferleri", lastTrip: "2026-03-21" },
  { id: "C007", name: "Karl Weber", phone: "+49 172 9876543", lang: "de", totalTrips: 2, totalSpent: 1700, isVip: false, lastTrip: "2026-03-21" },
];

export const mockActivity: ActivityEvent[] = [
  { id: "A1", time: "11:00", type: "new_booking", text: "Ivan Petrov — Titanic → Aspendos yeni talep" },
  { id: "A2", time: "10:15", type: "new_booking", text: "Michael Schmidt — Havalimanı → Belek yeni talep" },
  { id: "A3", time: "09:30", type: "driver_assigned", text: "Emre Çelik → Anna Kowalski (Kundu) atandı" },
  { id: "A4", time: "08:45", type: "status_change", text: "Karl Weber → Belek — onaylandı" },
  { id: "A5", time: "08:00", type: "payment", text: "Karl Weber — ₺850 online ödeme alındı" },
  { id: "A6", time: "07:30", type: "completed", text: "Hans Müller — Regnum → Kaleiçi tamamlandı" },
  { id: "A7", time: "06:00", type: "cancelled", text: "Maria Rossi — Havalimanı → Lara iptal edildi" },
];

export const weeklyRevenue = [
  { day: "Pzt", amount: 8500 },
  { day: "Sal", amount: 12300 },
  { day: "Çar", amount: 9800 },
  { day: "Per", amount: 15200 },
  { day: "Cum", amount: 18400 },
  { day: "Cmt", amount: 22100 },
  { day: "Paz", amount: 14700 },
];

export const popularRoutes = [
  { route: "Havalimanı → Belek", count: 145, revenue: 123250 },
  { route: "Havalimanı → Kaleiçi", count: 98, revenue: 63700 },
  { route: "Havalimanı → Kemer", count: 67, revenue: 73700 },
  { route: "Havalimanı → Side", count: 54, revenue: 70200 },
  { route: "Havalimanı → Alanya", count: 38, revenue: 68400 },
];

export const seasonMultipliers = [
  { name: "Normal", months: "Oca-Mar, Kas-Ara", multiplier: 1.0 },
  { name: "Yaz Sezonu", months: "Haz-Eyl", multiplier: 1.2 },
  { name: "Bahar", months: "Nis-May", multiplier: 1.1 },
  { name: "Ekim", months: "Eki", multiplier: 1.05 },
  { name: "Bayram", months: "Özel tarihler", multiplier: 1.5 },
];

export const vehicleMultipliers = [
  { vehicle: "Mercedes E-Class", multiplier: 1.0, label: "Baz fiyat" },
  { vehicle: "Mercedes V-Class", multiplier: 1.3, label: "x1.3" },
  { vehicle: "Mercedes S-Class", multiplier: 1.8, label: "x1.8" },
  { vehicle: "Mercedes Sprinter", multiplier: 2.2, label: "x2.2" },
];

export const settings = {
  companyName: "Antalya VIP Transfer",
  phone: "+90 555 123 45 67",
  email: "info@antalyaviptransfer.com",
  address: "Antalya, Türkiye",
  currencies: { EUR: 0.028, USD: 0.031, GBP: 0.024 },
  notifications: { email: true, sms: false, whatsapp: true },
};
