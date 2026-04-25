import express from "express";
import { makeWASocket, useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import path from "path";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const sessions = new Map<string, any>();
const AUTH_DIR = path.join("/tmp", "whatsapp-sessions");

interface WhatsAppSession {
  id: string;
  qrCode?: string;
  status: "CONNECTING" | "CONNECTED" | "DISCONNECTED" | "ERROR";
  socket?: any;
  phoneNumber?: string;
}

async function initializeWhatsApp(sessionId: string) {
  try {
    const sessionPath = path.join(AUTH_DIR, sessionId);
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const socket = makeWASocket({
      auth: state,
      browser: ["Timo", "Safari", "1.0.0"],
      syncFullHistory: false,
      connectTimeoutMs: 120000,
      keepAliveIntervalMs: 30000,
    });

    socket.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        const qrString = qr.toString();
        const session = sessions.get(sessionId);
        if (session) {
          session.qrCode = qrString;
          console.log(`[Baileys] QR Code gerado para ${sessionId}`);
        }
      }

      if (connection === "open") {
        const session = sessions.get(sessionId);
        if (session) {
          session.status = "CONNECTED";
          console.log(`[Baileys] Conectado: ${sessionId}`);
        }
      }

      if (connection === "close") {
        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;
        if (shouldReconnect) {
          console.log(`[Baileys] Reconectando: ${sessionId}`);
          setTimeout(() => initializeWhatsApp(sessionId), 3000);
        } else {
          const session = sessions.get(sessionId);
          if (session) {
            session.status = "DISCONNECTED";
          }
        }
      }
    });

    socket.ev.on("creds.update", saveCreds);

    const session: WhatsAppSession = {
      id: sessionId,
      status: "CONNECTING",
      socket,
      phoneNumber: "",
    };

    sessions.set(sessionId, session);
    console.log(`[Baileys] Sessão criada: ${sessionId}`);
  } catch (error) {
    console.error(`[Baileys] Erro ao inicializar ${sessionId}:`, error);
    const session = sessions.get(sessionId);
    if (session) {
      session.status = "ERROR";
    }
  }
}

// Endpoints

app.post("/api/whatsapp/connect", async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    console.log(`[Server] Conectando: ${sessionId}`);

    // Iniciar Baileys
    await initializeWhatsApp(sessionId);

    // Aguardar QR Code (máximo 30 segundos)
    let qrCode = "";
    for (let i = 0; i < 300; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const session = sessions.get(sessionId);
      if (session?.qrCode) {
        qrCode = session.qrCode;
        console.log(`[Server] QR Code obtido para ${sessionId}`);
        break;
      }
    }

    if (!qrCode) {
      return res.status(503).json({
        error: "QR Code generation failed",
        message: "Não foi possível gerar o QR Code",
      });
    }

    res.json({
      success: true,
      sessionId,
      qrCode,
      message: "QR Code gerado com sucesso",
    });
  } catch (error) {
    console.error("[Server] Erro ao conectar:", error);
    res.status(500).json({ error: String(error) });
  }
});

app.get("/api/whatsapp/status", (req, res) => {
  try {
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    const session = sessions.get(sessionId as string);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({
      sessionId: session.id,
      status: session.status,
      phoneNumber: session.phoneNumber || "",
      qrCode: session.qrCode || "",
    });
  } catch (error) {
    console.error("[Server] Erro ao obter status:", error);
    res.status(500).json({ error: String(error) });
  }
});

app.post("/api/whatsapp/send-message", async (req, res) => {
  try {
    const { sessionId, phoneNumber, message } = req.body;

    if (!sessionId || !phoneNumber || !message) {
      return res.status(400).json({
        error: "sessionId, phoneNumber, and message are required",
      });
    }

    const session = sessions.get(sessionId);
    if (!session?.socket) {
      return res.status(400).json({ error: "Session not connected" });
    }

    const formattedNumber = phoneNumber.replace(/\D/g, "");
    const jid = `${formattedNumber}@s.whatsapp.net`;

    await session.socket.sendMessage(jid, { text: message });

    res.json({
      success: true,
      message: "Message sent",
      sessionId,
      phoneNumber,
    });
  } catch (error) {
    console.error("[Server] Erro ao enviar mensagem:", error);
    res.status(500).json({ error: String(error) });
  }
});

app.post("/api/whatsapp/disconnect", async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    const session = sessions.get(sessionId);
    if (session?.socket) {
      await session.socket.logout();
      sessions.delete(sessionId);
    }

    res.json({
      success: true,
      message: "Session disconnected",
      sessionId,
    });
  } catch (error) {
    console.error("[Server] Erro ao desconectar:", error);
    res.status(500).json({ error: String(error) });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", sessions: sessions.size });
});

app.listen(PORT, () => {
  console.log(`[Server] Baileys rodando em porta ${PORT}`);
  console.log(`[Server] Health check: http://localhost:${PORT}/health`);
});
