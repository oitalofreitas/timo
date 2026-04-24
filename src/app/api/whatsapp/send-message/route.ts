import { NextRequest, NextResponse } from "next/server";
import { sendMessage } from "@/lib/whatsapp";

export async function POST(request: NextRequest) {
  try {
    const { sessionId, phoneNumber, message } = await request.json();

    if (!sessionId || !phoneNumber || !message) {
      return NextResponse.json(
        { error: "sessionId, phoneNumber, and message are required" },
        { status: 400 }
      );
    }

    await sendMessage(sessionId, phoneNumber, message);

    return NextResponse.json({
      success: true,
      message: "Message sent",
      sessionId,
      phoneNumber,
    });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return NextResponse.json(
      { error: "Failed to send message", details: String(error) },
      { status: 500 }
    );
  }
}
