import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST(request: NextRequest) {
  try {
    const { qrCode } = await request.json();

    if (!qrCode) {
      return NextResponse.json({ error: "qrCode is required" }, { status: 400 });
    }

    const imageUrl = await QRCode.toDataURL(qrCode);

    return NextResponse.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error("Erro ao gerar imagem QR:", error);
    return NextResponse.json(
      { error: "Failed to generate QR image", details: String(error) },
      { status: 500 }
    );
  }
}
