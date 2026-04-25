import express from "express";
import { PrismaClient } from "./src/generated/prisma";
import { makeWASocket, useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import path from "path";
import fs from "fs";

const app = express();
app.use(express.json());

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const sessions = new Map<string, any>();

// Create auth directory for session files
const AUTH_DIR = path.join("/tmp", "whatsapp-auth");
if (!fs.existsSync(AUTH_DIR)) {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
}

interface WhatsAppSession {
  id: string;
  connectionId: string;
  workspaceId: string;
  qrCode?: string;
  status: "CONNECTING" | "CONNECTED" | "DISCONNECTED" | "ERROR";
  socket?: any;
  phoneNumber?: string;
}

async function loadAuthFromDB(connectionId: string): Promise<any> {
  try {
    const connection = await prisma.whatsAppConnection.findUnique({
      where: { id: connectionId },
    });

    if (!connection?.authData) {
      console.log(`[Auth] No saved auth data for ${connectionId}`);
      return null;
    }

    const sessionPath = path.join(AUTH_DIR, connectionId);

    try {
      fs.writeFileSync(
        path.join(sessionPath, "creds.json"),
        connection.authData
      );
      console.log(`[Auth] Loaded credentials from DB for ${connectionId}`);
      return sessionPath;
    } catch (err) {
      console.error(`[Auth] Failed to write creds for ${connectionId}:`, err);
      return null;
    }
  } catch (error) {
    console.error(`[Auth] Error loading from DB:`, error);
    return null;
  }
}

async function saveAuthToDB(connectionId: string, sessionPath: string) {
  try {
    const credsPath = path.join(sessionPath, "creds.json");
    if (fs.existsSync(credsPath)) {
      const authData = fs.readFileSync(credsPath);
      await prisma.whatsAppConnection.update({
        where: { id: connectionId },
        data: {
          authData: authData,
          lastSync: new Date(),
        },
      });
      console.log(`[Auth] Saved credentials to DB for ${connectionId}`);
    }
  } catch (error) {
    console.error(`[Auth] Error saving auth to DB:`, error);
  }
}

async function initializeWhatsApp(
  connectionId: string,
  workspaceId: string,
) {
  const sessionId = `${workspaceId}:${connectionId}`;

  try {
    console.log(`[Baileys] Initializing WhatsApp for ${sessionId}`);

    // Update status to CONNECTING
    await prisma.whatsAppConnection.update({
      where: { id: connectionId },
      data: { status: "CONNECTING", lastError: null },
    });

    // Try to load saved auth from DB
    let sessionPath = await loadAuthFromDB(connectionId);

    if (!sessionPath) {
      sessionPath = path.join(AUTH_DIR, connectionId);
      if (!fs.existsSync(sessionPath)) {
        fs.mkdirSync(sessionPath, { recursive: true });
      }
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const socket = makeWASocket({
      auth: state,
      browser: ["Timo", "Chrome", "1.0.0"],
      syncFullHistory: false,
      connectTimeoutMs: 120000,
      keepAliveIntervalMs: 30000,
      defaultQueryTimeoutMs: 60000,
    });

    let qrCodeGenerated = false;

    socket.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      // QR Code generation
      if (qr) {
        qrCodeGenerated = true;
        const qrString = qr.toString();
        console.log(`[QR] Generated QR code for ${sessionId}`);

        const session = sessions.get(sessionId);
        if (session) {
          session.qrCode = qrString;
        }

        // Save to DB
        try {
          await prisma.whatsAppConnection.update({
            where: { id: connectionId },
            data: { qrCode: qrString },
          });
        } catch (err) {
          console.error(`[QR] Failed to save QR code to DB:`, err);
        }

        // Broadcast to SSE clients
        broadcastQRCode(connectionId, qrString);
      }

      // Connection open
      if (connection === "open") {
        console.log(`[Connection] Connected: ${sessionId}`);
        qrCodeGenerated = false;

        const session = sessions.get(sessionId);
        if (session) {
          session.status = "CONNECTED";
          session.socket = socket;
        }

        // Get phone number from socket
        try {
          const phoneNumber = socket.user?.id?.split(":")[0];
          await prisma.whatsAppConnection.update({
            where: { id: connectionId },
            data: {
              status: "CONNECTED",
              phoneNumber: phoneNumber || null,
              qrCode: null,
              lastError: null,
            },
          });
        } catch (err) {
          console.error(`[Connection] Failed to update DB:`, err);
        }

        // Broadcast status change
        broadcastStatus(connectionId, "CONNECTED");
      }

      // Connection closed
      if (connection === "close") {
        console.log(`[Connection] Disconnected: ${sessionId}`);
        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;

        if (shouldReconnect && !qrCodeGenerated) {
          console.log(`[Connection] Reconnecting: ${sessionId}`);

          // Save auth before reconnecting
          await saveAuthToDB(connectionId, sessionPath);

          setTimeout(() => initializeWhatsApp(connectionId, workspaceId), 5000);
        } else {
          const session = sessions.get(sessionId);
          if (session) {
            session.status = "DISCONNECTED";
          }

          try {
            await prisma.whatsAppConnection.update({
              where: { id: connectionId },
              data: { status: "DISCONNECTED" },
            });
          } catch (err) {
            console.error(`[Connection] Failed to update DB:`, err);
          }

          // Broadcast status change
          broadcastStatus(connectionId, "DISCONNECTED");
        }
      }
    });

    // Save credentials on update
    socket.ev.on("creds.update", async () => {
      console.log(`[Creds] Saving credentials for ${sessionId}`);
      saveCreds();
      await saveAuthToDB(connectionId, sessionPath);
    });

    const session: WhatsAppSession = {
      id: sessionId,
      connectionId,
      workspaceId,
      status: "CONNECTING",
      socket,
    };

    sessions.set(sessionId, session);
    console.log(`[Baileys] Session created: ${sessionId}`);
  } catch (error) {
    console.error(`[Baileys] Error initializing ${sessionId}:`, error);
    const errorMessage = error instanceof Error ? error.message : String(error);

    try {
      await prisma.whatsAppConnection.update({
        where: { id: connectionId },
        data: {
          status: "ERROR",
          lastError: errorMessage,
        },
      });
    } catch (err) {
      console.error(`[Baileys] Failed to update error status:`, err);
    }

    const session = sessions.get(sessionId);
    if (session) {
      session.status = "ERROR";
    }
  }
}

