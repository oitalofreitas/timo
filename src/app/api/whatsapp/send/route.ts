import { NextRequest, NextResponse } from "next/server";
import { sendWhatsAppMessage } from "@/lib/whatsapp-client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { connectionId, phoneNumber, message } = await request.json();

    if (!connectionId || !phoneNumber || !message) {
      return NextResponse.json(
        {
          error:
            "connectionId, phoneNumber, and message are required",
        },
        { status: 400 }
      );
    }

    const connection = await prisma.whatsAppConnection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "Connection not found" },
        { status: 404 }
      );
    }

    const result = await sendWhatsAppMessage(
      connectionId,
      phoneNumber,
      message
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] Send message error:", error);
    const message =
      error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        error: "Failed to send WhatsApp message",
        message,
      },
      { status: 500 }
    );
  }
}
