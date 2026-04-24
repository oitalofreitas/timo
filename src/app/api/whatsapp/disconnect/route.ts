import { NextRequest, NextResponse } from "next/server";
import { disconnectSession } from "@/lib/whatsapp";

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    await disconnectSession(sessionId);

    return NextResponse.json({
      success: true,
      message: "Session disconnected",
      sessionId,
    });
  } catch (error) {
    console.error("Erro ao desconectar:", error);
    return NextResponse.json(
      { error: "Failed to disconnect", details: String(error) },
      { status: 500 }
    );
  }
}
