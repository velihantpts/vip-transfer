import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/routes
export async function GET() {
  const { data, error } = await supabase
    .from("routes")
    .select("*")
    .eq("active", true)
    .order("km");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/routes
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabase.from("routes").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PATCH /api/routes
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;
  const { data, error } = await supabase.from("routes").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE /api/routes — soft delete
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const { error } = await supabase.from("routes").update({ active: false }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
