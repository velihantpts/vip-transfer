import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/bookings/track?id=B0001
export async function GET(req: NextRequest) {
  const bookingId = req.nextUrl.searchParams.get("id");

  if (!bookingId) {
    return NextResponse.json({ error: "Rezervasyon numarası gerekli" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("bookings")
    .select("booking_id, from_location, to_location, date, time, vehicle, price, status, customer_name, created_at")
    .eq("booking_id", bookingId.toUpperCase())
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Rezervasyon bulunamadı" }, { status: 404 });
  }

  return NextResponse.json(data);
}
