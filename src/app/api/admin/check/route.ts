import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });

  try {
    const decoded = Buffer.from(token, "base64").toString();
    const [email, timestamp] = decoded.split(":");
    const age = Date.now() - parseInt(timestamp);
    // Token expires after 24 hours
    if (age > 24 * 60 * 60 * 1000) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true, email });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
