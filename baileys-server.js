const express = require("express");
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const path = require("path");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const sessions = new Map();
const AUTH_DIR = path.join("/tmp", "whatsapp-sessions");

async function initializeWhatsApp(sessionId) {
  try {
    const sessionPath = path.join(AUTH_DIR, sessionId);
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const socket = makeWASocket({
      auth: state,
      browser: ["Timo", "Safari", "1.0.0"],
      syncFullHistory: false,
      connectTimeoutMs: 180000,
      keepAliveIntervalMs: 30000,
      generateHighQualityLinkPreview: false,
      maxRetries: 5,
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
          session.phoneNumber = socket.user?.id?.split(":")[0] || "";
          console.log(`[Baileys] Conectado: ${sessionId}`);
        }
      }

      if (connection === "close") {
        const shouldReconnect =
          (lastDisconnect?.error instanceof Boom
            ? lastDisconnect.error.output?.statusCode
            : null) !== DisconnectReason.loggedOut;
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

    const session = {
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

    // Aguardar QR Code (máximo 45 segundos)
    let qrCode = "";
    for (let i = 0; i < 450; i++) {
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

    const session = sessions.get(sessionId);

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
