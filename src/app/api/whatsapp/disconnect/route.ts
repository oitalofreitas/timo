import { NextRequest, NextResponse } from "next/server";

const BAILEYS_SERVER = process.env.BAILEYS_SERVER_URL || "http://localhost:3001";

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    const response = await fetch(`${BAILEYS_SERVER}/api/whatsapp/disconnect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });

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
