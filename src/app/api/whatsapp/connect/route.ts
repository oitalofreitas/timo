import { NextRequest, NextResponse } from "next/server";
import { initializeWhatsApp, getSession } from "@/lib/whatsapp";

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    console.log(`[WhatsApp] Iniciando conexão para sessão: ${sessionId}`);

    // Iniciar Baileys em background (não aguardar)
    initializeWhatsApp(sessionId, () => {
      console.log(`[WhatsApp] QR Code recebido para ${sessionId}`);
    }).catch((error) => {
      console.error(`[WhatsApp] Erro ao inicializar ${sessionId}:`, error.message);
    });

    // Aguardar um pouco para o QR Code ser gerado (máximo 30 segundos)
    let qrCode = "";
    for (let i = 0; i < 300; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const session = getSession(sessionId);
      if (session?.qrCode) {
        qrCode = session.qrCode;
        console.log(`[WhatsApp] QR Code obtido no attempt ${i + 1} para ${sessionId}`);
        break;
      }
    }

    if (!qrCode) {
      console.warn(`[WhatsApp] Timeout ao esperar QR Code para ${sessionId}`);
      return NextResponse.json(
        {
          error: "QR Code timeout",
          message: "Não foi possível gerar o QR Code. Verifique sua conexão com a internet.",
          hint: "O servidor precisa estar conectado aos servidores do WhatsApp para gerar um QR Code válido."
        },
        { status: 408 }
      );
    }

    console.log(`[WhatsApp] Conexão iniciada com sucesso para ${sessionId}`);
    return NextResponse.json({
      success: true,
      sessionId,
      qrCode,
      message: "QR Code gerado com sucesso - Escaneie com seu WhatsApp",
    });
  } catch (error) {
    console.error("[WhatsApp] Erro ao conectar:", error);
    return NextResponse.json(
      { error: "Failed to connect WhatsApp", details: String(error) },
      { status: 500 }
    );
  }
}
