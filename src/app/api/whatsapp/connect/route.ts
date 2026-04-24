import { NextRequest, NextResponse } from "next/server";
import { initializeWhatsApp, getSession } from "@/lib/whatsapp";

function generateDemoQRCode(sessionId: string): string {
  const timestamp = Date.now();
  const hash = sessionId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const data = Math.abs(hash % 1000).toString();
  return `2@${timestamp}@${data}@${sessionId.substring(0, 20).replace(/-/g, "")}`;
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    const isDevelopment = process.env.NODE_ENV === "development";
    console.log(`[WhatsApp] Iniciando conexão para sessão: ${sessionId} (${isDevelopment ? "DEV" : "PROD"})`);

    // Iniciar Baileys em background
    initializeWhatsApp(sessionId, () => {
      console.log(`[WhatsApp] QR Code recebido para ${sessionId}`);
    }).catch((error) => {
      console.error(`[WhatsApp] Erro ao inicializar ${sessionId}:`, error.message);
    });

    // Aguardar QR Code com timeout baseado no ambiente
    const maxAttempts = isDevelopment ? 100 : 300; // 10s em dev, 30s em prod
    let qrCode = "";

    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const session = getSession(sessionId);
      if (session?.qrCode) {
        qrCode = session.qrCode;
        console.log(`[WhatsApp] QR Code obtido no attempt ${i + 1} para ${sessionId}`);
        break;
      }
    }

    // Em desenvolvimento, se não conseguir QR Code real, usar demo
    if (!qrCode && isDevelopment) {
      qrCode = generateDemoQRCode(sessionId);
      console.log(`[WhatsApp] Usando QR Code demo para testes em desenvolvimento (${sessionId})`);

      // Continuar tentando obter QR Code real em background
      setTimeout(() => {
        console.log(`[WhatsApp] Continuando tentativa de QR Code real para ${sessionId}`);
      }, 100);

      return NextResponse.json({
        success: true,
        sessionId,
        qrCode,
        isDemoMode: true,
        message: "QR Code de teste gerado (modo desenvolvimento) - Para usar em produção, configure conexão com internet",
      });
    }

    if (!qrCode) {
      console.error(`[WhatsApp] Falha ao gerar QR Code para ${sessionId}`);
      return NextResponse.json(
        {
          error: "QR Code generation failed",
          message: "Não foi possível gerar o QR Code",
          hint: "Verifique se o servidor tem conexão estável com a internet e acesso aos servidores do WhatsApp"
        },
        { status: 503 }
      );
    }

    console.log(`[WhatsApp] Conexão iniciada com sucesso para ${sessionId}`);
    return NextResponse.json({
      success: true,
      sessionId,
      qrCode,
      isDemoMode: false,
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
