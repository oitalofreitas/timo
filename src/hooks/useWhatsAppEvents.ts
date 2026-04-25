"use client";

import { useEffect, useCallback, useRef } from "react";

interface WhatsAppEvent {
  type: "qr" | "status" | "state";
  qrCode?: string;
  status?: string;
}

export function useWhatsAppEvents(
  connectionId: string,
  workspaceId: string,
  onQRCode?: (qr: string) => void,
  onStatus?: (status: string) => void
) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const isMountedRef = useRef(true);

  const connect = useCallback(() => {
    if (!connectionId || !workspaceId) {
      console.warn("[useWhatsAppEvents] Missing connectionId or workspaceId");
      return;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const baileyServerUrl = process.env.NEXT_PUBLIC_BAILEYS_SERVER_URL || "http://localhost:3001";
    const url = `${baileyServerUrl}/api/whatsapp/events/${connectionId}?workspaceId=${workspaceId}`;

    console.log(`[useWhatsAppEvents] Connecting to ${url}`);

    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      if (!isMountedRef.current) return;

      try {
        const data: WhatsAppEvent = JSON.parse(event.data);

        console.log(`[useWhatsAppEvents] Received event:`, data);

        if (data.type === "qr" && data.qrCode && onQRCode) {
          onQRCode(data.qrCode);
        }

        if (data.type === "status" && data.status && onStatus) {
          onStatus(data.status);
        }

        if (data.type === "state") {
          if (data.qrCode && onQRCode) {
            onQRCode(data.qrCode);
          }
          if (data.status && onStatus) {
            onStatus(data.status);
          }
        }
      } catch (error) {
        console.error(`[useWhatsAppEvents] Failed to parse event:`, error);
      }
    };

    eventSource.onerror = (error) => {
      console.error(`[useWhatsAppEvents] EventSource error:`, error);
      eventSource.close();

      // Attempt to reconnect after 3 seconds
      if (isMountedRef.current) {
        setTimeout(connect, 3000);
      }
    };

    eventSourceRef.current = eventSource;
  }, [connectionId, workspaceId, onQRCode, onStatus]);

  useEffect(() => {
    connect();

    return () => {
      isMountedRef.current = false;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [connect]);

  return {
    connected: eventSourceRef.current?.readyState === EventSource.OPEN,
    disconnect: () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    },
    reconnect: connect,
  };
}
