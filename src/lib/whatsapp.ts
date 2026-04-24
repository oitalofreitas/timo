import { makeWASocket, useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import path from "path";

interface WhatsAppSession {
  id: string;
  phoneNumber: string;
  status: "CONNECTED" | "DISCONNECTED" | "CONNECTING" | "ERROR";
  qrCode?: string;
  socket?: ReturnType<typeof makeWASocket>;
}

const sessions = new Map<string, WhatsAppSession>();
const AUTH_DIR = path.join(process.cwd(), ".whatsapp-sessions");

export async function initializeWhatsApp(sessionId: string, onQR?: (qr: string) => void) {
  try {
    const sessionPath = path.join(AUTH_DIR, sessionId);
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const socket = makeWASocket({
      auth: state,
      browser: ["Timo", "Safari", "1.0.0"],
      syncFullHistory: false,
      connectTimeoutMs: 60000,
      keepAliveIntervalMs: 30000,
    });

    socket.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        const qrString = qr.toString();
        if (onQR) onQR(qrString);
        const session = sessions.get(sessionId);
        if (session) {
          session.qrCode = qrString;
        }
      }

      if (connection === "open") {
        const session = sessions.get(sessionId);
        if (session) {
          session.status = "CONNECTED";
          session.socket = socket;
        }
      }

      if (connection === "close") {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) {
          await initializeWhatsApp(sessionId, onQR);
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
      phoneNumber: "",
      status: "CONNECTING",
      socket,
    };

    sessions.set(sessionId, session);
    return session;
  } catch (error) {
    console.error("Erro ao inicializar WhatsApp:", error);
    const session = sessions.get(sessionId);
    if (session) {
      session.status = "ERROR";
    }
    throw error;
  }
}

export function getSession(sessionId: string): WhatsAppSession | undefined {
  return sessions.get(sessionId);
}

export function getAllSessions(): WhatsAppSession[] {
  return Array.from(sessions.values());
}

export async function disconnectSession(sessionId: string) {
  const session = sessions.get(sessionId);
  if (session?.socket) {
    await session.socket.logout();
    sessions.delete(sessionId);
  }
}

export async function sendMessage(sessionId: string, phoneNumber: string, message: string) {
  const session = sessions.get(sessionId);
  if (!session?.socket) {
    throw new Error("Session not connected");
  }

  const formattedNumber = phoneNumber.replace(/\D/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;

  await session.socket.sendMessage(jid, { text: message });
}
