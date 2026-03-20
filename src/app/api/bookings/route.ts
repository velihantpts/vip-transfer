import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/bookings?status=new&date=2026-03-20
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const date = searchParams.get("date");
  const search = searchParams.get("search");

  let query = supabase.from("bookings").select("*").order("created_at", { ascending: false });

  if (status && status !== "all") query = query.eq("status", status);
  if (date) query = query.eq("date", date);
  if (search) query = query.or(`customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%,booking_id.ilike.%${search}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/bookings — create new booking
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Generate booking ID
  const count = await supabase.from("bookings").select("id", { count: "exact", head: true });
  const num = (count.count || 0) + 1;
  const bookingId = `B${String(num).padStart(4, "0")}`;

  const { data, error } = await supabase.from("bookings").insert({
    booking_id: bookingId,
    from_location: body.from,
    to_location: body.to,
    km: body.km,
    min: body.min,
    date: body.date,
    time: body.time,
    vehicle: body.vehicle,
    price: body.price,
    customer_name: body.customerName,
    customer_phone: body.customerPhone,
    customer_email: body.customerEmail || null,
    customer_lang: body.lang || "tr",
    note: body.note || null,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Upsert customer
  await supabase.from("customers").upsert({
    name: body.customerName,
    phone: body.customerPhone,
    email: body.customerEmail || null,
    lang: body.lang || "tr",
  }, { onConflict: "phone" });

  return NextResponse.json(data, { status: 201 });
}

// PATCH /api/bookings — update booking status/driver
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;

  const { data, error } = await supabase.from("bookings").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
