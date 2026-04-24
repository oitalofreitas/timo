import { NextRequest, NextResponse } from "next/server";
import { initializeWhatsApp } from "@/lib/whatsapp";

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    let qrCode = "";
    let waitCount = 0;

    // Aguardar QR Code do Baileys (máximo 15 segundos tanto em dev quanto em prod)
    await initializeWhatsApp(sessionId, (qr) => {
      qrCode = qr;
      console.log("QR Code gerado:", qrCode.substring(0, 50) + "...");
    });

    // Aguarda QR Code real
    while (!qrCode && waitCount < 150) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      waitCount++;
    }

    if (!qrCode) {
      return NextResponse.json(
        {
          error: "Failed to generate QR Code from WhatsApp",
          hint: "Make sure you have a stable internet connection and WhatsApp servers are reachable. QR codes can only be generated with a real connection to WhatsApp servers."
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId,
      qrCode,
      message: "QR Code gerado com sucesso - Escaneie com seu WhatsApp",
    });
  } catch (error) {
    console.error("Erro ao conectar WhatsApp:", error);
    return NextResponse.json(
      { error: "Failed to connect WhatsApp", details: String(error) },
      { status: 500 }
    );
  }
}