// SSE clients for real-time updates
const sseClients = new Map<string, any[]>();

app.get("/api/whatsapp/events/:connectionId", (req, res) => {
  const { connectionId } = req.params;

  console.log(`[SSE] Client connected for ${connectionId}`);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Store client
  if (!sseClients.has(connectionId)) {
    sseClients.set(connectionId, []);
  }
  sseClients.get(connectionId)!.push(res);

  // Send initial state
  const sessionId = req.query.workspaceId
    ? `${req.query.workspaceId}:${connectionId}`
    : connectionId;
  const session = sessions.get(sessionId as string);

  if (session) {
    res.write(
      `data: ${JSON.stringify({ type: "state", status: session.status, qrCode: session.qrCode })}\n\n`
    );
  }

  // Handle client disconnect
  req.on("close", () => {
    console.log(`[SSE] Client disconnected for ${connectionId}`);
    const clients = sseClients.get(connectionId);
    if (clients) {
      const index = clients.indexOf(res);
      if (index > -1) {
        clients.splice(index, 1);
      }
    }
  });
});

function broadcastQRCode(connectionId: string, qrCode: string) {
  const clients = sseClients.get(connectionId);
  if (clients && clients.length > 0) {
    const message = `data: ${JSON.stringify({ type: "qr", qrCode })}\n\n`;
    clients.forEach((client) => {
      client.write(message);
    });
  }
}

