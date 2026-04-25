import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { disconnectWhatsApp } from "@/lib/whatsapp-client";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: connectionId } = await params;

    const connection = await prisma.whatsAppConnection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "Connection not found" },
        { status: 404 }
      );
    }

    if (connection.status === "CONNECTED" || connection.status === "CONNECTING") {
      try {
        await disconnectWhatsApp(connectionId, connection.workspaceId);
      } catch (err) {
        console.error("[API] Error disconnecting WhatsApp:", err);
      }
    }

    await prisma.whatsAppConnection.delete({
      where: { id: connectionId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Delete connection error:", error);
    return NextResponse.json(
      { error: "Failed to delete connection" },
      { status: 500 }
    );
  }
}
