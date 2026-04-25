import { NextRequest, NextResponse } from "next/server";
import { disconnectWhatsApp } from "@/lib/whatsapp-client";
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

    const { connectionId, workspaceId } = await request.json();

    if (!connectionId || !workspaceId) {
      return NextResponse.json(
        { error: "connectionId and workspaceId are required" },
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

    if (connection.workspaceId !== workspaceId) {
      return NextResponse.json(
        { error: "Invalid workspace" },
        { status: 403 }
      );
    }

    const result = await disconnectWhatsApp(connectionId, workspaceId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[API] Disconnect error:", error);
    const message = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        error: "Failed to disconnect WhatsApp",
        message,
      },
      { status: 500 }
    );
  }
}
