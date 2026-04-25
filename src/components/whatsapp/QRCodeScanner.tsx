"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { connectWhatsApp, getWhatsAppStatus, disconnectWhatsApp } from "@/lib/whatsapp-client";
import { useWhatsAppEvents } from "@/hooks/useWhatsAppEvents";
import { Loader, AlertCircle, CheckCircle, Trash2 } from "lucide-react";

interface QRCodeScannerProps {
  connectionId: string;
  workspaceId: string;
  connectionName?: string;
  onSuccess?: (phoneNumber: string) => void;
  onError?: (error: string) => void;
}

type Status = "DISCONNECTED" | "CONNECTING" | "CONNECTED" | "ERROR";

export function QRCodeScanner({
  connectionId,
  workspaceId,
  connectionName = "WhatsApp",
  onSuccess,
  onError,
}: QRCodeScannerProps) {
  const [qrCode, setQRCode] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("DISCONNECTED");
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRetry, setAutoRetry] = useState(true);

  // Listen for real-time events
  useWhatsAppEvents(
    connectionId,
    workspaceId,
    (qr) => {
      console.log("[QRCodeScanner] QR code received");
      setQRCode(qr);
      setError(null);
    },
    (newStatus) => {
      console.log("[QRCodeScanner] Status changed:", newStatus);
      setStatus(newStatus as Status);

      if (newStatus === "CONNECTED") {
        setQRCode(null);
        loadConnectionStatus();
        onSuccess?.(phoneNumber || "");
      }
    }
  );

  async function loadConnectionStatus() {
    try {
      const status = await getWhatsAppStatus(connectionId);
      setStatus(status.status as Status);
      setPhoneNumber(status.phoneNumber || null);
      if (status.lastError) {
        setError(status.lastError);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load status";
      setError(msg);
      onError?.(msg);
    }
  }

  async function handleConnect() {
    setIsLoading(true);
    setError(null);
    setQRCode(null);

    try {
      const result = await connectWhatsApp(connectionId, workspaceId);
      console.log("[QRCodeScanner] Connect result:", result);
      setQRCode(result.qrCode);
      setStatus("CONNECTING");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to connect";
      setError(msg);
      onError?.(msg);
      setStatus("ERROR");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDisconnect() {
    if (!confirm(`Desconectar ${connectionName}?`)) return;

    setIsLoading(true);
    setError(null);

    try {
      await disconnectWhatsApp(connectionId, workspaceId);
      setQRCode(null);
      setPhoneNumber(null);
      setStatus("DISCONNECTED");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to disconnect";
      setError(msg);
      onError?.(msg);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadConnectionStatus();
  }, []);

  return (
    <div className="w-full max-w-md space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{connectionName}</h3>
        {status === "CONNECTED" && (
          <button
            onClick={handleDisconnect}
            disabled={isLoading}
            className="text-red-600 hover:text-red-700 disabled:opacity-50"
            title="Disconnect"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2">
        {status === "DISCONNECTED" && (
          <div className="flex items-center gap-2 text-gray-600">
            <div className="h-2 w-2 rounded-full bg-gray-400" />
            Desconectado
          </div>
        )}
        {status === "CONNECTING" && (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader className="h-4 w-4 animate-spin" />
            Conectando...
          </div>
        )}
        {status === "CONNECTED" && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Conectado
          </div>
        )}
        {status === "ERROR" && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Erro
          </div>
        )}
      </div>

      {/* Phone Number */}
      {phoneNumber && (
        <div className="rounded bg-green-50 p-3">
          <p className="text-sm text-gray-600">Número conectado:</p>
          <p className="font-mono text-lg text-green-700">{phoneNumber}</p>
        </div>
      )}

      {/* QR Code */}
      {qrCode && status === "CONNECTING" && (
        <div className="space-y-3">
          <div className="flex justify-center rounded bg-gray-50 p-4">
            <div
              dangerouslySetInnerHTML={{
                __html: qrCode.replace(/^data:image\/[^;]+;base64,/, ""),
              }}
            />
          </div>
          <p className="text-center text-sm text-gray-600">
            Escaneie o QR code com seu WhatsApp
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {/* Connect Button */}
      {status === "DISCONNECTED" && (
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader className="h-4 w-4 animate-spin" />
              Conectando...
            </span>
          ) : (
            "Conectar WhatsApp"
          )}
        </button>
      )}

      {/* Waiting Message */}
      {status === "CONNECTING" && (
        <div className="rounded-lg bg-blue-50 p-3">
          <p className="text-sm text-blue-800">
            Aguardando confirmação no WhatsApp...
          </p>
        </div>
      )}
    </div>
  );
}
