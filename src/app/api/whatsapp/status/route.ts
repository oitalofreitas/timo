import { NextRequest, NextResponse } from "next/server";

const BAILEYS_SERVER = process.env.BAILEYS_SERVER_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    const response = await fetch(`${BAILEYS_SERVER}/api/whatsapp/status?sessionId=${sessionId}`);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[Vercel] Erro:", error);
    return NextResponse.json({ error: String(error) }, { status: 503 });
  }
}
