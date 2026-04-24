"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MessageCircle, Plus, QrCode, Wifi, WifiOff, Smartphone, RefreshCw, Trash2 } from "lucide-react";

type Connection = {
  id: string;
  phoneNumber?: string;
  status: "CONNECTED" | "DISCONNECTED" | "CONNECTING" | "ERROR";
};

const statusConfig = {
  CONNECTED: { label: "Conectado", color: "text-green-500 bg-green-500/20", icon: Wifi },
  DISCONNECTED: { label: "Desconectado", color: "text-muted-foreground bg-muted", icon: WifiOff },
  CONNECTING: { label: "Conectando...", color: "text-yellow-500 bg-yellow-500/20", icon: RefreshCw },
  ERROR: { label: "Erro", color: "text-red-500 bg-red-500/20", icon: WifiOff },
};

export default function WhatsAppPage() {
  const [openQR, setOpenQR] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [qrImage, setQrImage] = useState<string>("");
  const [qrExpiry, setQrExpiry] = useState(60);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");

  // Poll untuk status koneksi
  useEffect(() => {
    if (!currentSessionId || !scanning) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/whatsapp/status?sessionId=${currentSessionId}`);
        const data = await response.json();

        if (data.status === "CONNECTED") {
          setConnections((prev) => [
            ...prev,
            {
              id: currentSessionId,
              phoneNumber: data.phoneNumber || "(Conectado)",
              status: "CONNECTED",
            },
          ]);
          setOpenQR(false);
          setScanning(false);
          toast.success("WhatsApp conectado com sucesso!");
        } else if (data.status === "ERROR") {
          toast.error("Erro ao conectar WhatsApp");
          setScanning(false);
        }
      } catch (error) {
        console.error("Erro ao verificar status:", error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentSessionId, scanning]);

  // Timer para expiração do QR Code
  useEffect(() => {
    if (!scanning) return;

    const timer = setInterval(() => {
      setQrExpiry((prev) => {
        if (prev <= 1) {
          setScanning(false);
          toast.error("QR Code expirou");
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [scanning]);

  async function handleConnect() {
    try {
      const sessionId = `session-${Date.now()}`;
      setCurrentSessionId(sessionId);
      setOpenQR(true);
      setScanning(true);
      setQrExpiry(60);

      const response = await fetch("/api/whatsapp/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (data.qrCode) {
        // Converter QR Code string para imagem via API
        try {
          const qrResponse = await fetch("/api/whatsapp/qr-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ qrCode: data.qrCode }),
          });
          const qrData = await qrResponse.json();
          if (qrData.imageUrl) {
            setQrImage(qrData.imageUrl);
          }
        } catch (error) {
          console.error("Erro ao gerar imagem QR:", error);
        }
        toast.success("Escaneie o QR Code com seu WhatsApp");
      } else if (data.error) {
        toast.error(data.error);
        if (data.hint) {
          toast.message(data.hint, { duration: 5000 });
        }
        setScanning(false);
      } else {
        toast.error("Falha ao gerar QR Code");
        setScanning(false);
      }
    } catch (error) {
      toast.error("Erro ao conectar WhatsApp");
      console.error(error);
      setScanning(false);
    }
  }

  async function handleRefreshQR() {
    if (!currentSessionId) return;

    try {
      setQrExpiry(60);
      const response = await fetch("/api/whatsapp/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: currentSessionId }),
      });

      const data = await response.json();
      if (data.qrCode) {
        try {
          const qrResponse = await fetch("/api/whatsapp/qr-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ qrCode: data.qrCode }),
          });
          const qrData = await qrResponse.json();
          if (qrData.imageUrl) {
            setQrImage(qrData.imageUrl);
          }
        } catch (error) {
          console.error("Erro ao gerar imagem QR:", error);
        }
        toast.success("Novo QR Code gerado");
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Erro ao gerar novo QR Code");
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch("/api/whatsapp/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: id }),
      });

      setConnections((prev) => prev.filter((conn) => conn.id !== id));
      toast.success("Conexão removida");
    } catch (error) {
      toast.error("Erro ao remover conexão");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">WhatsApp</h1>
          <p className="text-muted-foreground text-sm">Conecte números ao seu CRM</p>
        </div>
        <Button size="sm" onClick={handleConnect}>
          <Plus className="mr-2 h-4 w-4" />
          Conectar Número
        </Button>
      </div>

      {/* Info banner */}
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <Smartphone className="h-5 w-5 text-primary mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Conexão via QR Code</p>
            <p className="text-xs text-muted-foreground">
              O Timo conecta o WhatsApp através do método QR Code (igual ao WhatsApp Web). Abra o WhatsApp
              no seu celular, vá em Dispositivos Conectados e escaneie o código.
            </p>
          </div>
        </div>
      </div>

      {/* Connections */}
      <div className="grid gap-4 sm:grid-cols-2">
        {connections.map((conn) => {
          const cfg = statusConfig[conn.status];
          return (
            <Card key={conn.id}>
              <CardHeader className="pb-2 flex flex-row items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">WhatsApp Conectado</CardTitle>
                    <p className="text-xs text-muted-foreground">{conn.phoneNumber || "(Não definido)"}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                  <cfg.icon className="h-3 w-3" />
                  {cfg.label}
                </div>
                <div className="flex gap-2">
                  {conn.status === "DISCONNECTED" ? (
                    <Button size="sm" className="flex-1" onClick={handleConnect}>
                      <QrCode className="mr-2 h-3 w-3" />
                      Reconectar
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="flex-1">
                      Ver mensagens
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDelete(conn.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Add card */}
        <button
          onClick={handleConnect}
          className="min-h-[140px] rounded-lg border border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
        >
          <Plus className="h-6 w-6" />
          <span className="text-sm">Conectar novo número</span>
        </button>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={openQR} onOpenChange={setOpenQR}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Escanear QR Code</DialogTitle>
            <DialogDescription>
              Abra o WhatsApp → Menu → Dispositivos Conectados → Conectar dispositivo
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            {scanning && qrImage ? (
              <div className="h-48 w-48 rounded-lg bg-white p-2 flex items-center justify-center">
                <img src={qrImage} alt="WhatsApp QR Code" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="h-48 w-48 rounded-lg bg-muted flex items-center justify-center">
                <div className="text-center space-y-3">
                  <QrCode className="h-16 w-16 text-muted-foreground mx-auto" />
                  <p className="text-xs text-muted-foreground">
                    {scanning ? "Gerando QR Code..." : "QR Code expirado"}
                  </p>
                </div>
              </div>
            )}
            <p className="text-xs text-center text-muted-foreground">
              O QR Code expira em <span className="font-medium text-foreground">{qrExpiry} segundos</span>
            </p>
            {scanning && (
              <p className="text-sm text-center font-medium text-primary">
                📱 Escaneie com seu WhatsApp
              </p>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleRefreshQR}
              disabled={!scanning}
            >
              <RefreshCw className="mr-2 h-3 w-3" />
              Gerar novo QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
