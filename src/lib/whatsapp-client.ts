const BAILEYS_SERVER_URL = process.env.BAILEYS_SERVER_URL || "http://localhost:3001";

interface WhatsAppConnectResponse {
  success: boolean;
  connectionId: string;
  workspaceId: string;
  qrCode: string;
  message: string;
}

interface WhatsAppStatusResponse {
  id: string;
  phoneNumber: string;
  status: "DISCONNECTED" | "CONNECTING" | "CONNECTED" | "ERROR";
  qrCode: string;
  lastError: string | null;
  lastSync: string | null;
  createdAt: string;
  updatedAt: string;
}

interface WhatsAppError {
  error: string;
  message?: string;
}

async function callBaileysAPI<T>(
  endpoint: string,
  method: "GET" | "POST" = "POST",
  body?: any
): Promise<T> {
  const url = `${BAILEYS_SERVER_URL}${endpoint}`;

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = (await response.json()) as WhatsAppError;
      throw new Error(
        error.message || error.error || `HTTP ${response.status}`
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[WhatsApp Client] Error calling ${endpoint}:`, message);
    throw error;
  }
}

export async function connectWhatsApp(
  connectionId: string,
  workspaceId: string
): Promise<WhatsAppConnectResponse> {
  return callBaileysAPI<WhatsAppConnectResponse>(
    "/api/whatsapp/connect",
    "POST",
    { connectionId, workspaceId }
  );
}

export async function getWhatsAppStatus(
  connectionId: string
): Promise<WhatsAppStatusResponse> {
  return callBaileysAPI<WhatsAppStatusResponse>(
    `/api/whatsapp/status?connectionId=${connectionId}`,
    "GET"
  );
}

export async function sendWhatsAppMessage(
  connectionId: string,
  phoneNumber: string,
  message: string
): Promise<{ success: boolean; message: string }> {
  return callBaileysAPI(
    "/api/whatsapp/send-message",
    "POST",
    { connectionId, phoneNumber, message }
  );
}

export async function disconnectWhatsApp(
  connectionId: string,
  workspaceId: string
): Promise<{ success: boolean; message: string }> {
  return callBaileysAPI(
    "/api/whatsapp/disconnect",
    "POST",
    { connectionId, workspaceId }
  );
}

export async function checkBaileysHealth(): Promise<{
  status: string;
  database: string;
  sessions: number;
}> {
  return callBaileysAPI(
    "/health",
    "GET"
  );
}
