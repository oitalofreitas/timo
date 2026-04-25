import { NextRequest, NextResponse } from "next/server";

const BAILEYS_SERVER = process.env.BAILEYS_SERVER_URL || "http://localhost:3001";

export async function POST(request: NextRequest) {
  try {
    const { sessionId, phoneNumber, message } = await request.json();

    if (!sessionId || !phoneNumber || !message) {
      return NextResponse.json(
        { error: "sessionId, phoneNumber, and message are required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${BAILEYS_SERVER}/api/whatsapp/send-message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, phoneNumber, message }),
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
