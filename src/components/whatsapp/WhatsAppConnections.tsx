"use client";

import { useState, useEffect } from "react";
import { QRCodeScanner } from "./QRCodeScanner";
import { Plus } from "lucide-react";

interface ConnectionData {
  id: string;
  name: string;
  phoneNumber: string | null;
  status: string;
}

interface WhatsAppConnectionsProps {
  workspaceId: string;
}

export function WhatsAppConnections({ workspaceId }: WhatsAppConnectionsProps) {
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newConnectionName, setNewConnectionName] = useState("");

  async function loadConnections() {
    try {
      setIsLoading(true);
      // This would need a proper endpoint to fetch connections
      // For now, we'll just load an empty list
      setConnections([]);
    } catch (error) {
      console.error("Failed to load connections:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function createConnection() {
    if (!newConnectionName.trim()) return;

    try {
      // This would need a proper endpoint to create a connection
      // For now, we'll just add it to the state
      const newConnection: ConnectionData = {
        id: `conn_${Date.now()}`,
        name: newConnectionName,
        phoneNumber: null,
        status: "DISCONNECTED",
      };

      setConnections([...connections, newConnection]);
      setNewConnectionName("");
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create connection:", error);
    }
  }

  useEffect(() => {
    loadConnections();
  }, [workspaceId]);

  if (isLoading) {
    return <div className="text-center text-gray-600">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Conexões WhatsApp</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 transition"
        >
          <Plus className="h-5 w-5" />
          Nova Conexão
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
          <input
            type="text"
            placeholder="Nome da conexão"
            value={newConnectionName}
            onChange={(e) => setNewConnectionName(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
          <div className="flex gap-2">
            <button
              onClick={createConnection}
              className="flex-1 rounded bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700 transition"
            >
              Criar
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 rounded bg-gray-300 px-4 py-2 text-gray-800 font-medium hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {connections.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-gray-600">
            Nenhuma conexão WhatsApp configurada.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Clique em "Nova Conexão" para começar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {connections.map((connection) => (
            <QRCodeScanner
              key={connection.id}
              connectionId={connection.id}
              workspaceId={workspaceId}
              connectionName={connection.name}
              onSuccess={(phoneNumber) => {
                setConnections(
                  connections.map((c) =>
                    c.id === connection.id
                      ? { ...c, phoneNumber, status: "CONNECTED" }
                      : c
                  )
                );
              }}
              onError={(error) => {
                console.error(`Connection ${connection.id} error:`, error);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
