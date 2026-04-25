import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppStatus } from "@/lib/whatsapp-client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const connectionId = searchParams.get("connectionId");

    if (!connectionId) {
      return NextResponse.json(
        { error: "connectionId is required" },
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

    const status = await getWhatsAppStatus(connectionId);
    return NextResponse.json(status);
  } catch (error) {
    console.error("[API] Status error:", error);
    const message = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        error: "Failed to get WhatsApp status",
        message,
      },
      { status: 500 }
    );
  }
}
