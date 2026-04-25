import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 }
      );
    }

    const connections = await prisma.whatsAppConnection.findMany({
      where: { workspaceId },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        status: true,
        lastError: true,
        lastSync: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(connections);
  } catch (error) {
    console.error("[API] List connections error:", error);
    return NextResponse.json(
      { error: "Failed to list connections" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { workspaceId, name } = await request.json();

    if (!workspaceId || !name) {
      return NextResponse.json(
        { error: "workspaceId and name are required" },
        { status: 400 }
      );
    }

    const connection = await prisma.whatsAppConnection.create({
      data: {
        workspaceId,
        name,
        status: "DISCONNECTED",
      },
    });

    return NextResponse.json(connection, { status: 201 });
  } catch (error) {
    console.error("[API] Create connection error:", error);
    return NextResponse.json(
      { error: "Failed to create connection" },
      { status: 500 }
    );
  }
}