function broadcastStatus(connectionId: string, status: string) {
  const clients = sseClients.get(connectionId);
  if (clients && clients.length > 0) {
    const message = `data: ${JSON.stringify({ type: "status", status })}\n\n`;
    clients.forEach((client) => {
      client.write(message);
    });
  }
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

app.post("/api/whatsapp/connect", async (req, res) => {
  try {
    const { connectionId, workspaceId } = req.body;

    if (!connectionId || !workspaceId) {
      return res.status(400).json({
        error: "connectionId and workspaceId are required",
      });
    }

    console.log(`[Server] Connecting: ${connectionId}`);

    // Verify connection exists in DB
    const connection = await prisma.whatsAppConnection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    // Initialize Baileys
    await initializeWhatsApp(connectionId, workspaceId);

    // Wait for QR Code (max 60 seconds)
    let qrCode = "";
    const sessionId = `${workspaceId}:${connectionId}`;

    for (let i = 0; i < 600; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const session = sessions.get(sessionId);
      if (session?.qrCode) {
        qrCode = session.qrCode;
        console.log(`[Server] QR Code obtained for ${sessionId}`);
        break;
      }
    }

    if (!qrCode) {
      return res.status(503).json({
        error: "QR Code generation failed",
        message: "Timeout waiting for QR code. Check server logs.",
        connectionId,
        sessionId,
      });
    }

    res.json({
      success: true,
      connectionId,
      workspaceId,
      qrCode,
      message: "QR Code generated successfully",
    });
  } catch (error) {
    console.error("[Server] Error connecting:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({
      error: "Internal server error",
      message: errorMessage,
    });
  }
});

app.get("/api/whatsapp/status", async (req, res) => {
  try {
    const { connectionId } = req.query;

    if (!connectionId) {
      return res.status(400).json({
        error: "connectionId is required",
      });
    }

    const connection = await prisma.whatsAppConnection.findUnique({
      where: { id: connectionId as string },
    });

    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    res.json({
      id: connection.id,
      phoneNumber: connection.phoneNumber || "",
      status: connection.status,
      qrCode: connection.qrCode || "",
      lastError: connection.lastError || null,
      lastSync: connection.lastSync,
      createdAt: connection.createdAt,
      updatedAt: connection.updatedAt,
    });
  } catch (error) {
    console.error("[Server] Error getting status:", error);
    res.status(500).json({
      error: String(error),
    });
  }
});

app.post("/api/whatsapp/send-message", async (req, res) => {
  try {
    const { connectionId, phoneNumber, message } = req.body;

    if (!connectionId || !phoneNumber || !message) {
      return res.status(400).json({
        error: "connectionId, phoneNumber, and message are required",
      });
    }

    const connection = await prisma.whatsAppConnection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    const sessionId = `${connection.workspaceId}:${connectionId}`;
    const session = sessions.get(sessionId);

    if (!session?.socket) {
      return res.status(400).json({
        error: "Session not connected",
      });
    }

    const formattedNumber = phoneNumber.replace(/\D/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    await session.socket.sendMessage(jid, { text: message });

    res.json({
      success: true,
      message: "Message sent",
      connectionId,
      phoneNumber,
    });
  } catch (error) {
    console.error("[Server] Error sending message:", error);
    res.status(500).json({
      error: String(error),
    });
  }
});

app.post("/api/whatsapp/disconnect", async (req, res) => {
  try {
    const { connectionId, workspaceId } = req.body;

    if (!connectionId || !workspaceId) {
      return res.status(400).json({
        error: "connectionId and workspaceId are required",
      });
    }

    const sessionId = `${workspaceId}:${connectionId}`;
    const session = sessions.get(sessionId);

    if (session?.socket) {
      try {
        await session.socket.logout();
      } catch (err) {
        console.error(`[Disconnect] Error logging out socket:`, err);
      }

      sessions.delete(sessionId);
    }

    await prisma.whatsAppConnection.update({
      where: { id: connectionId },
      data: {
        status: "DISCONNECTED",
        qrCode: null,
      },
    });

    res.json({
      success: true,
      message: "Session disconnected",
      connectionId,
    });
  } catch (error) {
    console.error("[Server] Error disconnecting:", error);
    res.status(500).json({
      error: String(error),
    });
  }
});

// Health check
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "ok",
      sessions: sessions.size,
      timestamp: new Date(),
      database: "connected",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      sessions: sessions.size,
      database: "disconnected",
      error: String(error),
    });
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("[Server] Shutting down gracefully...");

  for (const [sessionId, session] of sessions) {
    try {
      if (session?.socket) {
        await session.socket.end();
      }
    } catch (err) {
      console.error(`[Shutdown] Error closing session ${sessionId}:`, err);
    }
  }

  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`[Server] Baileys running on port ${PORT}`);
  console.log(`[Server] Health check: http://localhost:${PORT}/health`);
  console.log(`[Server] Database: Connected`);
  console.log(`[Server] Auth directory: ${AUTH_DIR}`);
});
