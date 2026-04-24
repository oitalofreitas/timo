import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/whatsapp";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    const session = getSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({
      sessionId: session.id,
      status: session.status,
      phoneNumber: session.phoneNumber,
      qrCode: session.qrCode,
    });
  } catch (error) {
    console.error("Erro ao obter status:", error);
    return NextResponse.json(
      { error: "Failed to get status", details: String(error) },
      { status: 500 }
    );
  }
}
