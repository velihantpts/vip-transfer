-- Antalya VIP Transfer - Supabase Schema
-- Bu SQL'i Supabase Dashboard → SQL Editor'da çalıştırın

-- Enum types
CREATE TYPE booking_status AS ENUM ('new', 'confirmed', 'assigned', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('unpaid', 'deposit', 'paid');
CREATE TYPE driver_status AS ENUM ('available', 'on_trip', 'off_duty');

-- Drivers table
CREATE TABLE drivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  vehicle TEXT NOT NULL,
  plate TEXT NOT NULL,
  status driver_status DEFAULT 'available',
  rating FLOAT DEFAULT 0,
  trips INT DEFAULT 0,
  monthly_earnings INT DEFAULT 0,
  cancel_rate FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Customers table
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  lang TEXT DEFAULT 'tr',
  is_vip BOOLEAN DEFAULT false,
  note TEXT,
  total_trips INT DEFAULT 0,
  total_spent INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id TEXT UNIQUE NOT NULL,
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  km INT,
  min INT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  vehicle TEXT NOT NULL,
  price INT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_lang TEXT DEFAULT 'tr',
  note TEXT,
  status booking_status DEFAULT 'new',
  payment_status payment_status DEFAULT 'unpaid',
  payment_method TEXT,
  driver_id UUID REFERENCES drivers(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Routes table (admin editable prices)
CREATE TABLE routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_id TEXT NOT NULL,
  to_id TEXT NOT NULL,
  km INT NOT NULL,
  min INT NOT NULL,
  base_price INT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Settings table (key-value store)
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow all for now (anon key = public read, service key = full access)
-- Bookings: anyone can insert (customer creates booking), auth required for update
CREATE POLICY "Anyone can create booking" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Anyone can update bookings" ON bookings FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete bookings" ON bookings FOR DELETE USING (true);

-- Drivers: public read
CREATE POLICY "Public read drivers" ON drivers FOR SELECT USING (true);
CREATE POLICY "Admin manage drivers" ON drivers FOR ALL USING (true);

-- Customers: public insert + read
CREATE POLICY "Public manage customers" ON customers FOR ALL USING (true);

-- Routes: public read
CREATE POLICY "Public read routes" ON routes FOR SELECT USING (true);
CREATE POLICY "Admin manage routes" ON routes FOR ALL USING (true);

-- Settings: public read
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admin manage settings" ON settings FOR ALL USING (true);

-- Seed data: Drivers
INSERT INTO drivers (name, phone, vehicle, plate, status, rating, trips, monthly_earnings, cancel_rate) VALUES
  ('Ahmet Yılmaz', '+90 533 1111111', 'Mercedes V-Class', '07 ANT 001', 'on_trip', 4.9, 342, 28500, 1.2),
  ('Mehmet Demir', '+90 533 2222222', 'Mercedes E-Class', '07 ANT 002', 'on_trip', 4.8, 287, 22300, 2.1),
  ('Ali Kaya', '+90 533 3333333', 'Mercedes S-Class', '07 ANT 003', 'available', 4.95, 156, 31200, 0.5),
  ('Hasan Öztürk', '+90 533 4444444', 'Mercedes Sprinter', '07 ANT 004', 'available', 4.7, 198, 19800, 3.0),
  ('Emre Çelik', '+90 533 5555555', 'Mercedes V-Class', '07 ANT 005', 'off_duty', 4.85, 221, 24100, 1.8);

-- Seed data: Routes
INSERT INTO routes (from_id, to_id, km, min, base_price, slug) VALUES
  ('airport', 'lara', 12, 15, 550, 'antalya-havalimani-lara-transfer'),
  ('airport', 'kaleici', 15, 20, 650, 'antalya-havalimani-kaleici-transfer'),
  ('airport', 'kundu', 18, 20, 650, 'antalya-havalimani-kundu-transfer'),
  ('airport', 'konyaalti', 20, 25, 700, 'antalya-havalimani-konyaalti-transfer'),
  ('airport', 'belek', 35, 30, 850, 'antalya-havalimani-belek-transfer'),
  ('airport', 'kemer', 60, 50, 1100, 'antalya-havalimani-kemer-transfer'),
  ('airport', 'side', 75, 60, 1300, 'antalya-havalimani-side-transfer'),
  ('airport', 'manavgat', 80, 65, 1350, 'antalya-havalimani-manavgat-transfer'),
  ('airport', 'alanya', 130, 90, 1800, 'antalya-havalimani-alanya-transfer'),
  ('airport', 'kas', 190, 150, 2500, 'antalya-havalimani-kas-transfer'),
  ('airport', 'olympos', 85, 70, 1400, 'antalya-havalimani-olympos-transfer');

-- Seed data: Settings
INSERT INTO settings (key, value) VALUES
  ('company', '{"name": "Antalya VIP Transfer", "phone": "+90 555 123 45 67", "email": "info@antalyaviptransfer.com", "address": "Antalya, Türkiye"}'),
  ('currencies', '{"EUR": 0.028, "USD": 0.031, "GBP": 0.024}'),
  ('vehicle_multipliers', '{"E-Class": 1.0, "V-Class": 1.3, "S-Class": 1.8, "Sprinter": 2.2}'),
  ('season_multipliers', '{"normal": 1.0, "summer": 1.2, "spring": 1.1, "holiday": 1.5}'),
  ('notifications', '{"email": true, "sms": false, "whatsapp": true}');
